const express = require('express');
const apiRoutes = require('./routes/apiRoutes');
const app = express();
const port = 3001; // Different from React's port

app.use(express.json());

// API Routes
app.use('/api', apiRoutes);

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});