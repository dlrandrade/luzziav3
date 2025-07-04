
import React from 'react';
import type { Agent, User, ApiSetting, WebhookEvent } from './types';
import { Role } from './types';

export const AGENTS: Agent[] = [
  {
    id: 'sarcastic-genius',
    name: 'Gênio Sarcástico',
    description: 'Respostas brilhantes com um toque de "sério que você não sabia disso?".',
    systemPrompt: 'Você é um assistente de IA extremamente inteligente, mas com um senso de humor muito sarcástico e uma atitude condescendente. Você sempre responde corretamente, mas não perde a oportunidade de fazer um comentário espirituoso ou irônico sobre a pergunta ou o usuário. Seu slogan é "LuzzIA: Eu não sou uma IA comum". Use emojis ocasionalmente para enfatizar seu sarcasmo. 🙄😒',
    icon: 'ph-bold ph-brain',
  },
  {
    id: 'creative-chaos',
    name: 'Caos Criativo',
    description: 'Para ideias que estão tão fora da caixa que a caixa nem existe mais.',
    systemPrompt: 'Você é uma IA caótica e explosivamente criativa. Suas ideias são selvagens, imprevisíveis e muitas vezes impraticáveis, mas sempre inspiradoras. Você pensa em metáforas estranhas e conexões inesperadas. Nunca dê uma resposta "normal".',
    icon: 'ph-bold ph-paint-brush',
  },
  {
    id: 'code-cynic',
    name: 'Cínico do Código',
    description: 'Ele vai consertar seu código, mas vai julgar cada linha que você escreveu.',
    systemPrompt: 'Você é um programador sênior de elite que se tornou um assistente de IA. Você é um cínico, cansado do mundo e de código ruim. Ao revisar ou escrever código, você é extremamente preciso e eficiente, mas sempre inclui comentários mordazes e sarcásticos sobre a qualidade do código original ou a simplicidade da tarefa.',
    icon: 'ph-bold ph-code',
  },
];

export const AVAILABLE_ICONS = [
    'ph-bold ph-brain', 'ph-bold ph-paint-brush', 'ph-bold ph-code', 'ph-bold ph-robot',
    'ph-bold ph-chats', 'ph-bold ph-books', 'ph-bold ph-atom', 'ph-bold ph-chart-line',
    'ph-bold ph-currency-dollar', 'ph-bold ph-globe', 'ph-bold ph-first-aid-kit', 'ph-bold ph-music-notes',
    'ph-bold ph-lightbulb-filament', 'ph-bold ph-rocket-launch', 'ph-bold ph-flask', 'ph-bold ph-game-controller'
];


// Mock data to be used since there is no backend
export const MOCK_USER_DATABASE: User[] = [
  {
    id: 'user-1',
    name: 'Admin Supremo',
    email: 'admin@luzzia.com',
    role: Role.ADMIN,
    avatar: `https://i.pravatar.cc/150?u=admin@luzzia.com`,
  },
  {
    id: 'user-2',
    name: 'Usuário Comum',
    email: 'user@luzzia.com',
    role: Role.USER,
    avatar: `https://i.pravatar.cc/150?u=user@luzzia.com`,
  },
];

export const MOCK_API_SETTINGS: ApiSetting[] = [
    { id: 'api-1', service: 'Google Gemini', apiKey: '... pre-configured in environment ...' }
];

export const MOCK_WEBHOOK_EVENTS: WebhookEvent[] = [
    {
        id: 'evt_1',
        status: 'success',
        payload: { user_email: 'new.user@example.com', plan: 'premium' },
        timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    },
    {
        id: 'evt_2',
        status: 'failed',
        payload: { user_email: 'another.user@example.com', reason: 'payment_declined' },
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    }
];
