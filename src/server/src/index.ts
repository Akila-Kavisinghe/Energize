import express from 'express';
import apiRoutes from './routes/apiRoutes.js'; // Ensure apiRoutes is exported correctly in apiRoutes.ts

const app = express();
const port = 3001; // Different from React's port

app.use(express.json());

// API Routes
app.use('/api', apiRoutes);

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
