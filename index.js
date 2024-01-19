require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const Person = require('./models/person');

const app = express();

const logger = (req, res, next) => {
    console.log('Method:', req.method)
    console.log('Path:', req.method)
    console.log('Body:', req.body)
    console.log('---')
    next()
}

const unknownEndPoint = (req, res) => {
    res.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, req, res, next) => {
    console.error(error.message)

    if(error.name === 'CastError') {
        return res.status(400).send({ error: 'malformatted id' })
    }

    next(error)
}

app.use(morgan(':method :url :status :response-time ms'));
app.use(express.static('build'));
app.use(express.json());
app.use(logger)

app.get('/info', (req, res, next) => {
    const currentDate = new Date().toString();

    Person.findOne({ })
        .then(person => {
            res.send(
                `<div>
                    <p>Phonebook has info for ${persons.length} people</p>
                </div>
                <div>
                    <p>${currentDate}</p>
                </div>`
            )
        })
        .catch(error => next(error));
})

app.get('/api/persons', (req, res, next) => {
    Person.findOne({ })
        .then(persons => {
            res.json(persons)
        })
        .catch(error => next(error))
});

app.get('/api/persons/:id', (req, res, next) => {
    Person.findOne({ _id:  req.params.id })
        .then(person => {
            res.json(person)
        })
        .catch(error => next(error))
});

app.post('/api/persons', (req, res, next) => {
    const body = req.body

    if(body.name === undefined || body.number === undefined) {
        return res.status(400).json({ error: 'content missing' })
    }

    const person = new Person({
        name: body.name,
        number: body.number,
    })

    person.save()
        .then(savedPerson => {
            res.json(savedPerson)
        })
        .catch(error => next(error))
});

app.put('/api/person/:id', (req, res, next) => {
    const body = req.body

    const person = {
        number: body.number
    }

    Person.findByIdAndUpdate({ _id: req.params.id }, person, { new: true })
        .then(updatedPerson => {
            res.status(200).json(updatedPerson)
        })
        .catch(error => next(error))
});

app.delete('/api/persons/:id', (req, res, next) => {
    Person.deleteOne({ _id: req.params.id })
        .then(result => {
            res.status(204).json(result, 'delete');
        })
        .catch(error)
});

app.use(unknownEndPoint);

app.use(errorHandler);



const PORT =  process.env.PORT;
app.listen(PORT, () => {
    console.log(`server running on ${PORT}`)
});