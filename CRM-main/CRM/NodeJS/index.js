const passport = require('passport');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const session  = require('express-session');
const cookieSession = require('cookie-session')

const { mongoose } = require('./db.js');
var employeeController = require('./controllers/employeeController.js');
var userController = require('./controllers/userController.js');

var app = express();
app.use(bodyParser.json());
app.use(cors());

app.use(passport.initialize());
app.use(passport.session());

app.use('/employees', employeeController);
app.use("/user", userController);

app.listen(3000, () => console.log('Server started at port : 3000'));
