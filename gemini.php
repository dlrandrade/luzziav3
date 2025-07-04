<?php
session_start();
header('Content-Type: text/plain; charset=utf-8');
$text = $_POST['text'] ?? '';
if (!$text) {
    echo "Mensagem vazia";
    exit;
}

require_once 'data.php'; // Include data.php to access $AGENTS array

// Get the active agent's data
$agentId = $_SESSION['agent'] ?? $AGENTS[0]['id'];
$activeAgent = array_values(array_filter($AGENTS, fn($a) => $a['id'] === $agentId))[0];

// Get the API endpoint from the active agent's data, or use a default if not set
$apiEndpoint = $activeAgent['apiEndpoint'] ?? 'default_api_endpoint';

// Resposta simulada. Em uma aplicação real, aqui chamaríamos uma API de IA.
// For now, we'll just include the API endpoint in the reply for testing purposes.
$reply = "Você disse: " . htmlspecialchars($text, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
$reply .= " (API: " . htmlspecialchars($apiEndpoint, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8') . ")";

$_SESSION['messages'][] = ['author' => 'Você', 'text' => $text];
$_SESSION['messages'][] = ['author' => 'LuzzIA', 'text' => $reply];

echo $reply;
