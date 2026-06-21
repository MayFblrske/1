js

const WebSocket = require('ws');

const port = 8080;
const wss = new WebSocket.Server({ port });

wss.on('connection', (ws) => {
  console.log('Клиент подключился');

  ws.on('message', (message) => {
    console.log(`Получено сообщение: ${message}`);
    // Рассылаем сообщение всем подключенным пользователям
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  ws.on('close', () => {
    console.log('Клиент отключился');
  });
});

console.log(`Сервер запущен на порту ${port}`);
Для запуска:

bash

npm init -y
npm install ws
node server.js
2. Клиентская часть (HTML + JavaScript)

Обновим ваш HTML чтобы он подключался к серверу WebSocket:

html

<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Чат-комната с WebSocket</title>
<style>
  body { font-family: Arial, sans-serif; background: #f0f0f0; padding: 20px; }
  #chat-box { width: 100%; max-width: 600px; height: 400px; border: 1px solid #ccc; background: #fff; padding: 10px; overflow-y: auto; }
  #messages { list-style: none; padding: 0; margin: 0; }
  #messages li { margin-bottom: 10px; }
  #messages .author { font-weight: bold; }
  #message-form { display: flex; margin-top: 10px; }
  #message-input { flex: 1; padding: 8px; font-size: 16px; }
  #send-btn { padding: 8px 16px; font-size: 16px; }
</style>
</head>
<body>

<h2>Чат-комната с WebSocket</h2>
<div id="chat-box">
  <ul id="messages"></ul>
</div>
<form id="message-form">
  <input type="text" id="message-input" placeholder="Введите сообщение..." autocomplete="off" required />
  <button type="submit" id="send-btn">Отправить</button>
</form>

<script>
  const ws = new WebSocket('ws://localhost:8080'); // URL сервера WebSocket
  const messagesList = document.getElementById('messages');
  const chatBox = document.getElementById('chat-box');
  const form = document.getElementById('message-form');
  const input = document.getElementById('message-input');

  ws.onopen = () => {
    console.log('Соединение установлено');
  };

  ws.onmessage = (event) => {
    const message = event.data;
    addMessage('Другой', message);
  };

  ws.onclose = () => {
    console.log('Соединение закрыто');
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const messageText = input.value.trim();
    if (messageText !== '') {
      const messageWithAuthor = `Я: ${messageText}`;
      ws.send(messageText); // Отправляем сообщение на сервер
      addMessage('Я', messageText); // Отображаем у себя
      input.value = '';
    }
  });

  function addMessage(author, text) {
    const li = document.createElement('li');
    li.innerHTML = `<span class="author">${author}:</span> ${text}`;
    messagesList.appendChild(li);
    chatBox.scrollTop = chatBox.scrollHeight;
  }
</script>

</body>
</html>
