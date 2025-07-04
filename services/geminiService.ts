
import { GoogleGenAI } from "@google/genai";
import type { Agent, Message } from '../types';
import { MessageAuthor } from '../types';

if (!process.env.API_KEY) {
  console.warn("API_KEY environment variable not set. Using mock AI responses.");
}

const ai = process.env.API_KEY ? new GoogleGenAI({apiKey: process.env.API_KEY}) : null;

const MOCK_AI_RESPONSE = "Esta é uma resposta simulada. Forneça uma chave de API do Gemini para obter respostas reais.";
const MOCK_AI_TITLE = "Conversa de Teste";

export const getAiResponse = async (prompt: string, agent: Agent, history: Message[]): Promise<string> => {
    if (!ai) return MOCK_AI_RESPONSE;

    const modelHistory = history.map(msg => ({
        role: msg.author === MessageAuthor.USER ? 'user' : 'model',
        parts: [{ text: msg.text }]
    }));
    
    // The new prompt is part of the history already
    const contents = [...modelHistory];

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-preview-04-17',
            contents: contents,
            config: {
                systemInstruction: agent.systemPrompt,
            }
        });
        return response.text;
    } catch (error) {
        console.error("Error fetching from Gemini API:", error);
        return "Desculpe, encontrei um erro ao tentar me conectar ao serviço de IA.";
    }
};

export const generateChatTitle = async (firstUserMessage: string, firstAiResponse: string): Promise<string> => {
    if (!ai) return MOCK_AI_TITLE;

    const prompt = `Gere um título curto e conciso (máximo de 5 palavras) para a seguinte conversa. Responda apenas com o título, sem aspas.
    ---
    Usuário: "${firstUserMessage}"
    AI: "${firstAiResponse}"
    ---
    Título:`;
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-preview-04-17',
            contents: prompt
        });

        let title = response.text.trim();
        if (title.startsWith('"') && title.endsWith('"')) {
            title = title.substring(1, title.length - 1);
        }
        return title;
    } catch (error) {
        console.error("Error generating title:", error);
        return "Nova Conversa";
    }
}
