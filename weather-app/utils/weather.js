const request = require('request')

const weather = (geodata, callback) => {
    const url = 'https://api.darksky.net/forecast/1a32e4a7b57fc861b97bccf594a6ef15/' + geodata.lat + ',' + geodata.lang
    request({ uri: url, json: true }, (error, response) => {
        if (error) {
            callback('Unable to connect to source service!', undefined)
        } else if (response.error) {
            callback('Unable to fetch weather', undefined)
        } else {
            const data = {
                location: geodata.place,
                temp: response.body.currently.temperature,
                rain: response.body.currently.precipProbability
            }
            callback(undefined, data)
        }
    })
}


module.exports = weather