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


app.use(cors({
    origin: '*', // Allow all origins
    methods: ['GET', 'POST', 'PUT', 'DELETE','OPTIONS'], // Allow specific HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'],// Allow specific headers
    credentials:true // Allow credentials (cookies, authorization headers, etc.)
}));

app.use("/api",apiRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/protected', protectedRoutes);

app.listen(ServerConfig.PORT, () => {
console.log(`Server is running on port ${ServerConfig.PORT}`);
});

