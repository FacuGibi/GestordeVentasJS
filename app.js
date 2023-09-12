// JS STOCK.HTML
verStock();
verClientes();
let var_id = "";
let idArticulo = "";
let stockArticulo = 0;
let idCliente = "";
let totalVta = 0;

async function verStock() {
  let art = await axios.get("https://dbjson-gestor-de-ventas-js.vercel.app/articulos");

  for (item of art.data) {
    let stock = item.stock;
    if (item.stock == 0) {
      stock = `${item.stock} - Cero`;
    } else if (item.stock > 5) {
      stock = `${item.stock} - Completo`;
    } else {
      stock = `${item.stock} - Critico`;
    }

    document.getElementById("tableStock").innerHTML += `
    <tr>
        <td>${item.codigo}</td>
        <td>${item.nombre}</td>
        <td>
          ${stock}
        </td>
        <td>${item.precioCompra}</td>
        <td>${item.precioVenta}</td>
        <td>
            <button type="button" data-bs-toggle="modal" data-bs-target="#modalModStock" onclick="modArt(${item.id},${item.codigo}, '${item.nombre}', ${item.stock}, ${item.precioCompra}, ${item.precioVenta})"><i class="bi bi-pencil-square"></i></button>

            <button onClick="elimArt(${item.id}, ${item.stock})" ><i class="bi bi-trash"></i></button>
        </td>
    </tr>
    `;
  }
}

async function agregarArt() {
  try {
    let art = await axios.get("https://dbjson-gestor-de-ventas-js.vercel.app/articulos");

    for (item of art.data) {
      if (
        document.getElementById("cod").value == "" ||
        document.getElementById("nom").value == "" ||
        document.getElementById("stock").value == "" ||
        document.getElementById("preCom").value == "" ||
        document.getElementById("preVen").value == ""
      ) {
        alert("Debe agregar todos los datos");
        return;
      }

      if (item.codigo !== (document.getElementById("cod").value)) {
        await axios.post("https://dbjson-gestor-de-ventas-js.vercel.app/articulos", {
          codigo: document.getElementById("cod").value,
          nombre: document.getElementById("nom").value,
          stock: parseInt(document.getElementById("stock").value),
          precioCompra: parseInt(document.getElementById("preCom").value),
          precioVenta: parseInt(document.getElementById("preVen").value),
        });
        alert("Artículo agregado correctamente");
        return;
      } else {
        alert("El artículo ya existe");
        return;
      }
    }
  } catch (error) {
    console.log(error);
  }
}

function modArt(id, cod, nom, stock, preCom, preVen) {
  var_id = id;

  document.getElementById("modalCodSt").value = cod;
  document.getElementById("modalNomSt").value = nom;
  document.getElementById("modalStockSt").value = stock;
  document.getElementById("modalPreComSt").value = preCom;
  document.getElementById("modalPreVenSt").value = preVen;
}

function elimArt(id, stock) {
  if (!stock) {
    if (confirm("¿Desea borrar el artículo?") == true) {
      axios
        .delete("https://dbjson-gestor-de-ventas-js.vercel.app/articulos/" + id)
        .then((res) => alert("Artículo eliminado correctamente"))
        .catch((err) => console.log(err));
    }
  } else {
    alert("No se puede eliminar, aún queda stock de este artículo");
  }
}

function modificarArticulo() {
  let codigoArt = document.getElementById("modalCodSt").value;
  let nombreArt = document.getElementById("modalNomSt").value;
  let stockArt = document.getElementById("modalStockSt").value;
  let PrecioComArt = document.getElementById("modalPreComSt").value;
  let PrecioVenArt = document.getElementById("modalPreVenSt").value;

  if (
    codigoArt > 0 &&
    nombreArt &&
    stockArt &&
    PrecioComArt > 0 &&
    PrecioVenArt > 0
  ) {
    axios
      .put("https://dbjson-gestor-de-ventas-js.vercel.app/articulos/" + var_id, {
        codigo: codigoArt,
        nombre: nombreArt,
        stock: parseInt(stockArt),
        precioCompra: parseInt(PrecioComArt),
        precioVenta: parseInt(PrecioVenArt),
      })
      .then((res) => alert("Artículo modificado correctamente"))
      .catch((err) => console.log(err));
  } else {
    alert("Debe agregar todos los datos de forma correcta");
  }
}

