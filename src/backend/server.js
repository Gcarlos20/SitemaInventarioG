const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const roles = ["Administrador", "Consultor", "Vendedor"];  

let usuarios = [ // el let es para poder modificar el array al eliminar o editar usuarios
    {
        id: 1,
        nombre: "Carlos",
        email: "carlos@email.com",
        password: "1234",
        role: "Administrador",
        estado: "Activo"
    },
    {
        id: 2,
        nombre: "María",
        email: "maria@email.com",
        password: "1234",
        role: "Supervisor",
        estado: "Activo"
    },
    {
        id: 3,
        nombre: "Jorge",
        email: "jorge@email.com",
        password: "1234",
        role: "Vendedor",
        estado: "Inactivo"
    }
];

let productos = [];

// RUTAS DE USUARIOS y ROLES
app.get("/roles", (req, res) => {
    res.json(roles);
});

app.get("/usuarios", (req, res) => {
    res.json(usuarios.map(({ password, ...rest }) => rest));
});

app.post("/register", (req, res) => {
    const { nombre, email, password, role } = req.body;
    if (!nombre || !email || !password || !role) {
        return res.status(400).json({ mensaje: "Faltan datos obligatorios." });
    }

    const existe = usuarios.some(u => u.email === email);
    if (existe) {
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

app.put("/usuarios/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const index = usuarios.findIndex(u => u.id === id);

    if (index === -1) {
        return res.status(404).json({ mensaje: "Usuario no encontrado." });
    }

    usuarios[index] = {
        ...usuarios[index],
        ...req.body,
        id,
        password: usuarios[index].password
    };

    const { password: _, ...usuarioSinPassword } = usuarios[index];
    res.json(usuarioSinPassword);
});

// GUARDAR PRODUCTO
app.post("/productos", (req, res) => {
    const producto = { id: Date.now(), ...req.body };
    productos.push(producto);
    res.json(producto);
});

// OBTENER PRODUCTOS
app.get("/productos", (req, res) => {
    res.json(productos);
});

// ELIMINAR PRODUCTO
app.delete("/productos/:id", (req, res) => {
    const id = parseInt(req.params.id);
    productos = productos.filter(p => p.id !== id);
    res.json({ mensaje: "Eliminado" });
});

// EDITAR PRODUCTO
app.put("/productos/:id", (req, res) => {
    const id = parseInt(req.params.id);
    productos = productos.map(p =>
        p.id === id ? { ...p, ...req.body } : p
    );
    res.json({ mensaje: "Actualizado" });
});

// INICIAR SERVIDOR
app.listen(3000, () => {
    console.log("Servidor corriendo en http://localhost:3000");
});

