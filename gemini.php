<?php
session_start();
header('Content-Type: text/plain; charset=utf-8');
$text = $_POST['text'] ?? '';
if (!$text) {
    echo "Mensagem vazia";
    exit;
}
// Resposta simulada. Em uma aplicação real, aqui chamaríamos uma API de IA.
$reply = "Você disse: " . htmlspecialchars($text, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');

$_SESSION['messages'][] = ['author' => 'Você', 'text' => $text];
$_SESSION['messages'][] = ['author' => 'LuzzIA', 'text' => $reply];

echo $reply;
