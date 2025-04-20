document.getElementById('connectWallet').addEventListener('click', async () => {
  // Debug log
  console.log("Connect button clicked");

  if (window.solana?.isPhantom) {
    try {
      console.log("Phantom detected, attempting connection...");
      
      // Connect to Phantom wallet
      const response = await window.solana.connect();
      const publicKey = response.publicKey.toString();

      console.log("Wallet connected. Public key:", publicKey);

      // Display connected wallet
      document.getElementById('walletStatus').textContent = `Connected: ${publicKey.slice(0, 5)}...${publicKey.slice(-5)}`;

      // **Update this URL to your live backend URL**
      const serverUrl = 'https://wizard-backend.onrender.com/wallet-connected';  // Live backend URL

      // Send to backend server
      console.log("Sending to backend...");
      const serverResponse = await fetch(serverUrl, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ publicKey }),
      });

      const result = await serverResponse.json();
      console.log("Backend response:", result);

      if (result.success) {
        alert("Wallet connected! Notification sent to Telegram.");
      } else {
        alert("Connected but failed to notify.");
      }

    } catch (err) {
      console.error("Connection error:", err);
      alert("Connection failed: " + err.message);
    }
  } else {
    const errorMsg = "Phantom Wallet not detected!";
    console.error(errorMsg);
    alert(errorMsg + " Please install Phantom from https://phantom.app/");
  }
});
