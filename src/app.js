require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./server');

const MONGO = process.env.MONGO_URI || 'mongodb+srv://ehakmath_db_user:XiTDdPqcVQfCMare@cluster0.mn0drdj.mongodb.net/user_service?appName=Cluster0';
const PORT = process.env.PORT || 4001;


mongoose
  .connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true, tls: true })
  .then(() => {
    console.log('Connected to User DB');
    app.listen(PORT, () => console.log(`User service listening on port ${PORT}`));
  })
  .catch((err) => {
    console.error('Mongo connection error:', err);
    process.exit(1);
  });
