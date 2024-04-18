require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const Person = require('./models/person');
const { default: mongoose } = require('mongoose');

const app = express();

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
  Person.find({}).then(persons => { response.json(persons) })
})

app.get('/api/persons/:id', (req, res, next) => {
  const id = req.params.id;
  Person.findById(id).then(person => {
    if (person) {
      res.json(person)
    } else {
      res.status(404).send({ error: `id ${id} not found` })
    }
  }).catch(err => {
    next(err)
  })
})

app.get('/info', (req, res) => {
  const now = new Date();

  const context = `Phonebook has info for ${persons.length} ${persons.length > 1 ? "people" : "person"} <br/> ${now.toString()}`

  res.send(context)
})

/* // depreciated
const generateRandomID = () => {
  const maxNumber = 9999999;
  return Math.floor(Math.random() * maxNumber);
}*/

app.post('/api/persons', async (req, res) => {
  const body = req.body;

  if (!body.name || !body.number) {
    return res.status(400).json({
      error: 'name or number missing'
    })
  }

  // reject if name exists
  const matches = await Person.find({ name: body.name });
  const isNameExist = matches.length > 0 ? true : false;
  if (isNameExist) {
    return res.status(400).json({
      error: 'name must be unique'
    })
  }

  const newPerson = new Person({
    //id: generateRandomID(), // depreciated
    name: body.name,
    number: body.number,
  });

  newPerson.save().then(result => {
    console.log(`New person ${body.name} saved`);
    res.json(result);
  })
})

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then(result => res.status(204).end())
    .catch(err => next(err))
})

app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body;

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(req.params.id, person, { new: true })
    .then(updatedPerson => {
      res.json(updatedPerson);
    })
    .catch(err => next(err))
})

// Middleware for error

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}

app.use(errorHandler);

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})