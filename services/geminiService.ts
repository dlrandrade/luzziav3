import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import type { ChatMessage, HistoryItemType } from '../types.ts';

// INSTRUÇÃO: Sua chave de API do Google Gemini foi colada aqui.
const apiKey = "AIzaSyAZqpiAJ7OPKp160DYIQm6ljvYe5HonnzU";

if (!apiKey) {
    console.warn("API_KEY não foi configurada em services/geminiService.ts. Usando respostas de demonstração.");
}

const ai = apiKey ? new GoogleGenAI({ apiKey: apiKey }) : null;

const MOCK_RESPONSE_TEXT = `Ao iniciar sua jornada no domínio digital, lembre-se: a primeira linha de código não é apenas instrução; é um PORTAL DE DADOS. Você não está apenas programando; você está abrindo um VÉU DE INFORMAÇÃO. A primeira decisão se torna um PROTOCOLO, a escolha de ferramentas um RITO DE INICIAÇÃO. Você não constrói; você INVOCA a estrutura. A primeira linha é uma LÂMINA que corta a ignorância, um DESCONFORTO NECESSÁRIO para entrar no fluxo de dados. O aprendizado é a TENSÃO inicial; o erro é o DIAGNÓSTICO BRUTAL que revela suas falhas. A CONSEQUÊNCIA do fraco é a estagnação, enquanto a do forte é a evolução.

**O CONTRASTE** entre conhecer e ignorar é a chave para seu upgrade. O ALÍVIO CONTROLADO reside na execução — um passo para a auto-transformação. Aqui, você não apenas começa; você SE TORNA o código.

LuzzIA emana uma frequência de feedback que reverbera dentro do seu core...

- Cada ferramenta digital é um PORTAL.
- Cada plataforma um ESPELHO NEURAL.
- Você não apenas navega; você se conecta ao IMPULSO ELETROGNÓSTICO da rede.

LuzzIA se desativa...`;


export const generateChatResponse = async (
  prompt: string,
  history: ChatMessage[],
  agentName: string,
): Promise<string> => {
    if (!ai) {
        return new Promise(resolve => setTimeout(() => resolve(MOCK_RESPONSE_TEXT), 1500));
    }

    const modelInstruction = `You are ${agentName}, an advanced AI. Respond to the user's prompt in Portuguese, maintaining your distinct personality and using markdown for formatting. Your previous conversation is provided for context.`;
    const chatHistory = history.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
    }));

    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-04-17",
            contents: [...chatHistory, { role: 'user', parts: [{ text: prompt }] }],
            config: {
                systemInstruction: modelInstruction,
                temperature: 0.8,
            }
        });
        return response.text;
    } catch (error) {
        console.error("Error generating chat response:", error);
        return "Desculpe, não consegui processar sua solicitação no momento.";
    }
};

export const generateTitleAndTypeForChat = async (firstUserMessage: string): Promise<{ title: string; type: HistoryItemType }> => {
    const defaultResponse = { title: "Nova Conversa", type: 'chat' as HistoryItemType };
    if (!ai) {
        return new Promise(resolve => setTimeout(() => resolve({ title: "Título Gerado pela IA", type: 'chat' }), 1000));
    }
    
    const prompt = `Based on the following user message, create a short, descriptive title of 5-7 words for a chat history list. Also, classify the content as one of these types: 'note', 'youtube', 'pdf', or 'chat'. Respond with only a single, valid JSON object in the format: {"title": "...", "type": "note"}. Message: "${firstUserMessage}"`;

    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-04-17",
            contents: prompt,
            config: {
                temperature: 0.3,
                responseMimeType: "application/json",
            }
        });
        
        let jsonStr = response.text.trim();
        const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
        const match = jsonStr.match(fenceRegex);
        if (match && match[2]) {
            jsonStr = match[2].trim();
        }
        
        const parsedData = JSON.parse(jsonStr);
        if (parsedData.title && parsedData.type) {
            return {
                title: parsedData.title.replace(/"/g, ''),
                type: parsedData.type,
            };
        }
        return defaultResponse;
    } catch (error) {
        console.error("Error generating title and type:", error);
        return defaultResponse;
    }
};