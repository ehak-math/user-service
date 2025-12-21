require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');

const userRoutes = require('./routes/user.routes');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// routes
app.use('/users', userRoutes);

// root health
app.get('/', (req, res) => res.json({ service: 'user-service', status: 'ok' }));

// error handler (simple)
app.use((err, req, res,) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'internal server error' });
});

module.exports = app;
