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
const signInButtons = document.getElementById('sign-in-button'); //sign in button
const signOutButtons = document.getElementById('sign-out-button'); //sign out button
const signInContainers = document.getElementById('sign-in-container'); //sign in container
const appContainer = document.getElementById('app-container'); //this is the app container
const aiChatButton = document.getElementById('aiChatBtn'); //this is ai chat button
const startAuthButton = document.getElementById('startAuth'); //biometric button

//to sign in with google account
signInButtons.addEventListener('click', () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
        .then((result) => {
            console.log(`Welcome ${result.user.displayName}`);
            signInContainers.style.display = 'none';
            appContainer.style.display = 'block';
            signOutButtons.style.display = 'block';
            aiChatButton.style.display = 'block';
            startAuthButton.style.display = 'block';
        })
        .catch((error) => {
            console.error('Error while signing in:', error);
        });
});

//this is the sign out functionality
signOutButtons.addEventListener('click', () => {
    signOut(auth)  //sign out logic
        .then(() => {
            console.log('User signed out.');
            appContainer.style.display = 'none'; 
            signInContainers.style.display = 'block';
            signOutButtons.style.display = 'none';
            aiChatButton.style.display = 'none';
            startAuthButton.style.display = 'none';
        })
        .catch((error) => {
            console.error('Error during sign-out:', error);
        });
});

onAuthStateChanged(auth, (user) => {  //it will change the auth states
    if (user) {
        signInContainers.style.display = 'none';
        appContainer.style.display = 'block';
        signOutButtons.style.display = 'block';
        aiChatButton.style.display = 'block';
        startAuthButton.style.display = 'block';
    } else {
        signInContainers.style.display = 'block';
        appContainer.style.display = 'none';
        signOutButtons.style.display = 'none';
        aiChatButton.style.display = 'none';
        startAuthButton.style.display = 'none';
    }
});
