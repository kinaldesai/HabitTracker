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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const habitsCollection = collection(db, "habits");

let apiKey = "";
let model = null;

const addHabitButton = document.getElementById('addHabitButton');
const habitInput = document.getElementById('habitInput');
const habitList = document.getElementById('habitList');
const emptyMessage = document.getElementById('emptyMessage');

// Load habits and API key on page load
document.addEventListener("DOMContentLoaded", async () => {
    console.log('DOM is fully loaded');
    await loadAPIKey();
    await loadHabits();
});

async function loadAPIKey() {
    try {
        const docRef = doc(db, "apikey", "googleai");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            apiKey = docSnap.data().key;
            const genAI = new GoogleGenerativeAI(apiKey);
            model = genAI.getGenerativeModel({ model: "gemini-pro" });
        } else {
            console.error("API key is not found.");
        }
    } catch (error) {
        console.error("Error while loading API key:", error);
    }
}

// Load habits from Firestore
async function loadHabits() {
    try {
        habitList.innerHTML = "";
        const querySnapshot = await getDocs(habitsCollection);
        if (querySnapshot.empty) {
            emptyMessage.style.display = "block";
        } else {
            emptyMessage.style.display = "none";
            querySnapshot.forEach((doc) => {
                const habitData = { id: doc.id, ...doc.data() };
                addHabitToList(habitData);
            });
        }
    } catch (error) {
        console.error("Error loading habits:", error);
    }
}

// Add Habit Event Listener
addHabitButton.addEventListener("click", async () => {
    const habitText = habitInput.value.trim();
    if (habitText) {
        await addHabitToFirestore(habitText);
        habitInput.value = "";
    }
});

// Add habit to Firestore
async function addHabitToFirestore(habitText) {
    try {
        const docRef = await addDoc(habitsCollection, { text: habitText, streak: 0 });
        addHabitToList({ id: docRef.id, text: habitText, streak: 0 });
        emptyMessage.style.display = "none";
    } catch (error) {
        console.error("Error while adding the habit:", error);
    }
}

// Add habit to the UI
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
        let currentStreak = parseInt(streakElement.textContent.replace("Streak: ", ""));
        currentStreak++;

        await updateDoc(doc(db, "habits", id), { streak: currentStreak });
        streakElement.textContent = `Streak: ${currentStreak}`;

        const checkmark = document.createElement('span');
        checkmark.textContent = ' ✅';
        habitItem.querySelector('.habit-name').appendChild(checkmark);
    } catch (error) {
        console.error("Error updating habit streak:", error);
    }
}

// Edit the habit
async function editHabit(id) {
    try {
        const habitItem = document.querySelector(`.habit-item[data-id='${id}']`);
        const habitNameElement = habitItem.querySelector('.habit-name');
        const newName = prompt("Edit your habit:", habitNameElement.textContent);

        if (newName && newName.trim()) {
            habitNameElement.textContent = newName.trim();
            await updateDoc(doc(db, "habits", id), { text: newName.trim() });
        }
    } catch (error) {
        console.error("Error updating habit:", error);
    }
}

// Remove the habit
async function removeHabit(id, habitItem) {
    try {
        if (confirm("Are you sure you want to remove this habit?")) {
            await deleteDoc(doc(db, "habits", id));
            habitItem.remove();
            checkEmpty();
        }
    } catch (error) {
        console.error("Error removing habit:", error);
    }
}

// Check if habit list is empty
function checkEmpty() {
    if (habitList.children.length === 0) {
        emptyMessage.style.display = "block";
    } else {
        emptyMessage.style.display = "none";
    }
}
// Initialize the model 
async function initializeModel() {
    try {
        console.log('AI model initialized.');
    } catch (error) {
        console.error('Error initializing AI model:', error);
    }
}

// Fetch AI response 
async function getAIResponse(userMessage) {
    if (!model) {
        return 'AI model not initialized.';
    }

    try {
        // Generate content 
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

    // Rest of your code for handling user messages and AI responses for the application
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
        chatBox.scrollTop = chatBox.scrollHeight; // Scroll to the bottom of the messages to AI
    }

    function showToast(message, type) {
        const toast = document.createElement('div');
        toast.classList.add('toast', type);
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }
});

