const express = require('express');
const validUrl = require('valid-url');
const base58 = require("base58");
const url = require('url') ;
//const webHost = 'http://localhost:8080/';
const webHost = 'https://jp-mini.herokuapp.com/';

const hostname = require('os').hostname;

module.exports = {
    minify : (inputUrl, db, res) => {
        return findMini(inputUrl, db, (dbMini) => {
            // If already in db, return saved miniurl
            if (dbMini){
                sendMiniUrl(dbMini, res);
            }
            // Elif url is valid, make new db entry & return new mini
            else if (validUrl.isUri(inputUrl)){
                addToDatabase(inputUrl, db, res);
                //saveUrl(inputUrl, newMini, db);
            }
            // If invalid
            else{
                sendInvalidMessage(res);
            }
        })
    }
} 

const findMini = (inputUrl, db, callback) => {
    console.log('Looking for url in database...');
    const collection = db.collection('urls');
    collection.findOne({url: inputUrl}, (err, doc) => {
        if (doc != null){
            //console.log('Found doc in database')
            callback(doc.miniUrl);
        }
        else{
            //console.log('Not found in database')
            callback(false);
        }
        
    })
    //return doc;
}

const addToDatabase = (inputUrl, db, httpRes) => {
    console.log('Adding to database...')
    
    // Get database count
    db.collection('urls').count((err, res) => {
        if (err) throw err;
        const count = res;
        const newMiniUrl = base58.encode(count);
        const miniDisplay = webHost + base58.encode(count) +"/";
        const outputUrl = {
            customId: count, url: inputUrl, miniUrl: newMiniUrl
        };
        db.collection('urls').insertOne(outputUrl, (err, res) => {
            if (err) throw err;
            console.log('Added url: ' + inputUrl);
            // Get database count, convert to miniurl
            sendMiniUrl(miniDisplay, httpRes);
        });


    })


    // Add url to database




   
}



const sendMiniUrl = (miniUrl, res) => {
    res.send("Your mini url: " + miniUrl);
}

const sendInvalidMessage = (res) => {
    res.send("Please input a valid url.");
}