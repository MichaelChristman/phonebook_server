require('dotenv').config();
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Person = require('./models/person')

app.use(cors())
app.use(express.json())
app.use(express.static('dist'))


// Custom token to log name and number as a JSON string
morgan.token('json-body', (req) => {
  const { name, number } = req.body;
  return JSON.stringify({ name: name || '-', number: number || '-' });
});

// Configure Morgan to log the method, URL, status, response time, and JSON formatted body
app.use(morgan(':method :url :status :response-time ms - :json-body'));

// let persons = [
//     { 
//       "id": "1",
//       "name": "Arto Hellas", 
//       "number": "040-123456"
//     },
//     { 
//       "id": "2",
//       "name": "Ada Lovelace", 
//       "number": "39-44-5323523"
//     },
//     { 
//       "id": "3",
//       "name": "Dan Abramov", 
//       "number": "12-43-234345"
//     },
//     { 
//       "id": "4",
//       "name": "Mary Poppendieck", 
//       "number": "39-23-6423122"
//     }
// ]

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
  const nueID =  String(Math.floor(Math.random() * 100))
  
  const person = request.body

  //missing name or number
  if(!person.name || !person.number){
    return response.status(400).json({
      error:'Missing Name or Number'
    })
  }

  //name already exists
  if(persons.some(obj => obj.name === person.name)){
    return response.status(400).json({
      error:"This person already exists"
    })
  }

  person.id =  nueID

  persons = persons.concat(person)
  //response.send('hello,world!')
  response.json(person)
})


app.delete('/api/persons/:id',(request,response)=>{
  const id = request.params.id
  persons = persons.filter(person => person.id !== id)
  
  response.status(204).end()
})

const PORT = process.env.PORT
app.listen(PORT , () => {
  console.log(`Server running on port ${PORT}`)
})