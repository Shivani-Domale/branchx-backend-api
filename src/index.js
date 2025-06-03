const express = require('express');
const apiRoutes = require('./routes');
const { ServerConfig,Logger } = require('./config');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
    origin: '*', // Allow all origins
    methods: ['GET', 'POST', 'PUT', 'DELETE','OPTIONS'], // Allow specific HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'],// Allow specific headers
    credentials:true // Allow credentials (cookies, authorization headers, etc.)
}));

app.use("/api",apiRoutes);

app.listen(ServerConfig.PORT, () => {
console.log(`Server is running on port ${ServerConfig.PORT}`);
});

