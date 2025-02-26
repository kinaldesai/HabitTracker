// Import Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, doc, deleteDoc, updateDoc, getDoc } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";

// Import Google Generative AI
import { GoogleGenerativeAI } from "https://esm.run/@google/generative-ai";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyDI3TMT4snKgdBPwce9ykKje-aZowdibDM",
  authDomain: "habittracker-e0f8c.firebaseapp.com",
  projectId: "habittracker-e0f8c",
  storageBucket: "habittracker-e0f8c.appspot.com",
  messagingSenderId: "981480209548",
  appId: "1:981480209548:web:a6d09f08231cad84bccfa9",
  measurementId: "G-QD5WYJ4H8B"
};

// this is to Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const habitsCollection = collection(db, "habits");

let apiKey = "";
let model = null;

function initializeModel() {
    console.log("Model initialized");
}

document.addEventListener("DOMContentLoaded", () => {
    initializeModel();
});

// these are the DOM Elements
const addHabitButton = document.getElementById('addHabitButton'); //add habit button
const habitInput = document.getElementById('habitInput'); //habit input variable
const habitList = document.getElementById('habitList'); //habit list variable
const emptyMessage = document.getElementById('emptyMessage'); //empty messages variable
const aiChatButton = document.getElementById('aiChatBtn'); //ai chat button
const aiChatSection = document.getElementById('ai-chat'); //ai chat section to see the chat
const sendButton = document.getElementById('sendButton'); //send button of AI
const messageInput = document.getElementById('userInput'); //message input
const chatBox = document.getElementById('chatBox'); //chatbox for AI

document.addEventListener("DOMContentLoaded", async () => {
    console.log('DOM is fully loaded');
    await loadAPIKey();
    await loadHabits();
    initializeModel();
});

// Load API key from the firebase
async function loadAPIKey() {
    try {
        const docRef = doc(db, "apikey", "googleai");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            apiKey = docSnap.data().key;
            const genAI = new GoogleGenerativeAI(apiKey);
            model = genAI.getGenerativeModel({ model: "gemini 2.0 Flash" }); // Updated model version
            console.log("AI Model initialized successfully.");
        } else {
            console.error("API key is not found in Firestore.");
        }
    } catch (error) {
        console.error("Error while loading API key:", error);
    }
}

// to load the habits
async function loadHabits() {
    try {
        habitList.innerHTML = "";
        const querySnapshot = await getDocs(habitsCollection);
        if (querySnapshot.empty) {
            emptyMessage.style.display = "block";
        } else {
            emptyMessage.style.display = "none";
            querySnapshot.forEach((doc) => {
                addHabitToList({ id: doc.id, ...doc.data() });
            });
        }
    } catch (error) {
        console.error("Error while loading habits:", error);
    }
}

// to add new habit
addHabitButton.addEventListener("click", async () => {
    const habitText = habitInput.value.trim();
    if (habitText) {
        await addHabitToFirestore(habitText);
        habitInput.value = "";
    }
});

async function addHabitToFirestore(habitText) {
    try {
        const docRef = await addDoc(habitsCollection, { text: habitText, streak: 0 });
        addHabitToList({ id: docRef.id, text: habitText, streak: 0 });
        emptyMessage.style.display = "none";
    } catch (error) {
        console.error("Error while adding the habit:", error);
    }
}

function addHabitToList(habit) {
    const { id, text, streak } = habit;

    const habitItem = document.createElement('div');
    habitItem.classList.add('habit-item');
    habitItem.setAttribute('data-id', id);

    habitItem.innerHTML = `
        <span class="habit-name">${text}</span>  
        <button class="completeButton">Complete</button>
        <button class="editButton">Edit</button>
        <button class="removeButton">Remove</button>
        <span class="streak">Streak: ${streak}</span>
    `;

    habitList.appendChild(habitItem);

    habitItem.querySelector('.completeButton').addEventListener('click', () => completeHabit(id));
    habitItem.querySelector('.editButton').addEventListener('click', () => editHabit(id));
    habitItem.querySelector('.removeButton').addEventListener('click', () => removeHabit(id, habitItem));
}

async function completeHabit(id) {
    try {
        const habitItem = document.querySelector(`.habit-item[data-id='${id}']`);
        const streakElement = habitItem.querySelector('.streak');
        let currentStreak = parseInt(streakElement.textContent.replace("Streak: ", "")) + 1;

        await updateDoc(doc(db, "habits", id), { streak: currentStreak });
        streakElement.textContent = `Streak: ${currentStreak}`;

        const checkmark = document.createElement('span');
        checkmark.textContent = ' ✅';
        habitItem.querySelector('.habit-name').appendChild(checkmark);
    } catch (error) {
        console.error("Error updating habit streak:", error);
    }
}

async function editHabit(id) {
    try {
        const habitItem = document.querySelector(`.habit-item[data-id='${id}']`);
        const habitNameElement = habitItem.querySelector('.habit-name');
        const newName = prompt("Edit your habit:", habitNameElement.textContent);

        if (newName && newName.trim()) {
            await updateDoc(doc(db, "habits", id), { text: newName.trim() });
            habitNameElement.textContent = newName.trim();
        }
    } catch (error) {
        console.error("Error updating habit:", error);
    }
}

async function removeHabit(id, habitItem) {
    try {
        if (confirm("Are you sure you want to remove this habit?")) {
            await deleteDoc(doc(db, "habits", id));
            habitItem.remove();
            checkEmpty();
        }
    } catch (error) {
        console.error("Error while removing habit:", error);
    }
}

function checkEmpty() {
    emptyMessage.style.display = habitList.children.length === 0 ? "block" : "none";
}

// Fetch AI response
async function getAIResponse(userMessage) {
    if (!model) return 'AI model not initialized.'; //error will show up if this is not initialized correctly
    try {
        const result = await model.generateContent(userMessage);
        return result.response.text() || "Sorry, I didn’t understand that.";
    } catch (error) {
        console.error('AI error:', error);
        return 'Error: Could not generate response.';
    }
}

// Initialize the model
document.addEventListener("DOMContentLoaded", function () {
    initializeModel();

    const aiChatButton = document.getElementById('aiChatBtn');
    const aiChatSection = document.getElementById('ai-chat');

    aiChatSection.style.display = 'none';

    aiChatButton.addEventListener('click', function () {
        if (aiChatSection.style.display === 'none' || aiChatSection.style.display === '') {
            aiChatSection.style.display = 'block';
        } else {
            aiChatSection.style.display = 'none';
        }
    });

    // for handling user messages and AI responses for the application
    const sendButton = document.getElementById('sendButton');
    const messageInput = document.getElementById('userInput');
    const chatBox = document.getElementById('chatBox');

    sendButton.addEventListener("click", async () => {
        const userMessage = messageInput.value.trim();
        if (userMessage) {
            displayMessage(userMessage, 'user');
            const aiMessage = await getAIResponse(userMessage);
            displayMessage(aiMessage, 'ai');
            messageInput.value = '';
        } else {
            showToast("Please type a message", "warning");
        }
    });

    function displayMessage(message, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add(sender === 'ai' ? 'ai-message' : 'user-message');
        messageDiv.textContent = `${sender === 'ai' ? 'AI' : 'You'}: ${message}`;
        chatBox.appendChild(messageDiv);
        chatBox.scrollTop = chatBox.scrollHeight; 
        }

    function showToast(message, type) {   //to see the notification
        const toast = document.createElement('div');
        toast.classList.add('toast', type);
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }
});
