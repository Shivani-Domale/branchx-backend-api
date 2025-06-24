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


const allowedOrigins = [
  'http://139.59.23.86',
  'http://localhost:5173', 
  'http://127.0.0.1:3000',
  'http://127.0.0.1:5174'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
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