function cancelarModificacion() {
  var_id = "";
  document.getElementById("btnModificar").style.visibility = "hidden";
  document.getElementById("btnCancelar").style.visibility = "hidden";

  document.getElementById("cod").value = "";
  document.getElementById("nom").value = "";
  document.getElementById("stock").value = "";
  document.getElementById("preCom").value = "";
  document.getElementById("preVen").value = "";
}

function limpiar() {
  document.getElementById("cod").value = "";
  document.getElementById("nom").value = "";
  document.getElementById("stock").value = "";
  document.getElementById("preCom").value = "";
  document.getElementById("preVen").value = "";
}

//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////
// JS VENTAS.HTML

$(async function listarArticulos() {
  let art = await axios.get("https://dbjson-gestor-de-ventas-js.vercel.app/articulos");

  let list = [];

  for (const item of art.data) {
    list.push(item.nombre);
    list.push(item.codigo);
  }

  $("#buscArticulo").autocomplete({
    source: list,
  });
});

async function verArticulo() {
  let art = await axios.get("https://dbjson-gestor-de-ventas-js.vercel.app/articulos");
  let prod = document.getElementById("buscArticulo").value;

  if (prod != "") {
    art.data.map((e) => {
      if (!e.nombre.indexOf(prod)) {
        idArticulo = e.id;
        stockArticulo = e.stock;
      }
    });

    art = await axios.get("https://dbjson-gestor-de-ventas-js.vercel.app/articulos/" + idArticulo);
    if (art.data.stock > 0) {
      document.getElementById("buscCodAr").value = art.data.codigo;
      document.getElementById("buscNomAr").value = art.data.nombre;
      document.getElementById("buscPreAr").value = art.data.precioVenta;
      console.log(stockArticulo);
    } else {
      alert(`NO HAY STOCK DE "${art.data.nombre}"`);
    }
  } else {
    alert("Debe ingresar un artículo primero");
  }
}

function cargarArticulo() {
  let nomArt = document.getElementById("buscNomAr").value;
  let codArt = document.getElementById("buscCodAr").value;
  let preArt = document.getElementById("buscPreAr").value;
  let cantidad = document.getElementById("buscCantAr").value;
  let totalArt = cantidad * preArt;
  totalVta = totalVta + totalArt;

  if (codArt != "" && cantidad > 0) {
    if (cantidad <= stockArticulo) {
      document.getElementById("col2").style.visibility = "visible";

      document.getElementById("bodyVentas").innerHTML += `
    <tr>
        <td>${nomArt}</td>
        <td>${codArt}</td>
        <td>${preArt}</td>
        <td>${cantidad}</td>
        <td>${totalArt}</td>
    </tr>
    `;
      document.getElementById("footVentas").innerHTML = totalVta;

      let cantPorArt = localStorage.getItem(idArticulo);
      if (cantPorArt) {
        let suma = parseInt(cantPorArt) + parseInt(cantidad);
        localStorage.setItem(idArticulo, suma);
      } else {
        localStorage.setItem(idArticulo, cantidad);
      }

      document.getElementById("buscCodAr").value = "";
      document.getElementById("buscNomAr").value = "";
      document.getElementById("buscPreAr").value = "";
      document.getElementById("buscCantAr").value = "";
    } else {
      alert(
        `No hay stock para la cantidad ingresada - STOCK ACTUAL: ${stockArticulo}`
      );
    }
  } else {
    alert("Debe agregar el artículo y la cantidad deseada");
  }
}


function generarVenta() {
  document.getElementById("datosPago").style.visibility = "visible";
  document.getElementById("btnGenerarVenta").style.visibility = "hidden";
  document.getElementById("datosArticulos").style.visibility = "hidden";
}

function cancelarVenta() {
  document.location.reload();
  localStorage.clear();
}

//LUEGO DE GENERAR VENTA
function checkEfectivo() {
  if (document.getElementById("pagoEfec").checked) {
    document.getElementById("datosCliente").style.visibility = "hidden";
    document.getElementById("btnConfirmarVenta").style.visibility = "visible";
  }
}
function checkCtaCte() {
  if (document.getElementById("pagoCtaCte").checked) {
    document.getElementById("datosCliente").style.visibility = "visible";
    document.getElementById("btnConfirmarVenta").style.visibility = "visible";
  }
}

