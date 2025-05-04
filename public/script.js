// public/script.js
async function handleTransfer(e) {
  e.preventDefault();
  
  try {
      const amount = document.getElementById('amount').value;
      const toAccount = document.getElementById('toAccount').value;
      const resultDiv = document.getElementById('result');

      // Obter token CSRF
      const csrfResponse = await fetch('/api/csrf-token', {
          credentials: 'include'
      });
      
      if (!csrfResponse.ok) throw new Error('Falha ao obter token CSRF');
      
      const { csrfToken } = await csrfResponse.json();

      // Fazer transferência
      const transferResponse = await fetch('/api/transfer', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'X-XSRF-TOKEN': csrfToken
          },
          body: JSON.stringify({
              amount: amount.replace(/[^0-9.]/g, ''),
              toAccount: toAccount.replace(/[^a-zA-Z0-9]/g, '')
          }),
          credentials: 'include'
      });

      const data = await transferResponse.json();
      resultDiv.textContent = `Sucesso: ${data.message}`;
      resultDiv.style.color = 'green';
      
  } catch (error) {
      const resultDiv = document.getElementById('result');
      resultDiv.textContent = `Erro: ${error.message}`;
      resultDiv.style.color = 'red';
      console.error('Erro:', error);
  }
}

document.getElementById('transferForm').addEventListener('submit', handleTransfer);