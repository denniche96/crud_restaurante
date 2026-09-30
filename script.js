// Recuperamos los platos guardados anteriormente.
// Si no existe ninguno, comenzamos con un arreglo vacío.

let platos = JSON.parse(localStorage.getItem("platos")) || [];

// Variable que indica si estamos editando.
// null significa que estamos creando un plato nuevo.

let idEditando = null;

// Cuando se abre la página mostramos los platos guardados.

mostrarPlatos();


// =========================================
// VALIDAR FORMULARIO
// =========================================

function validarFormulario() {

    let valido = true;

    const nombre = document.getElementById("nombre").value.trim();
    const categoria = document.getElementById("categoria").value;
    const precio = document.getElementById("precio").value;
    const stock = document.getElementById("stock").value;

    // Limpiamos errores anteriores

    document.getElementById("errorNombre").textContent = "";
    document.getElementById("errorCategoria").textContent = "";
    document.getElementById("errorPrecio").textContent = "";
    document.getElementById("errorStock").textContent = "";

    // VALIDACIÓN DEL NOMBRE

    if (nombre === "") {

        document.getElementById("errorNombre").textContent =
            "El nombre del plato es obligatorio.";

        valido = false;

    } else if (nombre.length < 3) {

        document.getElementById("errorNombre").textContent =
            "El nombre debe tener mínimo 3 caracteres.";

        valido = false;

    }

    // VALIDAR NOMBRE DUPLICADO

    const duplicado = platos.some(plato =>
        plato.nombre.toLowerCase() === nombre.toLowerCase()
        &&
        plato.id !== idEditando
    );

    if (duplicado) {

        document.getElementById("errorNombre").textContent =
            "Este plato ya se encuentra registrado.";

        valido = false;
    }

    // VALIDAR CATEGORÍA

    if (categoria === "") {

        document.getElementById("errorCategoria").textContent =
            "Debe seleccionar una categoría.";

        valido = false;
    }

    // VALIDAR PRECIO

    if (precio === "") {

        document.getElementById("errorPrecio").textContent =
            "El precio es obligatorio.";

        valido = false;

    } else if (Number(precio) <= 0) {

        document.getElementById("errorPrecio").textContent =
            "El precio debe ser mayor a 0.";

        valido = false;
    }

    // VALIDAR STOCK

    if (stock === "") {

        document.getElementById("errorStock").textContent =
            "El stock es obligatorio.";

        valido = false;

    } else if (Number(stock) < 0) {

        document.getElementById("errorStock").textContent =
            "El stock no puede ser negativo.";

        valido = false;

    } else if (!Number.isInteger(Number(stock))) {

        document.getElementById("errorStock").textContent =
            "El stock debe ser un número entero.";

        valido = false;
    }

    return valido;
}


// =========================================
// CREATE / UPDATE
// =========================================

function guardarPlato() {

    // Primero realizamos las validaciones

    if (!validarFormulario()) {
        return;
    }

    const nombre =
        document.getElementById("nombre").value.trim();

    const categoria =
        document.getElementById("categoria").value;

    const precio =
        Number(document.getElementById("precio").value);

    const stock =
        Number(document.getElementById("stock").value);

    // =================================
    // CREATE
    // =================================

    if (idEditando === null) {

        const nuevoPlato = {

            id: generarId(),
            nombre: nombre,
            categoria: categoria,
            precio: precio,
            stock: stock

        };

        platos.push(nuevoPlato);

        alert("Plato registrado correctamente.");

    }

    // =================================
    // UPDATE
    // =================================

    else {

        const posicion = platos.findIndex(
            plato => plato.id === idEditando
        );

        platos[posicion].nombre = nombre;
        platos[posicion].categoria = categoria;
        platos[posicion].precio = precio;
        platos[posicion].stock = stock;

        alert("Plato actualizado correctamente.");

        idEditando = null;
    }

    guardarLocalStorage();

    limpiarFormulario();

    mostrarPlatos();
}


// =========================================
// READ
// =========================================

function mostrarPlatos() {

    const tabla =
        document.getElementById("tablaPlatos");

    tabla.innerHTML = "";

    if (platos.length === 0) {

        tabla.innerHTML = `
            <tr>
                <td colspan="6">
                    No existen platos registrados.
                </td>
            </tr>
        `;

        return;
    }

    platos.forEach(plato => {

        tabla.innerHTML += `

            <tr>

                <td>${plato.id}</td>

                <td>${plato.nombre}</td>

                <td>${plato.categoria}</td>

                <td>$${plato.precio.toFixed(2)}</td>

                <td>${plato.stock}</td>

                <td>

                    <button
                        class="btnEditar"
                        onclick="editarPlato(${plato.id})"
                    >
                        Editar
                    </button>

                    <button
                        class="btnEliminar"
                        onclick="eliminarPlato(${plato.id})"
                    >
                        Eliminar
                    </button>

                </td>

            </tr>

        `;

    });

}


// =========================================
// CARGAR DATOS PARA EDITAR
// =========================================

function editarPlato(id) {

    const plato = platos.find(
        plato => plato.id === id
    );

    document.getElementById("nombre").value =
        plato.nombre;

    document.getElementById("categoria").value =
        plato.categoria;

    document.getElementById("precio").value =
        plato.precio;

    document.getElementById("stock").value =
        plato.stock;

    idEditando = id;

    document.getElementById("tituloFormulario").textContent =
        "Editar plato";

    document.getElementById("btnGuardar").textContent =
        "Actualizar";

    document.getElementById("btnCancelar").style.display =
        "inline-block";

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


// =========================================
// DELETE
// =========================================

function eliminarPlato(id) {

    const plato = platos.find(
        plato => plato.id === id
    );

    const confirmar = confirm(
        `¿Está seguro de eliminar "${plato.nombre}"?`
    );

    if (!confirmar) {
        return;
    }

    platos = platos.filter(
        plato => plato.id !== id
    );

    guardarLocalStorage();

    mostrarPlatos();

    alert("Plato eliminado correctamente.");
}


// =========================================
// CANCELAR EDICIÓN
// =========================================

function cancelarEdicion() {

    idEditando = null;

    limpiarFormulario();

}


// =========================================
// LIMPIAR FORMULARIO
// =========================================

function limpiarFormulario() {

    document.getElementById("nombre").value = "";
    document.getElementById("categoria").value = "";
    document.getElementById("precio").value = "";
    document.getElementById("stock").value = "";

    document.getElementById("errorNombre").textContent = "";
    document.getElementById("errorCategoria").textContent = "";
    document.getElementById("errorPrecio").textContent = "";
    document.getElementById("errorStock").textContent = "";

    document.getElementById("tituloFormulario").textContent =
        "Registrar plato";

    document.getElementById("btnGuardar").textContent =
        "Guardar";

    document.getElementById("btnCancelar").style.display =
        "none";
}


// =========================================
// GUARDAR EN LOCALSTORAGE
// =========================================

function guardarLocalStorage() {

    localStorage.setItem(
        "platos",
        JSON.stringify(platos)
    );

}


// =========================================
// GENERAR ID AUTOMÁTICO
// =========================================

function generarId() {

    if (platos.length === 0) {
        return 1;
    }

    const ids = platos.map(plato => plato.id);

    return Math.max(...ids) + 1;
}
