const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const app = express();

let persons = [
  {
    "id": 1,
    "name": "Arto Hellas",
    "number": "040-123456"
  },
  {
    "id": 2,
    "name": "Ada Lovelace",
    "number": "39-44-5323523"
  },
  {
    "id": 3,
    "name": "Dan Abramov",
    "number": "12-43-234345"
  },
  {
    "id": 4,
    "name": "Mary Poppendieck",
    "number": "39-23-6423122"
  }
]

app.use(express.json());

app.use(morgan('tiny', {
  skip: function (req, res) { return req.method === "POST" }
}));

// log req body when creating new person
morgan.token('data', function (req, res) { return JSON.stringify(req.body) });

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data', {
  skip: function (req, res) { return req.method !== "POST" }
}));

app.use(cors());

app.use(express.static('dist'))

// API
app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  const person = persons.filter(person => person.id === id);

  if (person.length < 1) {
    res.status(404).send({ error: `id ${id} not found` })
  } else {
    res.json(person)
  }
})

app.get('/info', (req, res) => {
  const now = new Date();

  const context = `Phonebook has info for ${persons.length} ${persons.length > 1 ? "people" : "person"} <br/> ${now.toString()}`

  res.send(context)
})

const generateRandomID = () => {
  const maxNumber = 9999999;
  return Math.floor(Math.random() * maxNumber);
}

app.post('/api/persons', (req, res) => {
  const body = req.body;
  if (!body.name || !body.number) {
    return res.status(400).json({
      error: 'name or number missing'
    })
  }

  const isNameExist = persons.find((person) => person.name === body.name) ? true : false;
  if (isNameExist) {
    return res.status(400).json({
      error: 'name must be unique'
    })
  }

  const newPerson = {
    id: generateRandomID(),
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(newPerson);

  res.json(newPerson);
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})