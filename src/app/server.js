const express = require('express');
const app = express();
const path = require('path');
const data = require('./data.json'); // Assuming your JSON data is in a file named data.json

app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/customers', (req, res) => {
  res.json(data.customers);
});

app.get('/api/transactions', (req, res) => {
  res.json(data.transactions);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
