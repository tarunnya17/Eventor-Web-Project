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

const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const signupBtn = document.getElementById('signupBtn');

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



auth.onAuthStateChanged((user) => {
    if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user
        const uid = user.uid;
        console.log("User logged in.")
        console.log(user)
        loginBtn.classList.toggle("hidden")
        loginBtn.classList.toggle("flex")
        signupBtn.classList.toggle("hidden")
        signupBtn.classList.toggle("flex")
        logoutBtn.classList.toggle("hidden")
        logoutBtn.classList.toggle("flex")
        //const loginDiv = document.getElementById("loginDiv");
        //loginDiv.innerHTML = '<button class="flex items-center p-5 rounded-full border-2 border-white h-6" data-modal-target="authentication-modal" data-modal-toggle="authentication-modal"> <p class="text-white" id="loginButtonP">Log&nbsp;Out</p> </button>'
        // ...
    } else {
        //const loginDiv = document.getElementById("loginDiv");
        //loginDiv.innerHTML = '<button id="logoutBtn" class="flex items-center p-5 rounded-full border-2 border-white h-6" data-modal-target="authentication-modal" data-modal-toggle="authentication-modal"> <p class="text-white" id="loginButtonP">Log&nbsp;In</p> </button>'
        console.log("Not logged in!")
    }
});

