const socket = io.connect();

socket.on('productos', data => {
    let tabla = data2TableJS(data);
    document.getElementById('datos').innerHTML = tabla;
});

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

function addProduct(e) {
    var productos = {
        title: document.getElementById('title').value,
        price: document.getElementById('price').value,
        thumbnail: document.getElementById('thumbnail').value
    };

    socket.emit('nuevo-producto', productos);
    return false;
}
