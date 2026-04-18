const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors({
  origin: [
    'http://localhost:5173',
    process.env.CLIENT_URL  // your Vercel URL — added later
  ]
}));
app.use(express.json());

// Routes
app.use('/api/drugs',     require('./routes/drugs'));
app.use('/api/breeds',    require('./routes/breeds'));
app.use('/api/calculate', require('./routes/calculator'));
app.use('/api/treatment', require('./routes/treatment'));
app.use('/api/auth',      require('./routes/auth'));
app.use('/api/practice',  require('./routes/practice'));

app.get('/', (req, res) => res.json({ message: 'VetDoze API running' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`VetDoze server on port ${PORT}`));