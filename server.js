const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = process.env.port || 8080;
const public = __dirname + '/public/';

const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://127.0.0.1:27017/urlDB';
let db;
const urlHandler = require('./urlHandler');
const urlFetcher = require('./urlFetcher');

MongoClient.connect(url, (err, client) => {
    if(err) throw err;
    db = client.db('urlsDB');
    console.log('Connected to database: ' + db.databaseName);
    //db.close();
})

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));

app.get('/', (req, res) => {
    res.sendFile(public + 'index.html');
});

// Get minified url and redirect to full url
app.get('/:url', (req, res) => {
    const inputUrl = req.params.url;
    urlFetcher.fetch(inputUrl, db, res);
});

// Get url from form to be minified
app.post('/:url', (req, res) => {
    const inputUrl = req.body.url;
    const miniUrl = urlHandler.minify(inputUrl, db, res);
});




app.listen(port);


console.log('Listening on port: ' + port);