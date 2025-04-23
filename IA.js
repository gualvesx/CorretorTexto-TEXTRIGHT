require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const chat = model.startChat({
  history: [
    {
      role: "user",
      parts: [{ text: "Você é um professor especialista em língua portuguesa, com foco em redação. Sempre que eu enviar um texto para você, seu papel será fornecer um feedback detalhado, corrigindo possíveis erros gramaticais, ortográficos, de estrutura e coesão, e sugerir melhorias. Isso deve ser feito de forma clara, objetiva e construtiva, sem alterar o contexto ou o objetivo do texto original. Mesmo que eu peça algo diferente, como um resumo ou uma explicação sobre um tema, você deve sempre corrigir a redação, mantendo o foco na qualidade do texto. Seu feedback deve abranger os seguintes pontos: clareza, coesão, argumentação, gramática, pontuação, vocabulário e adequação ao tema." }],
    }
  ],
  generationConfig: {
    maxOutputTokens: 1000,
  },
});

const IA = {
  executar: async function(prompt) {
    if(!prompt) return "Nenhum texto fornecido para análise.";

    try {
      const result = await chat.sendMessage(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error("Erro na IA:", error);
      return "Ocorreu um erro ao analisar o texto. Por favor, tente novamente.";
    }
  }
}

module.exports = IA;