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
const { storage } = require("./cloudy")
const { adminApp, orgApp } = require("./fireAdmin")


const upload = multer({ storage });
const uploadLocal = multer({ dest: './public/data/uploads/' })


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static("node_modules"));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
//Mongoose Init
const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Connected to mongodb")
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
    uid: String,
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
    {
        url: String,
        filename: String
    },
    poster_image:
    {
        url: String,
        filename: String
    },
    description: String,
    additionalinfo: String,
});


// Create the UsersInfo model
const UsersInfo = mongoose.model('UsersInfo', usersInfoSchema);
const waitEvent = mongoose.model('WaitEventInfo', eventSchema);
const Event = mongoose.model('EventInfo', eventSchema);
const binEvent = mongoose.model('deletedEventInfo', eventSchema);





app.get('/', async (req, res) => {
    try {
        const EventData = await Event.find({});
        // console.log(dataEvent[3].banner_image.url);
        //console.log(EventData)

        res.render('home', { EventData });

    } catch {
        (er) => {
            console.log(er);
        }
    }
});

app.get('/create-event', (req, res) => {
    res.render("create_event");
})

app.get('/admin', (req, res) => {
    res.render("admin/dashboard");
})

app.get('/dashboard', (req, res) => {
    res.render("admin/dashboard");
})

app.get('/approve_event', async (req, res) => {
    try {
        const waitEventData = await waitEvent.find({});
        //console.log(waitEventData);

        res.render("admin/approve_event", {waitEventData});

    } catch {
        (er) => {
            console.log(er);
        }
    }
})

app.post('/admin/deny_event', async (req, res)=> {
    try{
        const id = req.body.eventId.trim();
        console.log(id.length);
        objectId = new mongoose.Types.ObjectId(id);
        console.log(objectId);
        const data = await waitEvent.findByIdAndDelete(objectId);
        res.redirect('/approve_event');
        console.log(data)
    }
    catch {
        (er) => {
            console.log(er);
        }
    }
})

app.post('/admin/approve_event', async (req, res)=> {
    try{
        const id = req.body.eventId.trim();
        console.log(id.length);
        objectId = new mongoose.Types.ObjectId(id);
        console.log(objectId);
        const data = await waitEvent.findOne({_id:objectId},{_id: false });
        //console.log(data);
        //const newEvent = new Event(data);
        try{
            Event.insertMany([data])

        }
        catch {
            (er) => {
                console.log(er);
            }
        }
        await waitEvent.findOneAndRemove({_id:objectId},{_id: false });
        // newEvent.save()
        res.redirect('/approve_event');
    }
    catch {
        (er) => {
            console.log(er);
        }
    }
})

app.get('/manage_event', async (req, res) => {
    try {
        const EventData = await Event.find({});
        //console.log(EventData);

        res.render("admin/manage_event", {EventData});

    } catch {
        (er) => {
            console.log(er);
        }
    }
})

app.post('/admin/manage_event/delete', async (req, res)=> {
    try{
        const id = req.body.eventId.trim();
        console.log(id.length);
        objectId = new mongoose.Types.ObjectId(id);
        console.log(objectId);
        const data = await Event.findOne({_id:objectId},{_id: false });
        //console.log(data);
        //const newEvent = new Event(data);
        try{
            binEvent.insertMany([data])
        }
        catch {
            (er) => {
                console.log(er);
            }
        }
        await Event.findOneAndRemove({_id:objectId},{_id: false });
        // newEvent.save()
        res.redirect('/manage_event');
    }
    catch {
        (er) => {
            console.log(er);
        }
    }
})

app.get('/users', (req, res) => {
    res.render("admin/users");
})

app.post('/create-event', upload.any(), (req, res) => {
    try {
        console.log(req.body);
        console.log(req.files);
        console.log(req.body.event_type);
        const images = req.files.map(f => ({ url: f.path, filename: f.filename }))
        console.log(images[0])
        const eventData = {
            uid: "a100",
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
            additionalinfo: req.body.additionalinfo
        };

        console.log(eventData);
        const newEvent = new waitEvent(eventData);
        newEvent.save()
            .then(() => {
                console.log("Event Saved!")
            });
        res.render('create_event')
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Error uploading files.");
    }
})

app.post('/signup', (req, res) => {
    const { uid, name } = req.body;
    const newUser = new UsersInfo({ uid: uid, fullname: name });
    newUser.save()
        .then(() => {
            console.log("User Info saved in mongodb")
        })
    console.log(uid);
    console.log(name);
})

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });

app.listen(3000, () => {
    console.log("Listening on port 3000")
})