const express = require('express');
const bodyParser = require('body-parser');

let app = express();

console.log('Hello World');


app.listen(4000, function doSomethingOnceServerIsUp(err) {
  if(err) {
    console.error('The server could not be started:', err.message);
  } else {
    console.log('The server is available!');
  }
});
