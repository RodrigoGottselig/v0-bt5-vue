<template>
  <div>
    <button class="chat-button" @click="toggleChat">
      <i class="bi" :class="open ? 'bi-x-lg' : 'bi-chat-dots-fill'"></i>
    </button>

    <div v-if="open" class="chat-window">
      <div class="chat-header">Atendimento IA</div>

      <div class="chat-body" ref="chatBody">
        <div v-if="messages.length === 0" class="empty-state">
          Olá! Como posso ajudar você hoje?
        </div>

        <div
          v-for="(msg, index) in messages"
          :key="index"
          :class="['msg', msg.from]"
        >
          {{ msg.text }}
        </div>
        
        <div v-if="isLoading" class="msg bot typing">
          <span class="dot">.</span><span class="dot">.</span><span class="dot">.</span>
        </div>
      </div>

      <div class="chat-input">
        <input
          type="text"
          v-model="input"
          placeholder="Digite sua mensagem..."
          @keyup.enter="sendMessage"
          :disabled="isLoading"
        />
        <button @click="sendMessage" :disabled="isLoading || !input.trim()">
          <i class="bi bi-send-fill"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from "vue";
// IMPORTANTE: Remova o .js da importação se o arquivo for api.ts
import { sendMessageStream } from "../services/api";

// Estado
const open = ref(false);
const input = ref("");
const isLoading = ref(false);
const messages = ref<{ from: "user" | "bot"; text: string }[]>([]);
const chatBody = ref<HTMLDivElement | null>(null);

// Alternar chat e focar no input
const toggleChat = () => {
  open.value = !open.value;
  if (open.value) {
    nextTick(() => scrollToBottom());
  }
};

// Scroll
const scrollToBottom = () => {
  nextTick(() => {
    if (chatBody.value) {
      chatBody.value.scrollTop = chatBody.value.scrollHeight;
    }
  });
};

// Enviar mensagem
async function sendMessage() {
  if (!input.value.trim() || isLoading.value) return;

  const text = input.value;
  input.value = "";
  isLoading.value = true;

  // 1. Coloca mensagem do usuário
  messages.value.push({ from: "user", text });
  scrollToBottom();

  // 2. Cria espaço para a resposta do bot
  messages.value.push({ from: "bot", text: "" });
  const botIndex = messages.value.length - 1;

  try {
    // 3. Chama o serviço de API
    await sendMessageStream(text, (chunk: string) => {
      messages.value[botIndex].text += chunk;
      scrollToBottom();
    });
  } catch (error) {
    // 4. Tratamento de erro visual
    messages.value[botIndex].text = "Desculpe, ocorreu um erro na comunicação. Tente novamente.";
    console.error(error);
  } finally {
    isLoading.value = false;
    scrollToBottom();
  }
}
</script>

<style scoped>
.chat-button {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 60px;
  height: 60px;
  border: none;
  border-radius: 50%;
  background-color: #007bff;
  color: white;
  font-size: 24px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  cursor: pointer;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s;
}

.chat-button:hover {
  transform: scale(1.05);
}

.chat-window {
  position: fixed;
  bottom: 90px;
  right: 20px;
  width: 350px;
  height: 500px;
  background: white;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  z-index: 1000;
  overflow: hidden;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.chat-header {
  padding: 15px;
  background: linear-gradient(135deg, #007bff, #0056b3);
  color: white;
  font-weight: 600;
  font-size: 1.1rem;
}

.chat-body {
  flex: 1;
  padding: 15px;
  overflow-y: auto;
  background-color: #f8f9fa;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.empty-state {
  text-align: center;
  color: #888;
  margin-top: 50%;
  transform: translateY(-50%);
  font-size: 0.9rem;
}

.msg {
  padding: 10px 14px;
  border-radius: 12px;
  max-width: 85%;
  word-wrap: break-word;
  font-size: 0.95rem;
  line-height: 1.4;
}

.msg.user {
  background: #007bff;
  color: white;
  align-self: flex-end;
  border-bottom-right-radius: 2px;
}

.msg.bot {
  background: #e9ecef;
  color: #333;
  align-self: flex-start;
  border-bottom-left-radius: 2px;
}

.chat-input {
  display: flex;
  padding: 10px;
  background: white;
  border-top: 1px solid #eee;
}

.chat-input input {
  flex: 1;
  border: 1px solid #ddd;
  border-radius: 20px;
  padding: 10px 15px;
  outline: none;
  font-size: 0.95rem;
}

.chat-input input:focus {
  border-color: #007bff;
}

.chat-input button {
  border: none;
  background: none;
  color: #007bff;
  font-size: 1.2rem;
  padding: 0 10px 0 15px;
  cursor: pointer;
  transition: color 0.2s;
}

.chat-input button:disabled {
  color: #ccc;
  cursor: not-allowed;
}

/* Animação dos pontinhos */
.typing {
  font-style: italic;
  color: #888;
  background: none !important;
  padding-left: 0;
}
.dot {
  animation: blink 1.4s infinite both;
}
.dot:nth-child(2) { animation-delay: 0.2s; }
.dot:nth-child(3) { animation-delay: 0.4s; }

@keyframes blink {
  0% { opacity: 0.2; }
  20% { opacity: 1; }
  100% { opacity: 0.2; }
}
</style>