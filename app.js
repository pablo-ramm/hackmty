const express = require('express')
const app = express()
const ejsMate = require('ejs-mate');
const port = 3000
const bodyParser = require('body-parser');
const { localsName } = require('ejs');
const mongoose = require('mongoose');

const Product = require('./models/product');



const dbUrl = "mongodb://localhost:27017/agricultureTest";

mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
    //useFindAndModify:false
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});



app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

app.engine('ejs', ejsMate) //to use a layout file 
app.set("view engine", "ejs");


app.get('/', (req, res) => {
    res.render('index')
})

app.get('/home', (req, res) => {
    res.render('landing')
})

app.get('/newProduct', (req, res) => {
    res.render('newProduct')
})

app.post('/products', async (req, res) => {
    console.log(req.body.product)
    const product = new Product(req.body.product);
    await product.save();
    res.redirect('/')
})


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})