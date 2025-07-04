const chatBox = document.getElementById('chat');
const form = document.getElementById('chat-form');
const input = document.getElementById('message');

function appendMessage(author, text) {
  const div = document.createElement('div');
  div.className = 'mb-2';
  div.innerHTML = `<strong>${author}:</strong> ${text}`;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMessage(text) {
  const res = await fetch('gemini.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ text })
  });
  return res.text();
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  appendMessage('Você', text);
  input.value = '';
  try {
    const reply = await sendMessage(text);
    appendMessage('LuzzIA', reply);
  } catch (err) {
    appendMessage('Erro', 'Não foi possível enviar a mensagem.');
  }
});
