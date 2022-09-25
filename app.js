const express = require('express')
const app = express()
const ejsMate = require('ejs-mate');
const port = 3000
const bodyParser = require('body-parser');
const { localsName } = require('ejs');
const mongoose = require('mongoose');
const passport = require('passport');
const cookieParser = require('cookie-Parser');
const session = require('express-session')
const Product = require('./models/product');
const User = require('./models/user');
const PassportLocal = require('passport-local').Strategy;

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

app.use(express.urlencoded({ extended: true}));
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));   // to support URL-encoded bodies
app.use(cookieParser('secreto'));

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.engine('ejs', ejsMate) //to use a layout file 
app.set("view engine", "ejs");

passport.use(new PassportLocal(function(username, password, done){
    if (username === 'codigofacilito' && password === '123456789')
        return done(null,{ id: 1, name:'Cody' });
    done(null, false);
}));

// serializacion
passport.serializeUser(function(user,done){
    done(null, user.id);
});

passport.deserializeUser(function(id,done){
    done(null,{ id: 1, name:'Cody'});
})

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

app.post('/products', async (req, res) => {
    console.log(req.body.product)
    const product = new Product(req.body.product);
    await product.save();
    res.redirect('/')
})

// getter de pagina de login
app.get('/login', (req, res) => {
    res.render('login')
})

app.post("/login", passport.authenticate("local", {
    successRedirect: "/landing",
    failureRedirect: "/login"
}));

// getter de pagina de registro
app.get('/register', (req, res) => {
    res.render('register')
})

app.post('/register', async (req, res) => {
    console.log(req.body.user)
    const user = new User(req.body.user);
    await user.save();
    res.redirect('/')
})

app.get('/recover', (req, res) => {
    res.render('recover')
})


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})