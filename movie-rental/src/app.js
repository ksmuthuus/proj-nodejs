const express = require('express')
const Joi = require('joi')
const logger = require('./logger')
const path = require('path')
const helmet = require('helmet')
const morgan = require('morgan')

const app = express()
const staticFilePath = path.join(__dirname, '../public')

app.use(helmet())

if (app.get('env') !== 'production')
    app.use(morgan('tiny'))
//JSON Parser Middleware
app.use(express.json()) //Sets req.body
//app.use(logger) //Custom Middleware
app.use(express.static(staticFilePath))

const genres = [{
    id: 1,
    name: 'Action'
}, {
    id: 2,
    name: 'Comedy'
}, {
    id: 3,
    name: 'Thriller'
}]

//GET All Generas
app.get('/api/genres', (req, res) => {
    res.send(genres)
})

//GET specific Generas
app.get('/api/genre/:id', (req, res) => {
    const genre = genres.find(g => g.id === parseInt(req.params.id))
    if (!genre) {
        return res.status(400).send({
            error: 'Genre Not Available'
        })
    }
    res.send(genre)
})

//POST Genres
app.post('/api/genre', (req, res) => {
    //Validate payload
    const validated = validateGenre(req.body)
    if (validated.error) {
        return res.status(400).send({
            error: validated.error.details[0].message
        })
    }

    //Insert Genre
    const id = genres.length + 1
    const genre = {
        id,
        name: req.body.name
    }
    genres.push(genre)

    //return new Genre
    res.status(201).send(genre)
})

//PUT Genres
app.put('/api/genre/:id', (req, res) => {
    //Validate payload
    const validated = validateGenre(req.body)
    if (validated.error) {
        return res.status(400).send({
            error: validated.error.details[0].message
        })
    }

    //Check input genre id exists in store
    const genre = genres.find(g => g.id === parseInt(req.params.id))
    if (!genre) return res.status(404).send({
        error: 'Genre not found'
    })

    //Update Genre
    genre.name = req.body.name
    res.status(200).send(genre)

})

//DELETE Generes
app.delete('/api/genre/:id', (req, res) => {
    //Check input genre id exists in store
    const genre = genres.find(g => g.id === parseInt(req.params.id))
    if (!genre) return res.status(404).send({
        error: 'Genre not found'
    })

    //Remove genre
    const index = genres.indexOf(genre)
    genres.splice(index, 1)


    res.status(200).send(genre)
})

//handle Invalid paths
app.get('*', (req, res) => {
    res.status(400).send({
        error: 'Invalid Request'
    })
})


function validateGenre(genre) {
    const schema = {
        name: Joi.string().min(3).required().alphanum()
    }
    return Joi.validate(genre, schema)
}

const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})