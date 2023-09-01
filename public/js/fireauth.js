// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-auth.js"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyD7Y9FweKOczZmB4j70pDvYiBEiuGyygsU",
    authDomain: "eventor-com.firebaseapp.com",
    projectId: "eventor-com",
    storageBucket: "eventor-com.appspot.com",
    messagingSenderId: "781037853217",
    appId: "1:781037853217:web:bdfcb61cbde7d27ddae160"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();

const user = auth.currentUser;




const signupEmail = document.getElementById('signup_email');
const signupName = document.getElementById('fullname');
const signupPass = document.getElementById('signup_password');
const signupForm = document.getElementById('signup_form');

const signinEmail = document.getElementById('email');
const signinPass = document.getElementById('password');
const signinForm = document.getElementById('signin_form');

signupForm.addEventListener("submit", (event) => {
    event.preventDefault();
    console.log("Signing Up")
    const email = signupEmail.value;
    const password = signupPass.value;
    const fullname = signupName.value;
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log(userCredential)
            axios.post('/signup', {
                uid: user.uid,
                name: fullname
              })
              .then(function (response) {
                console.log(response);
              })
              .catch(function (error) {
                console.log(error);
              });
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorMessage)
            // ..
        });
})

signinForm.addEventListener('submit', (event) => {
    event.preventDefault('Signing In');
    const email = signinEmail.value;
    const password = signinPass.value;

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            console.log(userCredential.user.accessToken)
            // ...
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorMessage)
        });
})


// Function to display user info
function displayUserInfo() {
    const user = auth.currentUser;
    if (user) {
        user.getIdToken()
            .then((idToken) => {
                // The ID token is available here
                console.log('ID Token:', idToken);
            })
            .catch((error) => {
                // Handle errors if any occur
                const errorCode = error.code;
                const errorMessage = error.message;
                console.error('Error getting ID token:', errorCode, errorMessage);
            });
    } else {
        console.log('Not logged in.');
    }
}

// Check the user's login status on page load
auth.onAuthStateChanged((user) => {
    displayUserInfo(user);
});