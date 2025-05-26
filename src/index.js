const express = require('express');

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.send('server is live and up and running');
});

const authRoutes = require('./routes/auth.routes');
app.use('/api/auth', authRoutes);


app.use(express.json());

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