$(async function listarClientes() {
  let clientes = await axios.get("https://dbjson-gestor-de-ventas-js.vercel.app/clientes");

  let list = [];

  for (const item of clientes.data) {
    list.push(item.nombre);
  }

  $("#buscCliente").autocomplete({
    source: list,
  });
});

async function verCliente() {
  let clientes = await axios.get("https://dbjson-gestor-de-ventas-js.vercel.app/clientes");
  let nomCliente = document.getElementById("buscCliente").value;

  if (nomCliente != "") {
    clientes.data.map((e) => {
      if (!e.nombre.indexOf(nomCliente)) {
        idCliente = e.id;
      }
    });

    clientes = await axios.get("https://dbjson-gestor-de-ventas-js.vercel.app/clientes/" + idCliente);

    if (clientes.data.estado != 0) {
      document.getElementById("buscNomCl").style.visibility = "visible";
      document.getElementById("buscNomCl").value = clientes.data.nombre;
    } else {
      alert(`EL CLIENTE ${clientes.data.nombre} NO ESTA HABILITADO`);
    }
  } else {
    alert("Debe agregar un cliente primero");
  }
}

async function confirmarVenta() {
  let clientes = await axios.get("https://dbjson-gestor-de-ventas-js.vercel.app/clientes");
  let tipoVenta = await axios.get("https://dbjson-gestor-de-ventas-js.vercel.app/tipoVenta");

  //CARGA DE VENTA EN EFECTIVO
  if (document.getElementById("pagoEfec").checked) {
    //CARGAR VENTA EN TIPOVENTA
    let total = tipoVenta.data[0].total;
    axios
      .patch("https://dbjson-gestor-de-ventas-js.vercel.app/tipoVenta/0", { total: total + totalVta })
      .then((res) => console.log(res))
      .catch((err) => console.log(err));

    //CARGAR VENTA DE CONTADO EN MOVIMIENTOS DE CAJA
    axios
      .post("https://dbjson-gestor-de-ventas-js.vercel.app/movimientos", {
        movimiento: "Venta contado",
        valor: totalVta,
        descripcion: "",
      })
      .then((res) => {
        console.log(res);
        alert("Venta realizada con éxito");
      })
      .catch((err) => console.log(err));

    disminuirStock();
    return;
  }

  //CARGA DE VENTA EN CLIENTES
  if (document.getElementById("pagoCtaCte").checked) {
    let nomCliente = document.getElementById("buscNomCl").value;
    clientes.data.map((e) => {
      if (!e.nombre.indexOf(nomCliente)) {
        idCliente = e.id;
      }
    });
    clientes = await axios.get("https://dbjson-gestor-de-ventas-js.vercel.app/clientes/" + idCliente);

    if (clientes.data.saldo <= 5000) {
      let saldo = clientes.data.saldo;
      let nuevoSaldo = saldo + totalVta;
      axios
        .patch("https://dbjson-gestor-de-ventas-js.vercel.app/clientes/" + idCliente, {
          saldo: nuevoSaldo,
        })
        .then((res) => console.log(res))
        .catch((err) => console.log(err));
      console.log(nuevoSaldo);
      if (nuevoSaldo > 5000) {
        axios.patch("https://dbjson-gestor-de-ventas-js.vercel.app/clientes/" + idCliente, {
          estado: 0,
        });
      }

      //CARGAR VENTA EN TIPOVENTA
      let total = tipoVenta.data[1].total;
      axios
        .patch("https://dbjson-gestor-de-ventas-js.vercel.app/tipoVenta/1", { total: total + totalVta })
        .then((res) => {
          console.log(res);
          alert("Venta realizada con éxito");
        })
        .catch((err) => console.log(err));

      disminuirStock();
      return;
    } else {
      alert(`El cliente ${clientes.data.nombre} supero el límite de compra`);
      return;
    }
  }
}

