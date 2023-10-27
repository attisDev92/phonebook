const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const PORT =  3001;

const app = express();

app.use(express.json());
app.use(morgan(':method :url :status :response-time ms'));
app.use(cors());

let persons = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "445786567"
    },
    {
        id: 2,
        name: "Ada Lovelace",
        number: "434657587"
    },
    {
        id: 3,
        name: "Dan Abramov",
        number: "345346576"
    },
    {
        id: 4,
        name: "Mary Poppendick",
        number: "4456785785"
    }
]

const generateId = () => Math.floor(Math.random() * 100);

app.get('/api/persons', (req, res) => {
    
    res.json(persons);    
});

app.get('/info', (req, res) => {
    const numberRegisters = `<p> Phonebook has info for ${persons.length} people</p>`;
    const time = new Date();

    res.send(numberRegisters + time);
});

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    const person = persons.find(person => person.id === id);

    if(person) {
       res.json(person);
    } else {
        res.status(404).send('Not Found 404').end();
    }
});

app.post('/api/persons', (req, res) => {
    const body = req.body

    if(!body.name || !body.number) {
        return res.status(400).json({ error: 'content missing' })
    } else if (persons.find(person => person.name === body.name)) {
        return res.status(400).json({ error: 'name must be unique' });
    }

    const person = {
        name: body.name,
        number: body.number,
        id: generateId()
    }

    persons = persons.concat(person);

    res.json(person)
});

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    persons = persons.filter(person => person.id !== id);

    res.status(204).end()
});



app.listen(PORT, () => {
    console.log(`server running on ${PORT}`)
});