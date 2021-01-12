const path = require('path');
const request = require('request');

const apiJsonFilePath = path.join(__dirname, '../api-key.json')

// don't check API key into github
const weatherApiKey = process.env.weatherKey;


const forecast = (latitude, longitude, callback) => {
    const url = 'http://api.weatherstack.com/current?access_key=' + weatherApiKey + '&units=f&query=' + latitude + ',' + longitude;

    request({
        url,
        json: true
    }, (error, { body }) => {
        if (error) { // low level error like inability to connect to the API
            callback('Unable to connect to weather service.', undefined);
        } else if (body.error) { // error from a malformed response
            callback('Unable to find location. Try another search.', undefined);
        } else { // successful API call with valid response
            callback(undefined, 'Weather description: ' + body.current.weather_descriptions[0].toLowerCase() + '. The temperature is ' + 
                        body.current.temperature + '\u00B0F and the feels like temperature is ' + body.current.feelslike + '\u00B0F.')
        }
    })
};

module.exports = forecast;
