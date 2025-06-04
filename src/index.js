const express = require('express');
const apiRoutes = require('./routes');
const { ServerConfig,Logger } = require('./config');
const cors = require('cors');
const errorHandler = require('./middlewares/error-Handler');
const authRoutes = require('./routes/v1/auth-routes');
const protectedRoutes = require('./routes/v1/protected-routes');

const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(errorHandler)


const allowedOrigins = ['http://localhost:5173'];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true); // Allow the request
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
app.use('/api/protected', protectedRoutes);

app.listen(ServerConfig.PORT, () => {
console.log(`Server is running on port ${ServerConfig.PORT}`);
});

