const express = require("express");
const path = require('path');
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static("node_modules"));


app.get('/', (req, res) => {
    res.render('home')
});

app.use(() => {
    console.log("We have a request")
})

app.listen(3000, () => {
    console.log("Listening on port 3000")
})