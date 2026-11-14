const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const getModel = (modelName = 'gemini-1.5-flash-latest') => {
  return genAI.getGenerativeModel({ model: modelName });
};

module.exports = { genAI, getModel };
