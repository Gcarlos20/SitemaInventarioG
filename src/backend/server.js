const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const roles = ["Administrador", "Consultor", "Vendedor"];

const usuarios = [
    { id: 1, nombre: "Carlos", email: "carlos@email.com", password: "1234", role: "Administrador", estado: "Activo" },
    { id: 2, nombre: "María", email: "maria@email.com", password: "1234", role: "Consultor", estado: "Activo" },
    { id: 3, nombre: "Jorge", email: "jorge@email.com", password: "1234", role: "Vendedor", estado: "Inactivo" }
];

app.get("/roles", (req, res) => {
    res.json(roles);
});

app.post("/register", (req, res) => {
    const { nombre, email, password, role } = req.body;
    if (!nombre || !email || !password || !role) {
        return res.status(400).json({ mensaje: "Faltan datos obligatorios." });
    }

    if (!roles.includes(role)) {
        return res.status(400).json({ mensaje: "Rol inválido." });
    }

    if (usuarios.some(u => u.email === email)) {
        return res.status(409).json({ mensaje: "El correo ya está registrado." });
    }

    const usuario = {
        id: Date.now(),
        nombre,
        email,
        password,
        role,
        estado: "Activo"
    };

    usuarios.push(usuario);
    const { password: _, ...usuarioSinPassword } = usuario;
    res.status(201).json(usuarioSinPassword);
});

app.post("/login", (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ mensaje: "Credenciales incompletas." });
    }

    const usuario = usuarios.find(u => u.email === email && u.password === password);
    if (!usuario) {
        return res.status(401).json({ mensaje: "Credenciales inválidas." });
    }

    if (usuario.estado !== "Activo") {
        return res.status(403).json({ mensaje: "Usuario inactivo." });
    }

    const { password: _, ...usuarioSinPassword } = usuario;
    res.json(usuarioSinPassword);
});

app.listen(3000, () => {
    console.log("Servidor corriendo en http://localhost:3000");
});

