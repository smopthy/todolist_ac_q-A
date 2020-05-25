const express = require('express')
const app = express() 
const exphbs = require('express-handlebars')
const Todo = require('./models/todo')

const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended:true}))

// connect with mongodb
const mongoose = require('mongoose') // 載入 mongoose
mongoose.connect('mongodb://localhost/new_todo',{ useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection
db.on('error' , ()=>{
    console.log('connect error')
})

db.once('open' , ()=>{
    console.log('db connection ')
})


app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

// index
app.get('/',(req, res)=>{
    Todo.find()
        .lean()
        .then( todos => {res.render('index' , {todos})})
        .catch( error => { 
            console.log('todos errors')
        })    
})


// create  

app.get('/todos/new',(req, res)=>{
        res.render('new')

}) 

app.post('/todos' , (req,res)=>{
    const name = req.body.name
    return Todo.create({name})
        .then(()=>res.redirect('/'))
        .catch(error=>console.log(error))
})

// detail 


app.get('/todos/:id' , (req , res)=>{
    const id = req.params.id
    return Todo.findById(id)
        .lean()
        .then(todo => res.render('detail' , {todo}) )
        .catch(error=>{console.log(error)})
})



app.listen(3001, ()=>{
    console.log('expess good')
}) 