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
const { adminApp, orgApp } = require("./fireAdmin");
const { userInfo } = require("os");


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
    ticket: {
        title: String,
        types: [{
            catagory: String,
            price: Number,
            tickets: [[
                {
                    sitId: String,
                    Available: Boolean
                }
            ]]
        }]
    },
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

const ticketScema = new mongoose.Schema({
    title: String,
    types: [{
        catagory: String,
        price: Number,
        tickets: [[
            {
                sitId: String,
                Available: Boolean
            }
        ]]
    }],
    uid: String
});


// Create the UsersInfo model
const UsersInfo = mongoose.model('UsersInfo', usersInfoSchema);
const waitEvent = mongoose.model('WaitEventInfo', eventSchema);
const Event = mongoose.model('EventInfo', eventSchema);
const binEvent = mongoose.model('deletedEventInfo', eventSchema);
const ticketInfo = mongoose.model('ticketInfo', ticketScema);


app.post('/userInfo', async (req,res)=> {
    uid = req.body.uid;
    console.log(uid)
    const userInfo = await UsersInfo.findOne({ uid: uid });
    res.send(userInfo)
})


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

app.get('/event/:eventID', async (req, res) => {
    const eventId = req.params.eventID;
    const eventObj = new mongoose.Types.ObjectId(eventId);
    const eventData = await Event.findById(eventObj);
    console.log(eventData)
    res.render("eventpage", {eventData})
})

app.get('/event/purchase/:eventID', async (req, res) => {
    const eventId = req.params.eventID;
    const eventObj = new mongoose.Types.ObjectId(eventId);
    const eventData = await Event.findById(eventObj);
    console.log(eventData)
    res.render("purchasepage", {eventData});
})

app.get('/create-event', async (req, res) => {
    try {
        const TicketData = await ticketInfo.find({ uid: 'a100' });
        console.log(TicketData)
        res.render("create_event", { TicketData });
    } catch {
        (er) => {
            console.log(er);
        }
    }
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

        res.render("admin/approve_event", { waitEventData });

    } catch {
        (er) => {
            console.log(er);
        }
    }
})

