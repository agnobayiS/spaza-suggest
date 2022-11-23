import express from "express";
import exphbs from 'express-handlebars';
import session from 'express-session';
import flash from 'express-flash';
// import spazaFF from './spaza-suggest.js'

const app = express();



import pgPromise from 'pg-promise';

const pgp = pgPromise({})

const local_database_url = 'postgres://siyabonga:siya@localhost:5432/spaza';
const connectionString = process.env.DATABASE_URL || local_database_url;

const config = {
    connectionString
}
if (process.env.NODE_ENV == "production") {
    config.ssl = {
        rejectUnauthorized: false
    }
}

app.use(session({
    secret: 'codeforgeek',
    saveUninitialized: true,
    resave: true
}));


const db = pgp(config);


import spazaFF1 from './spaza-suggest.js'


app.engine('handlebars', exphbs.engine({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.use(express.static('public'))

app.use(express.urlencoded({ extended: false }))
app.use(express.json())


app.use(flash());


// const { default: ShortUniqueId }
import  ShortUniqueId  from 'short-unique-id';
const uid = new ShortUniqueId({ length: 5 });

// const code = uid();



app.use(session({
    secret: "<add a secret string here>",
    resave: false,
    saveUninitialized: true
}));



app.get('/', async function (req, res) {

    res.render("login", {

    })
})
const spazaFF = spazaFF1(db)


app.post('/login', async function (req, res) {
    
    let code = req.body.code
    
    
    
    if (code) {
        let validate = await spazaFF.clientLogin(code)
        
        res.redirect(`/suggest/${validate.id}`)
        
    } else  {
        
        req.flash('erro', 'Please enter valid code');
        res.redirect('/')
        
    }
})

app.get('/suggest/:user_id',async function(req,res){

    let id = req.params.user_id
        let areas = await spazaFF.areas()
        let data = await spazaFF.suggestions(id)
        console.log(data);
    res.render('suggest',{
        id,
        areas,
        data
    })
})
app.post('/signup', async function(req,res){

    const name = req.body.name;
   

    if (name) {

        const code = await spazaFF.registerClient(name)

        // await spazaFF.registerClient(name)

        req.flash('info', 'Account created!!   your login code is: ' + code);

    } else {
        req.flash('erro', 'Please enter valid name');

    }

    res.render('signup',{
    
    })
})

app.get('/signup', async function( req,res){

    res.render('signup')
})

app.post('/submit/:id', async function(req,res){

    let iterm = req.body.iterm
    let radio = req.body.location
    let user_id = req.params.id

    console.log(iterm,radio,user_id);
    let sugetst = await spazaFF.suggestProduct(radio, user_id, iterm)


    req.flash('info', 'Suggestion submited');

    res.redirect('back')
})











const PORT = process.env.PORT || 3040;

app.listen(PORT, function () {
    console.log("App started at port:", PORT)
});
