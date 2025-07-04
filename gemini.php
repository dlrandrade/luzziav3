<?php
header('Content-Type: text/plain; charset=utf-8');
$text = $_POST['text'] ?? '';
if (!$text) {
    echo "Mensagem vazia";
    exit;
}
// Resposta simulada. Em uma aplicação real, aqui chamaríamos uma API de IA.
echo "Você disse: " . $text;
