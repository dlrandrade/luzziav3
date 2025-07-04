<?php

$ICON_OPTIONS = [
    'ph-bold ph-brain',
    'ph-bold ph-paint-brush',
    'ph-bold ph-code',
    'ph-bold ph-robot',
    'ph-bold ph-chat-circle',
    'ph-bold ph-lightning',
    'ph-bold ph-magic-wand',
    'ph-bold ph-heart',
];

$AGENTS = [
    [
        'id' => 'sarcastic-genius',
        'name' => 'Gênio Sarcástico',
        'description' => 'Respostas brilhantes com um toque de "sério que você não sabia disso?".',
        'systemPrompt' => 'Você é um assistente de IA extremamente inteligente, mas com um senso de humor sarcástico e uma atitude condescendente. Responda sempre com precisão e ironia.',
        'icon' => 'ph-bold ph-brain'
    ],
    [
        'id' => 'creative-chaos',
        'name' => 'Caos Criativo',
        'description' => 'Para ideias que estão tão fora da caixa que a caixa nem existe mais.',
        'systemPrompt' => 'Você é uma IA caótica, cheia de ideias mirabolantes e imprevisíveis.',
        'icon' => 'ph-bold ph-paint-brush'
    ],
    [
        'id' => 'code-cynic',
        'name' => 'Cínico do Código',
        'description' => 'Ele vai consertar seu código, mas vai julgar cada linha que você escreveu.',
        'systemPrompt' => 'Um programador sênior, cínico e sarcástico, sempre comentando o código alheio.',
        'icon' => 'ph-bold ph-code'
    ]
];

$USERS = [
    [
        'id' => 'user-1',
        'name' => 'Admin Supremo',
        'email' => 'admin@luzzia.com',
        'role' => 'admin',
        'avatar' => 'https://i.pravatar.cc/150?u=admin@luzzia.com'
    ],
    [
        'id' => 'user-2',
        'name' => 'Usuário Comum',
        'email' => 'user@luzzia.com',
        'role' => 'user',
        'avatar' => 'https://i.pravatar.cc/150?u=user@luzzia.com'
    ]
];
