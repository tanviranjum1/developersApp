// bring express
const { application } = require('express');
const express = require('express');

//initialize app variable with express.
const app = express();

// single endpoint for testing .
app.get('/', (req, res) => {
  res.send('API running');
});

// look at environment variables called port.
// when we deploy to heroku that's where it will get port number.
// if not deployed to heroku then locally default it to port number 5000.
const PORT = process.env.PORT || 5000;

// use app variable to listen on a port.
app.listen(PORT, () => {
  //calllback if you want sth to happen after it connects.
  console.log(`server started on ${PORT}`);
});
