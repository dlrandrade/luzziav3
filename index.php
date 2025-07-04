<?php
session_start();
require_once 'data.php';

if (isset($_GET['logout'])) {
    session_destroy();
    header('Location: index.php');
    exit;
}

// handle login
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['role'])) {
    $role = $_POST['role'];
    foreach ($USERS as $u) {
        if ($u['role'] === $role) {
            $_SESSION['user'] = $u;
            break;
        }
    }
}

$user = $_SESSION['user'] ?? null;
$agentId = $_SESSION['agent'] ?? $AGENTS[0]['id'];
if (isset($_POST['agent'])) {
    $agentId = $_SESSION['agent'] = $_POST['agent'];
}
$activeAgent = array_values(array_filter($AGENTS, fn($a) => $a['id'] === $agentId))[0];

?><!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <title>LuzzIA</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Fraunces:wght@700&family=Inter:wght@400;600&display=swap" rel="stylesheet">
    <script src="https://unpkg.com/@phosphor-icons/web"></script>
    <style>
        body{font-family:'Inter',sans-serif;background-color:#f8f8f6;color:#111827;min-height:100vh}
        h1,h2,h3,h4,h5,h6{font-family:'Fraunces',serif}
    </style>
</head>
<body class="p-4">
<?php if (!$user): ?>
    <div class="max-w-sm mx-auto text-center mt-20">
        <h1 class="text-5xl font-bold mb-6">LuzzIA</h1>
        <form method="post" class="space-y-3">
            <button name="role" value="admin" class="w-full bg-slate-900 text-white p-3 rounded">Acessar como Admin</button>
            <button name="role" value="user" class="w-full bg-slate-200 text-slate-800 p-3 rounded">Acessar como Usuário</button>
        </form>
    </div>
<?php else: ?>
    <div class="max-w-2xl mx-auto">
        <div class="flex justify-between items-center mb-4">
            <h2 class="text-2xl font-bold">Olá, <?php echo htmlspecialchars($user['name']); ?></h2>
            <div>
                <a href="?logout=1" class="text-sm text-red-600">Sair</a>
            </div>
        </div>
        <form method="post" class="mb-4">
            <label for="agent" class="block text-sm font-semibold mb-1">Agente</label>
            <select name="agent" id="agent" onchange="this.form.submit()" class="w-full p-2 border rounded">
                <?php foreach ($AGENTS as $a): ?>
                    <option value="<?php echo $a['id']; ?>" <?php echo $a['id'] === $agentId ? 'selected' : ''; ?>><?php echo $a['name']; ?></option>
                <?php endforeach; ?>
            </select>
        </form>
        <div id="chat" class="border border-slate-200 rounded p-4 h-96 overflow-y-auto mb-4"></div>
        <form id="chat-form" class="flex gap-2">
            <input type="text" id="message" class="flex-1 border p-2 rounded" placeholder="Digite sua mensagem" required>
            <button class="bg-slate-900 text-white px-4 rounded">Enviar</button>
        </form>
    </div>
    <script src="chat.js"></script>
<?php endif; ?>
</body>
</html>
