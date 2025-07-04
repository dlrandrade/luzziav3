<?php
function handle_gemini(string $text): string {
    // Resposta simulada. Substitua pela integração com sua API Gemini.
    $reply = "Você disse: " . htmlspecialchars($text, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
    $_SESSION['messages'][] = ['author' => 'Você', 'text' => $text];
    $_SESSION['messages'][] = ['author' => 'LuzzIA', 'text' => $reply];
    return $reply;
}
