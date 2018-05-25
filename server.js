const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');

const users = require('./routes/api/users.js');
const profile = require('./routes/api/profile.js');
const posts = require('./routes/api/posts.js');

const app = express();

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

const db = require('./config/keys').mongoURI;
//simple route 
mongoose.connect(db)
    .then(()=>console.log('MongoDB connect'))
    .catch(err=>console.log(err));
// app.get('/',(req,res)=>{
//     res.send('I love India');
// })

// app.get('/Home',(req,res)=>{
//     res.send('I love India as it is my home and home');
// })

//passport middleware
app.use(passport.initialize());

require('./config/passport')(passport);

//Use Routes
app.use('/api/users',users);
app.use('/api/profile',profile);
app.use('/api/posts',posts);


const port = process.env.PORT || 5000;
app.listen(port,()=>console.log(`Server listening at port${port}`));