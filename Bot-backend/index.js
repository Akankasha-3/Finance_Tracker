import express from 'express';
import connectDB from './models/db.js';
import dotenv from 'dotenv';
import { handletelegramupdates, setWebhook } from './Routes/Telegramhandler.js';
import fetchbotid from './Routes/botid.js';
import cors from 'cors';

dotenv.config();
setWebhook();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 

app.get('/', (req, res) => {
    console.log('Request received', req.body);
    res.send('Get request received');
});

const allowedOrigins = [
  'http://localhost:3000',
  'https://fintrackbotwebsite-7iqj.vercel.app',
  'https://moneymate-cyan.vercel.app'
];

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST'],
  credentials: true
}));

app.post('/bot', async (req, res) => {
    const msg = req.body.message;
    console.log('Request received', req.body); 
    if (msg) {
        await handletelegramupdates(msg);
    }
    res.sendStatus(200);
});

app.use('/userdash/getexpenses', fetchbotid);

// ✅ Export instead of listening
const startServer = async () => {
    await connectDB();
};

startServer();

export default app;  // IMPORTANT for Vercel
