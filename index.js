require('dotenv').config();
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Person = require('./models/person')

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())


const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

app.use(requestLogger)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// Custom token to log name and number as a JSON string
morgan.token('json-body', (req) => {
  const { name, number } = req.body;
  return JSON.stringify({ name: name || '-', number: number || '-' });
});

// Configure Morgan to log the method, URL, status, response time, and JSON formatted body
app.use(morgan(':method :url :status :response-time ms - :json-body'));

let persons = []

app.get('/', (request, response) => {
    response.send('<h1>Phonebook Backend Connected</h1>')
})

app.get('/info', (request, response) => {
  const timestamp = Date.now();
  const date = new Date(timestamp);

  response.send(
    `<p>Phonebook has info for ${persons.length} people</p><p>${date.toString()}</p>`
  )
})

app.get('/api/persons', (request,response) =>{
    
    Person.find({}).then(persons => {
      response.json(persons)
    })
  
})

app.get('/api/persons/:id', (request,response) =>{
  const id = request.params.id
  const person = persons.find(person => person.id === id)
  
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.post('/api/persons', (request, response)=>{
  // const nueID =  String(Math.floor(Math.random() * 100))
  
  const body = request.body

  // //missing name or number
  // if(!body.name || !body.number){
  //   return response.status(400).json({
  //     error:'Missing Name or Number'
  //   })
  // }

  // //name already exists
  // if(body.some(obj => obj.name === body.name)){
  //   return response.status(400).json({
  //     error:"This person already exists"
  //   })
  // }

  const person = new Person({
    name:body.name,
    number:body.number,
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })

  // person.id =  nueID

  // persons = persons.concat(person)
  // //response.send('hello,world!')
  // response.json(person)
})


app.delete('/api/persons/:id',(request,response)=>{
  // const id = request.params.id
  // persons = persons.filter(person => person.id !== id)
  Person.findByIdAndDelete(request.params.id)
  .then(result => {
      response.status(204).end()
  })
  .catch(error => next(error))
  
})

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT , () => {
  console.log(`Server running on port ${PORT}`)
})