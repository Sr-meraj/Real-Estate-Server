import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { residencyRoute } from './routes/residencyRoute.js';
import { userRoute } from './routes/userRoute.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

app.get('/', (req, res) => {
    return res.status(200).send( "Welcome to the Residence Management System" );
});

app.use('/api/user', userRoute);
// app.use('/api/agentuser', agentRoute);
app.use('/api/residency', residencyRoute);
