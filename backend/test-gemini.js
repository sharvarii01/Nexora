require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testGemini() {
  try {
    console.log("Testing Gemini API with key:", process.env.GEMINI_API_KEY ? "Set" : "Not set");
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent("Say hello");
    console.log("Success! Output:", result.response.text());
  } catch (err) {
    console.error("Gemini Error:", err.message);
  }
}
testGemini();
