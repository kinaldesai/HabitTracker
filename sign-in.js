// Import the necessary Firebase functions 
import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js';
import { getAuth, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut } from 'https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js';

// Firebase configuration
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
const auth = getAuth(app);

// these are the DOM Elements
const signInButton = document.getElementById('sign-in-button'); //sign in button
const signOutButton = document.getElementById('sign-out-button'); //sign out button
const signInContainer = document.getElementById('sign-in-container'); //sign in container
const appContainer = document.getElementById('app-container'); //app container
const aiChatButton = document.getElementById('aiChatBtn'); //ai chat button
const startAuthButton = document.getElementById('startAuth'); //biometric button
const aiChatSection = document.getElementById('ai-chat'); //ai chat section

// Sign in with Google button
signInButton.addEventListener('click', () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
        .then((result) => {
            console.log(`Welcome ${result.user.displayName}`);
            showAuthenticatedUI();
        })
        .catch((error) => {
            console.error('Error during sign-in:', error);
        });
});

// Sign out button code
signOutButton.addEventListener('click', () => {
    signOut(auth)
        .then(() => {
            console.log('User signed out.');
            showUnauthenticatedUI();
        })
        .catch((error) => {
            console.error('Error during sign-out:', error);
        });
});

const sendButton = document.getElementById('send-button');

sendButton.addEventListener('click', () => {
    console.log('Send button clicked');
    
    if (!aiChatSection) {
        console.error('aiChatSection is undefined or null');
        return;
    }
    
    const computedStyle = window.getComputedStyle(aiChatSection);
    const isHidden = computedStyle.display === 'none';

    console.log(`Before toggle: ${isHidden ? 'hidden' : 'visible'}`);

    aiChatSection.style.display = isHidden ? 'block' : 'none'; //to show the AI chat
    console.log(`AI Chat display toggled to: ${aiChatSection.style.display}`);
});

onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log('User is signed in');
        showAuthenticatedUI();
    } else {
        console.log('No user signed in');
        showUnauthenticatedUI();
    }
});

// Show authenticated UI
function showAuthenticatedUI() {
    signInContainer.style.display = 'none'; //to see the sign in button
    appContainer.style.display = 'block'; //app container
    signOutButton.style.display = 'block'; //sign out button is blocked
    aiChatButton.style.display = 'block'; //ai chat button is blocked
    startAuthButton.style.display = 'block'; //biometric button is blocked
}

function showUnauthenticatedUI() {
    signInContainer.style.display = 'block';
    appContainer.style.display = 'none';
    signOutButton.style.display = 'none';
    aiChatButton.style.display = 'none';
    startAuthButton.style.display = 'none';
    aiChatSection.style.display = 'none'; 
}
