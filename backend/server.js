const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { WebSocketServer } = require('ws');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

// MongoDB User Schema
const userSchema = new mongoose.Schema({
  username: String,
  password: String, // hashed
  role: String // 'user' or 'admin'
});
const User = mongoose.model('User', userSchema);

// JWT Middleware
function authenticateJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
}

// Login Route
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ message: 'Invalid credentials' });

  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
});

// Protected Route Example
app.get('/api/protected', authenticateJWT, (req, res) => {
  res.json({ message: `Hello, ${req.user.role}!`, user: req.user });
});

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/eventdb')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB error:', err));

// Start HTTP server
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// WebSocket Server
const wss = new WebSocketServer({ server });

wss.on('connection', (ws, req) => {
  // Expect JWT in query string: ws://localhost:5000?token=...
  const params = new URLSearchParams(req.url.replace('/?', ''));
  const token = params.get('token');
  if (!token) {
    ws.close();
    return;
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      ws.close();
      return;
    }
    ws.user = user;
    ws.send('WebSocket connection authenticated!');
    // Handle messages
    ws.on('message', (msg) => {
      // Example: echo message
      ws.send(`Echo: ${msg}`);
    });
  });
});