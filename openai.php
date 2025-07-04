<?php
function handle_openai(string $text): string {
    // Exemplo simples. Substitua pela chamada real ao OpenAI ou outra IA.
    $reply = "OpenAI (simulado): " . strrev($text);
    $_SESSION['messages'][] = ['author' => 'Você', 'text' => $text];
    $_SESSION['messages'][] = ['author' => 'LuzzIA', 'text' => $reply];
    return $reply;
}
