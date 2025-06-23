const express = require('express');
const apiRoutes = require('./routes');
const { ServerConfig,Logger } = require('./config');
const cors = require('cors');
const errorHandler = require('./middlewares/error-Handler');
const authRoutes = require('./routes/v1/auth-routes');
require('events').EventEmitter.defaultMaxListeners = 20;



const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(errorHandler)


app.use(cors({
  origin: function (origin, callback) {
    callback(null, origin || '*'); // Dynamically reflect origin
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use("/api",apiRoutes);
app.use('/api/auth', authRoutes);


app.listen(ServerConfig?.PORT, () => {
console.log(`Server is running on port ${ServerConfig?.PORT}`);
console.log(`Your project Live now `);
});

