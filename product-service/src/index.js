const express = require('express');
const axios = require('axios');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3002;


app.use(helmet());
app.use(cors());
app.use(express.json());


const products = new Map();


const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const response = await axios.get(`${process.env.AUTH_SERVICE_URL}/verify`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    req.user = response.data.user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};


app.get('/products', authenticate, (req, res) => {
  res.json(Array.from(products.values()));
});

app.get('/products/:id', authenticate, (req, res) => {
  const product = products.get(req.params.id);
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  res.json(product);
});

app.post('/products', authenticate, (req, res) => {
  const { name, price, description } = req.body;
  const id = Date.now().toString();
  const product = { id, name, price, description };
  products.set(id, product);
  res.status(201).json(product);
});

app.put('/products/:id', authenticate, (req, res) => {
  const { name, price, description } = req.body;
  const product = products.get(req.params.id);
  
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  const updatedProduct = { ...product, name, price, description };
  products.set(req.params.id, updatedProduct);
  res.json(updatedProduct);
});

app.delete('/products/:id', authenticate, (req, res) => {
  if (!products.has(req.params.id)) {
    return res.status(404).json({ message: 'Product not found' });
  }
  
  products.delete(req.params.id);
  res.status(204).send();
});

app.listen(port, () => {
  console.log(`Product service running on port ${port}`);
}); 