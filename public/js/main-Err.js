const socket = io.connect();

socket.on('productos', productos => {
    console.log('Lista', productos.length);
    let tabla = data2TableJS(productos);
    console.log('data2TableJS(productos)', tabla)
    document.getElementById('datos').innerHTML = tabla;
});

const form = document.querySelector('form');

form.addEventListener('submit', e => {
    e.preventDefault()

    console.log("Paso por el evento...")

    // TODO armar el objeto con los datos del formulario
    const data = {
        title: document.getElementById('title').value,
        price: document.getElementById('price').value,
        thumbnail: document.getElementById('thumbnail').value
    }
    //console.log(data)

    fetch('/api/productos/guardar', {
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(data)
    })
    .then(respuesta => respuesta.json())
    .then(productos => {
        // cuando guarde el producto, limpio el formulario y emito el evento de OK
        form.reset()
        socket.emit('update', 'ok');
    })
    .catch(error => console.error(error))
})


function data2TableJS(productos) {
    let res = ''
    if (productos.length) {
        res += `
        <style>
            .table td, .table th {
                vertical-align : middle;
            }
        </style>
        <div class="table-responsive">
            <table class="table table-dark">
                <tr> <th>Nombre</th> <th>Precio</th> <th>Foto</th> </tr>
        `
        res += productos.map(producto => `
                <tr>
                    <td>${producto.title}</td>
                    <td>$${producto.price}</td>
                    <td><img width="50" src="${producto.thumbnail}" alt="not found"></td>
                </tr>
        `).join(' ')
        res += `
            </table>
        </div>`
    }
    return res
}

function data2TableHBS(productos, cb) {

    fetch('plantillas/tabla.hbs')
        .then(respuesta => respuesta.text())
        .then(plantilla => {
            console.log('------- plantilla --------')
            console.log(plantilla)

            console.log('---------- html ----------')
            var template = Handlebars.compile(plantilla);
            let html = template({ productos })
            console.log(html)

            cb(html)
        })
}
