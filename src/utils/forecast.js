const path = require('path');
const request = require('request');
const fs = require('fs');

const apiJsonFilePath = path.join(__dirname, '../api-key.json')


// don't check API key into version control
let weatherApiKey = '';

// if I can't get the API key from an environment variable then look in a local json file for the api key
if (!process.env.weatherKey) {
    const dataBuffer = fs.readFileSync(apiJsonFilePath);
    const data = dataBuffer.toString();
    const keyJson = JSON.parse(data);
    weatherApiKey = keyJson['weather'];
}

const forecast = (latitude, longitude, callback) => {
    const url = 'http://api.weatherstack.com/current?access_key=' + weatherApiKey + '&units=f&query=' + latitude + ',' + longitude;

    request({
        url,
        json: true
    }, (error, { body }) => {
        if (error) { // low level error like inability to connect to the API
            callback('Unable to connect to weather service.', undefined);
        } else if (body.error) { // error from a malformed request
            callback('Unable to find location. Try another search.', undefined);
        } else { // successful API call with valid response
            callback(undefined, 'The current weather description is: ' + body.current.weather_descriptions[0].toLowerCase() +
                         '. The temperature is ' + body.current.temperature + '\u00B0F and the feels like temperature is ' + 
                         body.current.feelslike + '\u00B0F.' + ' The wind speed is ' + body.current.wind_speed + 
                        'mph and the direction is ' + body.current.wind_dir + '.');
        }
    })
};

module.exports = forecast;
