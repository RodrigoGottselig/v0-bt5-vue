import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

// Verifica se a chave existe antes de iniciar
if (!apiKey) {
  throw new Error("A API Key do Gemini não foi definida no arquivo .env");
}

const genAI = new GoogleGenerativeAI(apiKey);

/**
 * Envia mensagem para o Gemini e recebe a resposta em pedaços (stream).
 * Configurado com os modelos disponíveis na sua conta (Gemini 2.0).
 */
export async function sendMessageStream(message: string, onChunk: (text: string) => void) {
  
  
  const modelosParaTestar = [
    "gemini-2.0-flash",          
    "gemini-2.0-flash-lite",     
    "gemini-flash-latest",       
    "gemini-pro"                 
  ];

  let ultimoErro: unknown;

  // Loop de Tentativa: Testa os modelos na ordem
  for (const nomeDoModelo of modelosParaTestar) {
    try {
      const model = genAI.getGenerativeModel({ model: nomeDoModelo });
      
      // Tenta iniciar o stream
      const result = await model.generateContentStream(message);
      
      // Se não deu erro ao chamar, iteramos sobre a resposta
      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        if (chunkText) {
          onChunk(chunkText);
        }
      }
      
      // Sucesso total, encerra a função
      return; 

    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      const msgErro = err.message;

      // Se o modelo não for encontrado (404), tenta o próximo da lista
      if (msgErro.includes("404") || msgErro.includes("not found")) {
        console.warn(`⚠️ Modelo '${nomeDoModelo}' falhou, tentando o próximo...`);
        ultimoErro = err;
        continue; 
      }

      // Se for outro erro (ex: cota excedida, erro de rede), para tudo
      console.error("❌ Erro na comunicação com a API:", err);
      throw err;
    }
  }

  // Se nenhum funcionar
  throw ultimoErro;
}