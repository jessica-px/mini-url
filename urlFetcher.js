const express = require('express');

module.exports = {
    fetch : (inputUrl, db, res) => {
        return findFullUrl(inputUrl, db, (fullUrl) => {
            // If in db, redirec to url
            if (fullUrl){
                redirect(fullUrl, res);
            }
            // If invalid
            else{
                sendInvalidMessage(res);
            }
        })
    }
}

const findFullUrl = (inputMini, db, callback) => {
    console.log('Looking for full url in database...');
    const collection = db.collection('urls');
    collection.findOne({miniUrl: inputMini}, (err, doc) => {
        if (doc != null){
            console.log('Found full url in database')
            callback(doc.url);
        }
        else{
            console.log('Full url not found in database')
            callback(false);
        }
    })
    //return doc;
}

const redirect = (fullUrl, res) => {
    res.redirect(fullUrl);
}

const sendInvalidMessage = (res) => {
    res.send('Unknown url')
}
