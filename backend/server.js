const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/users', require('./routes/users'));
app.use('/api/students', require('./routes/students'));
app.use('/api/referrals', require('./routes/referrals'));
app.use('/api/export', require('./routes/export'));

app.get('/', (req, res) => {
  res.send('ID Card Generator API');
});

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB database connection established successfully'))
.catch(err => console.log(err));

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
