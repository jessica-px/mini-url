const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
//const public = __dirname + '/public/';

const MongoClient = require('mongodb').MongoClient;
const mongoUser = 'admin';
const mongoPw = 'adminpw';
const mongoUrl = 'mongodb://' + mongoUser + ':' + mongoPw + '@ds119800.mlab.com:19800/mini-url';
//const mongoUrl = 'mongodb://127.0.0.1:27017/urlDB';
let db;
const urlHandler = require('./urlHandler');
const urlFetcher = require('./urlFetcher');

MongoClient.connect(mongoUrl, (err, client) => {
    if(err) throw err;
    db = client.db('mini-url');
    console.log('Connected to database: ' + db.databaseName);
    //db.close();
})

app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));

app.get('/', (req, res) => {
    res.sendFile('index.html');
});

// Get minified url and redirect to full url
app.get('/:url', (req, res) => {
    const inputUrl = req.params.url;
    urlFetcher.fetch(inputUrl, db, res);
});

// Get url from form to be minified
app.post('/userinput/:url', (req, res) => {
    const inputUrl = req.body.url;
    const miniUrl = urlHandler.minify(inputUrl, db, res);
});



const port = process.env.PORT || 8080;
app.listen(port);
console.log('Listening on port: ' + port);