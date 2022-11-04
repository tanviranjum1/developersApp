// bring express
const { application } = require('express');
const express = require('express');

// bring the mongodb connection.
const connectDB = require('./config/db');

//initialize app variable with express.
const app = express();

//after initilization to express. connect to db.
connectDB();

// now bodyparser is included with express
//init middleware. this will allow to get date in the request body.
app.use(express.json({ extended: false }));

// single endpoint for testing .
app.get('/', (req, res) => {
  res.send('API running');
});

// to accesss the routes.
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));

// look at environment variables called port.
// when we deploy to heroku that's where it will get port number.
// if not deployed to heroku then locally default it to port number 5000.
const PORT = process.env.PORT || 9500;

// use app variable to listen on a port.
app.listen(PORT, () => {
  //calllback if you want sth to happen after it connects.
  console.log(`server started on ${PORT}`);
});
