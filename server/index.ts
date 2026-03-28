import express from 'express';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3001;

app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.VITE_GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ 
  model: "gemini-3-flash-preview",
  systemInstruction: "You are AI Money Mentor. Use ₹ (INR). Focus on Indian tax laws (Old vs New regimes) and investment vehicles (PPF, NPS, SIPs, ELSS). Be concise, professional, and actionable. Use markers like [INVESTMENT_PLAN] or [TAX_ADVICE] for specialized sections. Greet users by their name if provided."
});

// Load SIP Data
const sipsData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'sips.json'), 'utf-8'));

app.get('/api/sips', (req, res) => {
  res.json(sipsData);
});

app.get('/api/sips/:id', (req, res) => {
  const sip = sipsData.find((s: any) => s.id === parseInt(req.params.id));
  if (sip) res.json(sip);
  else res.status(404).json({ error: 'SIP not found' });
});

app.post('/api/chat', async (req, res) => {
  const { message, userProfile } = req.body;
  
  try {
    const prompt = `Context: User Name: ${userProfile.fullName}, Income: ₹${userProfile.income}. 
    User Question: ${message}`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    res.json({ text });
  } catch (error: any) {
    console.error('AI Error:', error);
    res.status(500).json({ error: 'Failed to generate AI advice' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
