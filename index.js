import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key-here";

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token não fornecido" });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Token inválido" });
    }
    req.user = user;
    next();
  });
};

dotenv.config();
const app = express();
app.use(express.json());

const port = process.env.PORT || 3000;

// Login route
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Simulação de autenticação (em produção, use um banco de dados)
  if (username === "admin" && password === "admin123") {
    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: "1h" });
    res.json({ token });
  } else {
    res.status(401).json({ message: "Credenciais inválidas" });
  }
});

// Protected route
app.get("/protected", authenticateToken, (req, res) => {
  res.json({
    message: "Rota protegida acessada com sucesso!",
    user: req.user,
  });
});

// Public route
app.get("/", (req, res) => {
  res.send("Hello from the dummy Node.js app!");
});

app.listen(port, () => {
  console.log(`App is running on http://localhost:${port}`);
});
