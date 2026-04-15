const express = require("express"); // Importar Express para crear el servidor
const cors = require("cors"); // Importar CORS para permitir solicitudes desde el frontend, es necesario para que el frontend pueda comunicarse con el backend sin problemas de seguridad relacionados con el mismo origen

const app = express(); // Crear una instancia de Express

app.use(cors()); // Habilitar CORS para todas las rutas, esto permite que el frontend pueda hacer solicitudes al backend sin restricciones de origen
app.use(express.json());  // Middleware para parsear el cuerpo de las solicitudes como JSON, esto es necesario para poder acceder a los datos enviados desde el frontend en formato JSON

const roles = ["Administrador", "Consultor", "Vendedor"];  // Roles predefinidos para los usuarios

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

let productos = []; // Array para almacenar los productos, también con let para poder modificarlo al eliminar o editar productos

// RUTAS DE USUARIOS y ROLES
app.get("/roles", (req, res) => { // Ruta para obtener los roles disponibles
    res.json(roles);
});

app.get("/usuarios", (req, res) => { // Ruta para obtener la lista de usuarios, se omite la contraseña en la respuesta
    res.json(usuarios.map(({ password, ...rest }) => rest));
});

app.post("/register", (req, res) => { // Ruta para registrar un nuevo usuario, se validan los datos y se verifica que el correo no esté registrado
    const { nombre, email, password, role } = req.body;
    if (!nombre || !email || !password || !role) {
        return res.status(400).json({ mensaje: "Faltan datos obligatorios." });
    }

    const existe = usuarios.some(u => u.email === email); // Verificar si el correo ya está registrado
    if (existe) {
        return res.status(409).json({ mensaje: "El correo ya está registrado." });
    }

    const usuario = { // Crear un nuevo usuario con un ID único basado en la fecha actual
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

    if (index === -1) { // Verificar si el usuario existe antes de intentar actualizarlo
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

