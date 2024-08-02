import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import profileRoutes from './routes/profileRoutes.js';

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// Use routes
app.use('/api/profiles', profileRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
