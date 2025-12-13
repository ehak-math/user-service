const mongoose = require('mongoose');
const app = require('./server');

const MONGO = process.env.MONGO_URI || 'mongodb://localhost:27017/userdb';
const PORT = process.env.PORT || 4001;

mongoose
  .connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to User DB');
    app.listen(PORT, () => console.log(`User service listening on port ${PORT}`));
  })
  .catch((err) => {
    console.error('Mongo connection error:', err);
    process.exit(1);
  });
