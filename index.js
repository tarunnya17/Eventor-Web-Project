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

const eventSchema = new mongoose.Schema({
  event_type: String,
  event_title: String,
  startdate: Date,
  enddate: Date,
  starttime: String,
  endtime: String,
  venue: String,
  contactmail: String,
  payment: String,
  contactphone: String,
  ticket_price: Number,
  banner_image:
  {url: String,
    filename: String},
  poster_image:
    {url: String,
    filename: String},
  description: String,
  additionalinfo: String,
});


// Create the UsersInfo model
const UsersInfo = mongoose.model('UsersInfo', usersInfoSchema);
const Event = mongoose.model('EventInfo', eventSchema);




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

app.post('/create-event', upload.any() , async (req, res)=> {
    try {
        console.log(req.body);
        console.log(req.files);
        console.log(req.body.event_type);
        const images = req.files.map(f => ({url: f.path, filename: f.filename}))
        console.log(images[0])
        const eventData = {
          event_type: req.body.event_type,
          event_title: req.body.event_title,
          startdate: req.body.startdate,
          enddate: req.body.enddate,
          starttime: req.body.starttime,
          endtime: req.body.endtime,
          venue: req.body.venue,
          contactmail: req.body.contactmail,
          payment: req.body.payment,
          contactphone: req.body.contactphone,
          ticket_price: req.body.ticket_price,
          banner_image: images[0], // Assuming you want to store the file name or URL
          poster_image: images[1], // Assuming you want to store the file name or URL
          description: req.body.description,
          additionalinfo: req.body.additionalinfo};

        await console.log(eventData);
        const newEvent = new Event(eventData);
        await newEvent.save()
        .then(() => {
            console.log("Event Saved!")
        });
        await res.render('create_event')
    } 
    catch (error) {
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