//CARGA DE VENTA EN STOCK DE ARTICULOS
async function disminuirStock() {
  let articulos = await axios.get("https://dbjson-gestor-de-ventas-js.vercel.app/articulos");

  for (let i = 0; i < articulos.data.length; i++) {
    if (localStorage.getItem(i)) {
      axios
        .patch("https://dbjson-gestor-de-ventas-js.vercel.app/articulos/" + i, {
          stock: articulos.data[i].stock - parseInt(localStorage.getItem(i)),
        })
        .then((res) => console.log(res))
        .catch((err) => console.log(err));
    }
  }
  localStorage.clear();
}

//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////
// JS CLIENTES.HTML

async function verClientes() {
  let clientes = await axios.get("https://dbjson-gestor-de-ventas-js.vercel.app/clientes");

  for (item of clientes.data) {
    document.getElementById("tableClientes").innerHTML += `
    <tr>
        <td>${item.nombre}</td>
        <td>$${item.saldo}</td>
        <td>
        ${
          item.estado == 0
            ? `${item.estado} - Deshabilitado`
            : `${item.estado} - Habilitado`
        }        
        </td>
        <td>
            <button type="button" data-bs-toggle="modal" data-bs-target="#modalModCliente" onclick="modCliente(${item.id},'${item.nombre}')"><i class="bi bi-pencil-square"></i></button>
        
            <button onClick="elimCliente(${item.id})" ><i class="bi bi-trash"></i></button>

            <button type="button" class="btn btn-outline-info" data-bs-toggle="modal" data-bs-target="#modalPagoCliente" onclick="pagoCliente(${
              item.id
            },'${item.nombre}',${item.saldo})">Pagar</button>
        </td>
        <td>
            <button type="button" class="btn btn-light" onClick="deshabilitarCliente(${
              item.id
            })">Habilitar/Deshabilitar</button>

            
        </td>
        
    </tr>
    `;
  }
}

async function deshabilitarCliente(id) {
  let cliente = await axios.get("https://dbjson-gestor-de-ventas-js.vercel.app/clientes/" + id);

  console.log(cliente.data);

  if (cliente.data.estado == 0) {
    axios
      .patch("https://dbjson-gestor-de-ventas-js.vercel.app/clientes/" + id, { estado: 1 })
      .then((res) => alert(`El cliente ${cliente.data.nombre} fue habilitado`))
      .catch((err) => console.log(err));
  } else {
    axios
      .patch("https://dbjson-gestor-de-ventas-js.vercel.app/clientes/" + id, { estado: 0 })
      .then((res) =>
        alert(`El cliente ${cliente.data.nombre} fue deshabilitado`)
      )
      .catch((err) => console.log(err));
  }
}

function agregarCliente() {
  let nomCliente = document.getElementById("nomCli").value;

  if (nomCliente != "") {
    axios
      .post("https://dbjson-gestor-de-ventas-js.vercel.app/clientes", {
        nombre: nomCliente,
        saldo: 0,
        estado: 1,
      })
      .then((res) => alert(`El cliente ${nomCliente} fue agregado con éxito`))
      .catch((err) => console.log(err));
  } else {
    alert("Debe agregar un nombre primero");
  }
}

async function elimCliente(id) {
  let cliente = await axios.get("https://dbjson-gestor-de-ventas-js.vercel.app/clientes/" + id);

  if (cliente.data.saldo == 0) {
    if (confirm("¿Desea eliminar este cliente?")) {
      axios
        .delete("https://dbjson-gestor-de-ventas-js.vercel.app/clientes/" + id)
        .then((res) => alert(`El cliente ${cliente.data.nombre} fue eliminado`))
        .catch((err) => console.log(err));
    }
  } else {
    alert(
      `El cliente no se puede eliminar por que tiene una deuda de $${cliente.data.saldo}`
    );
  }
}

function modCliente(id, nom) {
  localStorage.clear();
  localStorage.setItem("id", id);
  localStorage.setItem("nombre", nom);
  document.getElementById("modNomCl").value = nom;
}
function modificarCliente() {
  if (confirm("¿Desea modificar el cliente?")) {
    let nuevoNombre = document.getElementById("modNomCl").value;
    let id = localStorage.getItem("id");
    axios
      .patch("https://dbjson-gestor-de-ventas-js.vercel.app/clientes/" + id, { nombre: nuevoNombre })
      .then((res) => {
        alert("Cliente modificado con éxito");
        localStorage.clear();
      })
      .catch((err) => console.log(err));
  }
}

