import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Inicializa Gemini usando a chave do .env
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post("/api/chat", async (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const { message } = req.body;

  try {
    // Modelo gratuito recomendado pelo Google
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash"
    });

    // Streaming da resposta
    const result = await model.generateContentStream(message);

    for await (const chunk of result.stream) {
      const text = chunk.text();
      if (text) {
        res.write(`data: ${text}\n\n`);
      }
    }

    res.write("data: [DONE]\n\n");
    res.end();
  } catch (error) {
    console.error("Erro no streaming:", error);
    res.write(`data: Erro: ${error.message}\n\n`);
    res.end();
  }
});

app.listen(3001, () => {
  console.log("Backend rodando em http://localhost:3001");
});
