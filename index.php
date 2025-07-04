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

// Handle API endpoint update
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['update_agent_api'])) {
    $agentIdToUpdate = $_POST['agent_id'];
    $newApiEndpoint = $_POST['api_endpoint'];

    $updatedAgents = [];
    foreach ($AGENTS as $key => $agent) {
        if ($agent['id'] === $agentIdToUpdate) {
            $AGENTS[$key]['apiEndpoint'] = $newApiEndpoint; // Update in current $AGENTS array for immediate reflection
            $agent['apiEndpoint'] = $newApiEndpoint; // Update for writing back to file
        }
        $updatedAgents[] = $agent;
    }

    // Persist changes to data.php
    // This is a simplified approach. In a real application, more robust file writing and error handling would be needed.
    $dataContent = "<?php\n\$AGENTS = " . var_export($updatedAgents, true) . ";\n\n\$USERS = " . var_export($USERS, true) . ";\n";
    file_put_contents('data.php', $dataContent);
    // Refresh AGENTS from the file to ensure consistency if multiple admins are editing (though not ideal for concurrent use)
    // For this simplified example, we'll rely on the in-memory update for the current request.
    // require 'data.php'; // This would reload $AGENTS and $USERS
    header('Location: index.php'); // Redirect to avoid form resubmission
    exit;
}


$user = $_SESSION['user'] ?? null;
$messages = $_SESSION['messages'] ?? [];
$agentId = $_SESSION['agent'] ?? $AGENTS[0]['id']; // Ensure $AGENTS is loaded before this line
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

        <?php if ($user['role'] === 'admin'): ?>
            <div class="mt-6 mb-4 p-4 border border-slate-200 rounded">
                <h3 class="text-lg font-semibold mb-2">Configurações de Agentes (Admin)</h3>
                <?php foreach ($AGENTS as $a): ?>
                    <form method="post" class="mb-3 p-3 border-b border-slate-100 bg-white rounded shadow">
                        <p class="font-medium text-slate-800"><?php echo htmlspecialchars($a['name']); ?></p>
                        <input type="hidden" name="agent_id" value="<?php echo htmlspecialchars($a['id']); ?>">
                        <div class="mt-1">
                            <label for="api_endpoint_<?php echo htmlspecialchars($a['id']); ?>" class="text-sm text-slate-600">Endpoint da API:</label>
                            <input type="text" name="api_endpoint" id="api_endpoint_<?php echo htmlspecialchars($a['id']); ?>"
                                   value="<?php echo htmlspecialchars($a['apiEndpoint'] ?? ''); ?>"
                                   class="w-full p-1 border border-slate-300 rounded mt-0.5">
                        </div>
                        <button type="submit" name="update_agent_api" class="mt-2 bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1 rounded">Salvar</button>
                    </form>
                <?php endforeach; ?>
            </div>
        <?php endif; ?>

        <div id="chat" class="border border-slate-200 rounded p-4 h-96 overflow-y-auto mb-4">
            <?php foreach ($messages as $m): ?>
                <div class="mb-2"><strong><?php echo htmlspecialchars($m['author']); ?>:</strong> <?php echo htmlspecialchars($m['text']); ?></div>
            <?php endforeach; ?>
        </div>
        <form id="chat-form" class="flex gap-2">
            <input type="text" id="message" class="flex-1 border p-2 rounded" placeholder="Digite sua mensagem" required>
            <button class="bg-slate-900 text-white px-4 rounded">Enviar</button>
        </form>
    </div>
    <script src="chat.js"></script>
<?php endif; ?>
</body>
</html>
