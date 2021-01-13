const request = require('request');
const path = require('path');
const fs = require('fs');

const apiJsonFilePath = path.join(__dirname, '../api-key.json')


// don't check the API key into version control
let geocodeApiKey;


// if I can't get the API key from an environment variable then look in a local json file for the api key
if (!process.env.geocodeKey) {
    const dataBuffer = fs.readFileSync(apiJsonFilePath);
    const data = dataBuffer.toString();
    const keyJson = JSON.parse(data);
    geocodeApiKey = keyJson['geocode'];
} else {
    geocodeApiKey = process.env.geocodeKey;
}

const geocode = (address, callback) => {
    const url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' + encodeURIComponent(address) + 
                '.json?access_token=' + geocodeApiKey + '&limit=1';

    request({
        url,
        json: true
    }, (error, { body }) => {
        if (error) { // low level error like inability to connect to the API
            callback('Unable to connect to location services.', undefined);
        } else if (body.features.length === 0) { // error from a malformed request
            callback('Unable to find location. Try another search.', undefined);
        } else { // successful API call with valid response
            callback(undefined, {
                longitude: body.features[0].center[0],
                latitude: body.features[0].center[1],
                location: body.features[0].place_name
            })
        }
    })
}

module.exports = geocode;
