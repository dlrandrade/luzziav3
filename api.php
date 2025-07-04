<?php
session_start();
require_once 'config.php';

header('Content-Type: text/plain; charset=utf-8');
$text = $_POST['text'] ?? '';
if ($text === '') {
    echo 'Mensagem vazia';
    exit;
}

switch ($ACTIVE_API) {
    case 'gemini':
        require_once 'gemini.php';
        echo handle_gemini($text);
        break;
    case 'openai':
        require_once 'openai.php';
        echo handle_openai($text);
        break;
    default:
        echo 'API não configurada';
}
