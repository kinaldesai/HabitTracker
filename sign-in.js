// Import the necessary Firebase functions at the top level
import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js';
import { getAuth, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut } from 'https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js';

// Your web app's Firebase configuration
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

// DOM Elements
const signInButton = document.getElementById('sign-in-button');
const signOutButton = document.getElementById('sign-out-button');
const signInContainer = document.getElementById('sign-in-container');
const appContainer = document.getElementById('app-container');
const aiChatButton = document.getElementById('aiChatBtn');
const startAuthButton = document.getElementById('startAuth');
const aiChatSection = document.getElementById('ai-chat');

// Sign in with Google
signInButton.addEventListener('click', () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
        .then((result) => {
            // User signed in successfully
            console.log(`Welcome ${result.user.displayName}`);
            // Show the app container and buttons
            signInContainer.style.display = 'none';
            appContainer.style.display = 'block';
            signOutButton.style.display = 'block';
            aiChatButton.style.display = 'block';
            startAuthButton.style.display = 'block';
        })
        .catch((error) => {
            console.error('Error during sign-in:', error);
        });
});

aiChatButton.addEventListener('click', () => {
    console.log('AI Chat button clicked');  // Debugging log
    // Toggle AI chat section
    if (aiChatSection.style.display === 'none' || aiChatSection.style.display === '') {
        aiChatSection.style.display = 'block';
    } else {
        aiChatSection.style.display = 'none';
    }
});

// Sign out
signOutButton.addEventListener('click', () => {
    signOut(auth)
        .then(() => {
            console.log('User signed out.');
            // Hide app and buttons, show sign-in
            appContainer.style.display = 'none';
            signInContainer.style.display = 'block';
            signOutButton.style.display = 'none';
            aiChatButton.style.display = 'none';
            startAuthButton.style.display = 'none';
        })
        .catch((error) => {
            console.error('Error during sign-out:', error);
        });
});

aiChatButton.addEventListener('click', () => {
    console.log('AI Chat button clicked');  // Debugging log
    if (!aiChatSection) {
        console.log('aiChatSection is undefined or null');
        return; // Early exit if element is not found
    }
    console.log(`Current display state: ${aiChatSection.style.display}`);
    if (aiChatSection.style.display === 'none' || aiChatSection.style.display === '') {
        aiChatSection.style.display = 'block';
    } else {
        aiChatSection.style.display = 'none';
    }
});


// Monitor auth state
onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in
        console.log('User is signed in');
        signInContainer.style.display = 'none';
        appContainer.style.display = 'block';
        signOutButton.style.display = 'block';
        aiChatButton.style.display = 'block'; // AI chat button shown
        startAuthButton.style.display = 'block';
    } else {
        console.log('No user signed in');
        // No user is signed in
        signInContainer.style.display = 'block';
        appContainer.style.display = 'none';
        signOutButton.style.display = 'none';
        aiChatButton.style.display = 'none'; // AI chat button hidden
        startAuthButton.style.display = 'none';
    }
});
