const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Connesso'))
  .catch(err => console.log(err));

app.get('/', (req, res) => res.send('API PoliSync Attiva'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server sulla porta ${PORT}`));