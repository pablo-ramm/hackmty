const express = require('express')
const app = express()
const ejsMate = require('ejs-mate');
const port = 3000
const bodyParser = require('body-parser');
const { localsName } = require('ejs');



app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));
app.use(express.static('public'))

app.engine('ejs', ejsMate) //to use a layout file 
app.set("view engine", "ejs");


app.get('/', (req, res) => {
    res.render('index')
})

app.get('/home', (req, res) => {
    res.render('landing')
  })
  

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})