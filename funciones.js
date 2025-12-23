
// Libro a números
function obtenerClaveLibro(libro) {
    // Quitar caracteres sobrantes y normalizar espacios
    libro = libro.replace(/[^0-9 ,]/g, '').trim();

    // Separar por espacio o coma
    let grupos = libro.split(/[\s,]+/);

    // Convertir a números (filtrando vacíos)
    let numeros = grupos.filter(x => x.length > 0).map(x => parseInt(x));

    return numeros; // Ej: [123, 45, 6789]
}



// Fuerza de la clave
function calidadClaveLibro(libro) {
    const numeros = obtenerClaveLibro(libro);

    if (numeros.length === 0) return "";

    const unicos = new Set(numeros).size;

    if (numeros.length < 3) {
        return "Calidad de clave: Débil (muy corta)";
    }

    if (numeros.length < 6 || unicos === 1) {
        return "Calidad de clave: Media (poca variación)";
    }

    return "Calidad de clave: Fuerte";
}

// Actualizar calidad de clave al cambiar el libro
document.getElementById("libro").addEventListener("input", function () {
    const calidad = calidadClaveLibro(this.value);
    document.getElementById("calidadClave").textContent = calidad;
});



// Cifrar
function cifrarMensaje(libro, mensaje) {

    let claveNumeros = obtenerClaveLibro(libro);

    if (claveNumeros.length === 0) return "";

    let mensajeCifrado = '';
    let indiceClave = 0;

    for (let i = 0; i < mensaje.length; i++) {
        let char = mensaje[i];

        // Si NO es letra → se deja igual
        if (!/[a-zA-Z]/.test(char)) {
            mensajeCifrado += char;
            continue;
        }

        let letra = char.toLowerCase();

        // Número completo (1, 2, 3, ... cifras)
        let numero = claveNumeros[indiceClave % claveNumeros.length];

        // Convertirlo a desplazamiento válido 0–25
        let claveNum = numero % 26;

        indiceClave++;

        let pos = letra.charCodeAt(0) - 97;
        let nuevaPos = (pos + claveNum) % 26;
        let nuevaLetra = String.fromCharCode(nuevaPos + 97);

        // Mantener mayúsculas
        mensajeCifrado += (char === char.toUpperCase()) ? nuevaLetra.toUpperCase() : nuevaLetra;
    }

    return mensajeCifrado;
}

// Descifrar
function descifrarMensaje(libro, mensaje) {

    let claveNumeros = obtenerClaveLibro(libro);

    if (claveNumeros.length === 0) return "";

    let mensajeDescifrado = '';
    let indiceClave = 0;

    for (let i = 0; i < mensaje.length; i++) {
        let char = mensaje[i];

        if (!/[a-zA-Z]/.test(char)) {
            mensajeDescifrado += char;
            continue;
        }

        let letra = char.toLowerCase();

        let numero = claveNumeros[indiceClave % claveNumeros.length];
        let claveNum = numero % 26;

        indiceClave++;

        let pos = letra.charCodeAt(0) - 97;
        let nuevaPos = (pos - claveNum + 26) % 26;
        let nuevaLetra = String.fromCharCode(nuevaPos + 97);

        mensajeDescifrado += (char === char.toUpperCase()) ? nuevaLetra.toUpperCase() : nuevaLetra;
    }

    return mensajeDescifrado;
}

// Scroll suave
function scrollSuaveHasta(elemento, duracion = 400) {
    const inicio = window.scrollY;
    const destino = elemento.getBoundingClientRect().top + window.scrollY;
    const distancia = destino - inicio;
    let inicioTiempo = null;

    function animar(tiempoActual) {
        if (!inicioTiempo) inicioTiempo = tiempoActual;
        const tiempo = tiempoActual - inicioTiempo;
        const progreso = Math.min(tiempo / duracion, 1);

        // easing ease-in-out
        const ease = progreso < 0.5
            ? 2 * progreso * progreso
            : 1 - Math.pow(-2 * progreso + 2, 2) / 2;

        window.scrollTo(0, inicio + distancia * ease);

        if (tiempo < duracion) {
            requestAnimationFrame(animar);
        }
    }

    requestAnimationFrame(animar);
}



// BOTONES

// Boton Cifrar
document.getElementById("btnCifrar").addEventListener("click", function() {
    let libro = document.getElementById("libro").value;
    let mensaje = document.getElementById("mensaje").value;
    let guardar = document.getElementById("guardarLocal").checked;

    if (!libro || !mensaje) {
        document.getElementById("estado").textContent =
            "Completa todos los campos para continuar.";
        return;
    }

    let cifrado = cifrarMensaje(libro, mensaje);


    document.getElementById("mensajeCifrado").style.display = "block";
    document.getElementById("mensajeCifrado").textContent = cifrado;
    document.getElementById("mensajeDescifrado").textContent = "";
    document.getElementById("estado").textContent =
        "Mensaje cifrado localmente.";


    scrollSuaveHasta(document.getElementById("resultados"), 450);


    if (guardar) {
        guardarDatosLocalmente(libro, mensaje);
    } else {
        borrarDatosLocales();
    }
});

// Boton Descifrar
document.getElementById("btnDescifrar").addEventListener("click", function() {
    let libro = document.getElementById("libro").value;
    let mensaje = document.getElementById("mensaje").value;
    let guardar = document.getElementById("guardarLocal").checked;

    if (!libro || !mensaje) {
        document.getElementById("estado").textContent =
            "Completa todos los campos para continuar.";
        return;
    }

    let descifrado = descifrarMensaje(libro, mensaje);

    document.getElementById("mensajeDescifrado").textContent = descifrado;
    document.getElementById("mensajeCifrado").textContent = "";
    document.getElementById("estado").textContent =
        "Mensaje descifrado localmente.";

    scrollSuaveHasta(document.getElementById("resultados"), 450);


    if (guardar) {
        guardarDatosLocalmente(libro, mensaje);
    } else {
        borrarDatosLocales();
    }
});

// Ocultar ejemplo al cifrar
document.getElementById("btnCifrar").addEventListener("click", function() {
    document.getElementById("ejemploInicial").style.display = "none";
});


// Guardar datos localmente
function guardarDatosLocalmente(libro, mensaje) {
    localStorage.setItem("claveGuardada", libro);
    localStorage.setItem("mensajeGuardado", mensaje);
}

function borrarDatosLocales() {
    localStorage.removeItem("claveGuardada");
    localStorage.removeItem("mensajeGuardado");
}
// Cargar datos guardados al iniciar
window.addEventListener("load", () => {
    const clave = localStorage.getItem("claveGuardada");
    const mensaje = localStorage.getItem("mensajeGuardado");

    if (clave && mensaje) {
        document.getElementById("libro").value = clave;
        document.getElementById("mensaje").value = mensaje;
        document.getElementById("guardarLocal").checked = true;
    }
});
// Guardar o borrar datos al cambiar el checkbox
document.getElementById("guardarLocal").addEventListener("change", function () {
    if (!this.checked) {
        borrarDatosLocales();
        document.getElementById("estado").textContent =
            "Almacenamiento local desactivado. Datos eliminados.";
    }
});


// Copiar texto al portapapeles
function copiarTexto(id) {
    const texto = document.getElementById(id).textContent;

    if (!texto) return;

    navigator.clipboard.writeText(texto)
        .then(() => {
            document.getElementById("estado").textContent =
                "Texto copiado al portapapeles.";
        });
}
