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

app.use(express.static('public'))

app.use(express.urlencoded({ extended: true }));
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

passport.use(new PassportLocal(async function (username, password, done) {
    const user = await User.findOne({ name: username })
    console.log(user)


    if (user && password === user.password)
        return done(null, user);
    done(null, false);
}));

// serializacion
passport.serializeUser(function (user, done) {
    done(null, user._id);
});

passport.deserializeUser(async function (_id, done) {
    const user = await User.findOne({ _id: _id })
    done(null, user);
})

app.use((req, res, next) => { //middleware for flash
    console.log(req.user)
    //with this we do not need to pass anything in the routes, we can just called when render a template we just always have acces to something called success
    res.locals.currentUser = req.user; //in the templates with this property if it s a current user or not we can display the login logout register of the navbar or not
    next()
})

app.get('/', (req, res) => {
    res.render('index')
})

app.get('/landing', (req, res) => {
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

app.get('/products', async (req, res) => {
    products = await Product.find({});
    res.render('products', { products });
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

app.get("/donate", (req, res) => {
    res.render("donate");
});

app.get("/ong", async (req, res) => {
    console.log(req.query.category)
    users = await User.find({ category: req.query.category });
    res.render("ongs", { users });
});

app.post('/register', async (req, res) => {
    console.log(req.body.user)
    const user = new User(req.body.user);
    await user.save();
    res.redirect('/')
})

app.get('/recover', (req, res) => {
    res.render('recover')
})

app.get('/org/:id', async (req, res) => {
    const user = await User.findById(req.params.id)

    res.render('orgShow', { user });
})

app.get('/logout', function(req, res, next) {
    req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect('landing');
    });
  });


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})