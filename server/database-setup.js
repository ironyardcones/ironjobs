const mongoose = require('mongoose');

if (!process.env.MY_DB_LOCATION) {
  console.error('No database selected!');
  process.exit();
}

mongoose.connect(process.env.MY_DB_LOCATION);

mongoose.connection.on('error', function handleDBError(err) {
  console.error('DB Error', err);
  process.exit();
});
