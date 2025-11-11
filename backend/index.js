import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import connectDB from './src/config/db.js';

import authRoutes from './src/routes/auth.js';
import articleRoutes from './src/routes/routes.articles.js';
import adminRoutes from './src/routes/admin.js';


const app = express();
app.use(cors());
app.use(express.json());

connectDB();

app.use('/auth', authRoutes);
app.use('/articles', articleRoutes);
app.use('/admin', adminRoutes);

app.get('/', (req, res) => res.send('Welcome to Article Management API'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
export default app;
