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

const apiKey = process.env.VITE_GEMINI_API_KEY;
if (!apiKey || apiKey === 'your_gemini_api_key_here') {
  console.error('CRITICAL: Missing VITE_GEMINI_API_KEY. Please provide a real API key in the .env file.');
}

const genAI = new GoogleGenerativeAI(apiKey || '');
const model = genAI.getGenerativeModel({ 
  model: "gemini-3-flash-preview",
  systemInstruction: "You are AI Money Mentor. Use ₹ (INR). Focus on Indian tax laws (Old vs New regimes) and investment vehicles (PPF, NPS, SIPs, ELSS). Be concise, professional, and actionable. Use markers like [INVESTMENT_PLAN] or [TAX_ADVICE] for specialized sections. Greet users by their name if provided. If an error occurs or the prompt is invalid, reply with a helpful financial insight and ask for clarification."
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
    
    if (!message || !userProfile) {
      return res.status(400).json({ error: 'Missing message or user profile' });
    }

    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
      return res.status(500).json({ error: 'Backend AI is not configured. Please add VITE_GEMINI_API_KEY to .env' });
    }
  
  try {
    const prompt = `Context: User Name: ${userProfile.fullName}, Income: ₹${userProfile.income}. 
    User Question: ${message}`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    if (!text) throw new Error('Empty AI response');
    
    res.json({ text });
  } catch (error: any) {
    console.error('AI Error:', error);
    res.status(500).json({ error: 'Failed to generate AI advice. ' + (error.message || '') });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
