const path = require('path');
const express = require('express');
const hbs = require('hbs');
const geocode = require('./utils/geocode');
const forecast = require('./utils/forecast');

const app = express();
// get the port env variable from heroku or default to 3000 for running locally
const port = process.env.PORT || 3000;

// define paths for Express config
const publicDirectoryPath = path.join(__dirname, "../public");
const templatesPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

// set up handlebars engine, views location, and partials location
app.set('view engine', 'hbs');
app.set('views', templatesPath);
hbs.registerPartials(partialsPath);

// set up static directory to serve
app.use(express.static(publicDirectoryPath));

// set up a route for the landing page
app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather App',
        name: 'Dakota Erickson'
    });
});

// set up a route for the about page
app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Me',
        name: 'Dakota Erickson'
    });
});

// set up a route for the help page
app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help',
        name: 'Dakota Erickson',
        helpMessage: 'Example help message.'
    });
});


app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'Address must be provided.'
        });
    }

    geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
        if (error) {
            return res.send({ error });
        }

        forecast(latitude, longitude, (error, forecastData) => {
            if (error) {
                return res.send({ error });
            }

            res.send({
                forecast: forecastData,
                location,
                address: req.query.address
            });
        })
    });
});


// matches any routes requested after `/help` that don't exist
app.get('/help/*', (req, res) => {
    res.render('404', {
        title: 'Help 404',
        errorMessage: 'Help Article Not Found',
        name: 'Dakota Erickson'
    });
})

// routes are matched from the top of the file to the bottom
// this has to be the last route to ensure we aren't stepping on an existing page
app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        errorMessage: '404 Page Not Found',
        name: 'Dakota Erickson'
    });
})

app.listen(port, () => {
    console.log('Server listening on port: ' + port);
})