app.post('/admin/deny_event', async (req, res) => {
    try {
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

app.post('/admin/approve_event', async (req, res) => {
    try {
        const id = req.body.eventId.trim();
        console.log(id.length);
        objectId = new mongoose.Types.ObjectId(id);
        console.log(objectId);
        const data = await waitEvent.findOne({ _id: objectId }, { _id: false });
        //console.log(data);
        //const newEvent = new Event(data);
        try {
            Event.insertMany([data])

        }
        catch {
            (er) => {
                console.log(er);
            }
        }
        await waitEvent.findOneAndRemove({ _id: objectId }, { _id: false });
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

        res.render("admin/manage_event", { EventData });

    } catch {
        (er) => {
            console.log(er);
        }
    }
})

app.post('/admin/manage_event/delete', async (req, res) => {
    try {
        const id = req.body.eventId.trim();
        console.log(id.length);
        objectId = new mongoose.Types.ObjectId(id);
        console.log(objectId);
        const data = await Event.findOne({ _id: objectId }, { _id: false });
        //console.log(data);
        //const newEvent = new Event(data);
        try {
            binEvent.insertMany([data])
        }
        catch {
            (er) => {
                console.log(er);
            }
        }
        await Event.findOneAndRemove({ _id: objectId }, { _id: false });
        // newEvent.save()
        res.redirect('/manage_event');
    }
    catch {
        (er) => {
            console.log(er);
        }
    }
})

app.post('/admin/users/delete', async (req, res) => {
    try {
        id = req.body.uid.trim();
        await UsersInfo.findOneAndDelete({ uid: id });
        res.redirect('/users');
    }
    catch {

    }
})

app.get('/users', async (req, res) => {
    try {
        const userData = await UsersInfo.find({});
        console.log(userData);
        res.render("admin/users", { userData });
    }
    catch {
        (er) => {
            console.log(er);
        }
    }

})

app.post('/create-event', upload.any(), async (req, res) => {
    try {
        console.log(req.body);
        const images = req.files.map(f => ({ url: f.path, filename: f.filename }))
        const tId = new mongoose.Types.ObjectId(req.body.ticket_type)
        const ticketOne = await ticketInfo.findById(tId)
        const {title, types} = ticketOne
        const ticket = {title: title,
                        types: types}
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
            ticket: ticket,
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
        res.redirect('/create-event')
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


//Organizers Routs:

app.get('/org-dashboard', (req, res) => {
    res.render("org/dashboard");
})

app.get('/org-tickets', async (req, res) => {
    try {
        const TicketData = await ticketInfo.find({ uid: 'a100' });
        res.render("org/tickets", { TicketData });
    } catch {
        (er) => {
            console.log(er);
        }
    }
})
app.get('/org-manage_event', async (req, res) => {
    try {
        const EventData = await Event.find({ uid: 'a100' });
        //console.log(EventData);

        res.render("org/manage_event", { EventData });

    } catch {
        (er) => {
            console.log(er);
        }
    }
})

app.post('/org-manage_event-modify', async (req, res) => {
    try {
        const id = req.body.eventId.trim();
        console.log(id.length);
        objectId = new mongoose.Types.ObjectId(id);
        console.log(objectId);
        const EventData = await Event.findById(objectId);
        //res.redirect('/approve_event');
        res.render("org/modify_event", { EventData });
        console.log(EventData)
    }
    catch {
        (er) => {
            console.log(er);
        }
    }
    //res.render("org/modify_event");
})

app.post('/org-modify-event-update', async (req, res) => {
    const {
        event_type,
        event_title,
        startdate,
        enddate,
        starttime,
        endtime,
        venue,
        contactmail,
        payment,
        contactphone,
        ticket_price,
        description,
        additionalinfo,
        id,
    } = req.body;

    const ObjID = new mongoose.Types.ObjectId(id.trim());
    const updateOperation = {
        $set: {

            event_type: event_type,
            event_title: event_title,
            startdate: startdate,
            enddate: enddate,
            starttime: starttime,
            endtime: endtime,
            venue: venue,
            contactmail: contactmail,
            payment: payment,
            contactphone: contactphone,
            ticket_price: ticket_price,
            description: description,
            additionalinfo: additionalinfo
        },
    };
    try {
        // Update the document with the specified ObjectId
        const result = await Event.updateOne({ _id: ObjID }, updateOperation);
        res.redirect('/org-manage_event')
        // Check the result
        if (result.modifiedCount === 1) {
            console.log('Document updated successfully.');
        } else {
            console.log('Document not found or not updated.');
        }
    } catch (err) {
        console.error('Error updating document:', err);
    }
})

app.post('/org/create-ticket', (req, res) => {
    const { name, 'inline-radio-group': inlineRadioGroup, catagory, price, rowNum, rowName, rowCapacity } = req.body;
    const types = []

    for (let i = 0; i < inlineRadioGroup; i++) {

        const tickets = []
        for (let j = 0; j < Number(rowNum[i]); j++) {
            const rowTicket = []
            for (let k = 0; k < Number(rowCapacity[i][j]); k++) {
                rowTicket.push({
                    sitId: `${rowName[i][j]}-${k + 1}`,
                    Available: true
                })
            }
            tickets.push(rowTicket)
        }
        console.log(tickets)
        types[i] = {
            catagory: catagory[i],
            price: price[i],
            tickets: tickets

        }
    }
    ticket = {
        uid: 'a100',
        title: name,
        types: types
    }
    newTicket = new ticketInfo(ticket);
    console.log(newTicket)
    newTicket.save()
        .then(() => {
            console.log("Ticket Info saved in mongodb")
            res.redirect('/org-tickets')
        })
});


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(3000, () => {
    console.log("Listening on port 3000")
})