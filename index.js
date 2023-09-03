if (process.env.NODE_ENV !== "production") {
    require("dotenv").config()
}
//Initialization
const express = require("express");
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');
const multer = require('multer');
const {storage} = require("./cloudy")

const upload = multer({ storage });
const uploadLocal = multer({ dest: './public/data/uploads/' })
//Mongoose Init
const uri = process.env.ATLAS_URI;
mongoose.connect(uri)
.then(()=> {
    console.log("Connected")
})

//Mogoose Scemas

const usersInfoSchema = new mongoose.Schema({
    uid: {
      type: String,
      required: true,
      unique: true,
    },
    fullname: {
      type: String,
      required: true,
    },
  });

// Create the UsersInfo model
const UsersInfo = mongoose.model('UsersInfo', usersInfoSchema);

module.exports = UsersInfo; 
  



app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static("node_modules"));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.get('/', (req, res) => {
    res.render('home');
});

app.get('/create-event', (req, res)=> {
    res.render("create_event");
})

app.post('/create-event', upload.any() ,(req, res)=> {
    try {
        console.log(req.body);
        console.log(req.files)
        res.render('create_event')
        // Your code here
    } catch (error) {
        console.error(error);
        res.status(500).send("Error uploading files.");
    }
})

app.post('/signup', (req,res)=> {
   const {uid , name} = req.body;
   const newUser = new UsersInfo({uid:uid, fullname: name});
   newUser.save()
   .then(()=> {
    console.log("User Info saved in mongodb")
   })
   console.log(uid);
   console.log(name);
})

app.use(() => {
    console.log("We have a request")
})

app.listen(3000, () => {
    console.log("Listening on port 3000")
})