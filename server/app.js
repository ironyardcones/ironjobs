const express = require('express');
const bodyParser = require('body-parser');

let app = express();
app.use(express.static(__dirname + '/../client/public/')); //we need to look at this tomorrow??
app.use(bodyParser.json());

app.use('/api/jobs', require('./routes/jobs.route.js'));

app.use(require('./middleware/error-handler.middleware.js'));

app.listen(4000, function doSomethingOnceServerIsUp(err) {
  if(err) {
    console.error('The server could not be started:', err.message);
  } else {
    console.log('The server is available!');
  }
});
