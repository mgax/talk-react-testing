var express = require('express')
var morgan = require('morgan')
var bodyParser = require('body-parser')

var todos = []
var nextId = 1

var app = express()
app.use(morgan(':method :url'))
app.use(bodyParser.json())
app.use(express.static('.'))

app.post('/todos', function(req, res) {
  var id = nextId ++
  todos.push({
    id: id,
    text: req.body.text,
  })
  console.log(todos)
  res.send({ok: true, id: id})
})

app.post('/todos/delete', function(req, res) {
  todos = todos.filter(function(i) { return i.id != req.body.id })
  console.log(todos)
  res.send({ok: true})
})

app.get('/todos', function(req, res) {
  res.send({todos: todos})
})

app.post('/_flush', function(req, res) {
  todos = []
  console.log(todos)
  res.send({ok: true})
})

var address = app.listen(+(process.env.PORT || 5000)).address()
console.log('listening on', address.address, address.port)
