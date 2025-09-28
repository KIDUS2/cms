const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// View engine setup (EJS)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

// Database connection
mongoose.connect('mongodb://localhost:27017/cms', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('Connected to MongoDB');
});

// Import routes
const postRoutes = require('./src/routes/posts');
const adminRoutes = require('./src/routes/admin');

// Use routes
app.use('/posts', postRoutes);
app.use('/admin', adminRoutes);

// Basic route
app.get('/', (req, res) => {
    res.render('index', { title: 'Home' });
});

// 404 handler
app.use((req, res) => {
    res.status(404).render('404');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});