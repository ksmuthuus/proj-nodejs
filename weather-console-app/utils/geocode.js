const request = require('request')

const accessToken = ''
const geocode = (address, callback) => {
    const url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' + encodeURIComponent(address) + '.json?limit=1&access_token=' + accessToken
    request({
        uri: url,
        json: true
    }, (error, response) => {
        if (error) {
            callback('Unable to connect to source service!', undefined)
        } else if (response.body.features.length === 0) {
            callback('Unable to fetch GeoCode', undefined)
        } else {
            const lat = response.body.features[0].center[1]
            const lang = response.body.features[0].center[0]
            const place = response.body.features[0].place_name
            callback(undefined, {
                lat: lat,
                lang: lang,
                place: place
            })
        }
    })
}

module.exports = geocode