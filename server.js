const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const handlebars = require('express-handlebars');
const productos = require('./api/productos');

// establecemos la configuración de handlebars
app.engine(
    "hbs",
    handlebars({
        extname: ".hbs",
        defaultLayout: 'index.hbs',
        layoutsDir: __dirname + '/views/layouts'
    })
);

app.set("view engine", "hbs");
app.set("views", "./views");

app.use(express.static( __dirname + '/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// definimos las rutas http
const router = express.Router();
app.use('/api', router);

/* -------------------- HTTP endpoints ---------------------- */

// TODO completar con lo realizado en entregas anteriores
router.get('/productos/listar', (req, res) => {
    try {
        res.status(200).send(JSON.stringify(productos.Listar()));
    } catch (error) {
        res.status(400).send(error);
    }
});

router.get('/productos/listar/:id', (req, res) => {
    try {
        res.status(200).send(JSON.stringify(productos.Listar(req.params.id)));
    } catch (error) {
        res.status(400).send(error);
    }
});

router.post('/productos/guardar', (req, res) => {
    try {
        console.log('Creado producto con:', req.body.title, req.body.price, req.body.thumbnail);

        productos.Agregar(req.body.title, req.body.price, req.body.thumbnail);
        //res.status(200).send(JSON.stringify(productos.Listar()));
        hayProductos = productos.hayProductos();
        res.render('layouts/index', {productos: productos.Listar(), hayProductos: hayProductos});
    } catch (error) {
        res.status(400).send(error);
    }
});

router.put('/productos/actualizar/:id', (req, res) => {
    try {
        res.status(200).send(JSON.stringify(productos.Actualizar(req.params.id, req.body.title, req.body.price, req.body.thumbnail)));
    } catch (error) {
        res.status(400).send(error);
    }
});

router.delete('/productos/borrar/:id', (req, res) => {
    try {
        res.status(200).send(JSON.stringify(productos.Borrar(req.params.id)));
    } catch (error) {
        res.status(400).send(error);
    }
});

router.get('/productos/vista', (req, res) => {
    try {
        let prods = productos.listar();

        res.render("vista", {
            productos: prods,
            hayProductos: prods.length
        });        
    } catch (error) {
        res.status(400).send(error);
    }

});

/* -------------------- Web Sockets ---------------------- */

io.on('connection', socket => {
    console.log('Un cliente se ha conectado');
    socket.emit('productos', productos.Listar());

    socket.on('nuevo-producto', data => {
        console.log('Un cliente ha enviado un mensaje');
        productos.Agregar(data.title, data.price, data.thumbnail);
        io.sockets.emit('productos', productos.Listar());
    });        
    
});

/* ------------------------------------------------------- */

const PORT = 8080;

const srv = server.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

srv.on("error", error => console.log(`Error en servidor ${error}`));