function pagoCliente(id, nombre, saldo) {
  localStorage.clear();
  localStorage.setItem("id", id);
  localStorage.setItem("saldo", saldo);
  localStorage.setItem("nombre", nombre);
  document.getElementById("modalNomCl").value = nombre;
  document.getElementById("modalSaldoCl").value = `$${saldo}`;
  document.getElementById("modalPagoCl").value = "";
}
async function confPagoCliente() {
  let vtaClientesActual = await axios.get("https://dbjson-gestor-de-ventas-js.vercel.app/tipoVenta/1");
  let vtaEfectivoActual = await axios.get("https://dbjson-gestor-de-ventas-js.vercel.app/tipoVenta/0");
  let id = localStorage.getItem("id");
  let saldoActual = localStorage.getItem("saldo");
  let nombre = localStorage.getItem("nombre");
  let pago = document.getElementById("modalPagoCl").value;
  let nuevoSaldo = saldoActual - pago;
  let vtaClientesNuevo = vtaClientesActual.data.total - pago;
  let vtaEfectivoNuevo =
    parseInt(vtaEfectivoActual.data.total) + parseInt(pago);

  if (parseInt(pago) <= parseInt(saldoActual)) {
    await axios
      .patch("https://dbjson-gestor-de-ventas-js.vercel.app/clientes/" + id, { saldo: nuevoSaldo })
      .then((res) => console.log(res))
      .catch((err) => console.log(err));

    await axios
      .patch("https://dbjson-gestor-de-ventas-js.vercel.app/tipoVenta/1", { total: vtaClientesNuevo })
      .then((res) => console.log(res))
      .catch((err) => console.log(err));

    await axios
      .patch("https://dbjson-gestor-de-ventas-js.vercel.app/tipoVenta/0", {
        total: parseInt(vtaEfectivoNuevo),
      })
      .then((res) => console.log(res))
      .catch((err) => console.log(err));

    await axios
      .post("https://dbjson-gestor-de-ventas-js.vercel.app/movimientos", {
        movimiento: "Pago de cliente",
        valor: parseInt(pago),
        descripcion: `El cliente ${nombre} pago $${pago}`,
      })
      .then((res) => {
        alert("Pago realizado con éxito");
        localStorage.clear();
      })
      .catch((err) => console.log(err));
  } else {
    alert("El pago no puede ser mayor al saldo del cliente");
  }
}

//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////
// JS REPORTES.HTML

async function verMovimientos() {
  let movimientos = await axios.get("https://dbjson-gestor-de-ventas-js.vercel.app/movimientos");
  for (item of movimientos.data.reverse()) {
    document.getElementById(
      "modalMovimientosBody"
    ).innerHTML += `<table id="table${item.id}" class="table table-dark table-borderless">
            <thead>
              <tr>
                <th scope="col">MOVIMIENTO</th>
                <th scope="col">VALOR</th>
                <th scope="col">DESCRIPCION</th>
              </tr>
            </thead>
            <tbody id="tableMovimientos">
              <tr>
                <td scope="col">${item.movimiento}</td>
                <td scope="col">${item.valor}</td>
                <td scope="col">${item.descripcion}</td>
              </tr>
            </tbody>
            <hr>
      </table>`;
  }
}

async function totalesVentas() {
  let tipoVta = await axios.get("https://dbjson-gestor-de-ventas-js.vercel.app/tipoVenta");
  let totalEfectivo = tipoVta.data[0].total;
  let totalClientes = tipoVta.data[1].total;
  total = totalEfectivo + totalClientes;

  document.getElementById(
    "modalVtaTotalesBody"
  ).innerHTML = `<table id="table" class="table table-dark table-borderless">
            <thead>
              <tr>
                <th scope="col">TIPO</th>
                <th scope="col">TOTAL</th>
              </tr>
            </thead>
            <tbody id="tableVtaTotales">
              <tr>
                <td scope="col">SUMA TOTAL</td>
                <td scope="col">${total}</td>
              </tr>
            </tbody>
            <hr>
      </table>`;
  for (item of tipoVta.data) {
    document.getElementById("tableVtaTotales").innerHTML += `
              <tr>
                <td scope="col">${item.tipo}</td>
                <td scope="col">${item.total}</td>
              </tr>`;
  }
}
