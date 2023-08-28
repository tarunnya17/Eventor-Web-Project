//Initialization
const express = require("express");
const path = require('path');
const bodyParser = require('body-parser');
const app = express();


//import { initializeApp } from "firebase/app";
const firebase = require("firebase/app");
const firebase_auth = require("firebase/auth")

const firebaseConfig = {
    apiKey: "AIzaSyD7Y9FweKOczZmB4j70pDvYiBEiuGyygsU",
    authDomain: "eventor-com.firebaseapp.com",
    projectId: "eventor-com",
    storageBucket: "eventor-com.appspot.com",
    messagingSenderId: "781037853217",
    appId: "1:781037853217:web:bdfcb61cbde7d27ddae160"
};

const firebaseapp = firebase.initializeApp(firebaseConfig);
const auth = firebase_auth.getAuth();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static("node_modules"));
app.use(express.urlencoded({ extended: true }));


app.get('/', (req, res) => {
    res.render('home');
});

app.get('/create-event', (req, res)=> {
    res.render("create_event");
})

app.post('/sign-up', (req, res) => {
    const fullname = req.body.fullname;
    const email = req.body.email;
    const password = req.body.password;
    console.log(req.body)
    firebase_auth.createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log(user);
            console.log("Account Created!!")
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorMessage)
        })
        res.render('home');
})

app.post('/log-in', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    console.log(req.body)
    firebase_auth.signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log("Succesfully Signed In...")
            res.send("Succesfully Signed In...")
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorMessage);
            console.log("Failed to Sign In...")
        });
})

app.post('/recovery', (req, res) => {
    const userEmail = req.body.email;
    console.log(userEmail)
    firebase_auth.sendPasswordResetEmail(auth, userEmail)
        .then(()=> {
            res.send("Reset Password Link Sent Successfully!")
        })
        .catch((error) => {
            console.log(error.message)
            res.send(error.message)
        });
    
})

app.use(() => {
    console.log("We have a request")
})

app.listen(3000, () => {
    console.log("Listening on port 3000")
})