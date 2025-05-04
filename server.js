const express = require('express');
const cookieParser = require('cookie-parser');
const csrf = require('csurf');
const helmet = require('helmet');
const app = express();

// Middlewares de segurança
// app.use(helmet()); // Proteção contra vários vetores de ataque
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        'script-src': ["'self'"]
      }
    }
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(csrf({ cookie: true })); // CSRF com cookies HTTP-only

// Cookies Seguros
app.use(csrf({ 
  cookie: { 
    httpOnly: true,
    secure: true, // Apenas HTTPS
    sameSite: 'strict'
  }
}));

// Configuração de CORS (ajuste para seu domínio)
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3001');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-XSRF-TOKEN');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  next();
});

// Rota para obter o token CSRF
app.get('/api/csrf-token', (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// Rota protegida de transferência
app.post('/api/transfer', (req, res) => {
  // Validação do CSRF é automática pelo middleware
  const { amount, toAccount } = req.body;

  // Simulação de transferência
  console.log(`Transferindo ${amount} para conta ${toAccount}`);
  res.json({ success: true, message: 'Transferência realizada com sucesso!' });
});

// Validação
app.post('/api/transfer', (req, res) => {
  const amount = parseFloat(req.body.amount);
  const toAccount = String(req.body.toAccount).replace(/[^a-zA-Z0-9]/g, '');
  // ...
});

// Iniciar servidor
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

app.use(express.static('public')); // Se o HTML estiver na pasta "public"



