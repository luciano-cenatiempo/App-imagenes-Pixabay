const $resultado = document.querySelector('#resultado');
const $formulario = document.querySelector('#formulario');
const $paginacionDiv = document.querySelector('#paginacion');
const $spinner = document.querySelector('.spinner-div');
const $btnTop = document.querySelector('#btn-top');

const registrosPorPagina = 40;
let totalPaginas;
let iterador
let paginaActual = 1;


window.onload = () => {

    $formulario.addEventListener('submit', validarFormulario);
    window.addEventListener('scroll', alternarBtnTop);
    $btnTop.addEventListener('click', () => scrollTo(top));
}

function validarFormulario(e) {
    e.preventDefault();

    const terminoBusqueda = document.querySelector('#termino').value;

    if (terminoBusqueda === '') {
        mostrarAlerta('Agrega termino de busqueda');
        return
    }
    paginaActual = 1;

    buscarImagenes();
}

function mostrarAlerta(mensaje) {
    const existeAlerta = document.querySelector('.alerta');
    if (!existeAlerta) {
        const alerta = document.createElement('p');
        alerta.classList.add('bg-red-700', 'border-red-400', 'text-red-200', 'px-4', 'py-3', 'rounded', 'max-w-lg', 'mx-auto', 'mt-6', 'text-center', 'alerta');

        alerta.innerHTML = `
        <strong class = "font-bold">Error!</strong>
        <span class="block sm:inline"> ${mensaje}</span>
        `;

        $formulario.appendChild(alerta);

        setTimeout(() => {
            alerta.remove();
        }, 3000)
    }

}

function buscarImagenes() {
    while ($resultado.firstChild) {
        resultado.removeChild($resultado.firstChild);
    }
    while ($paginacionDiv.firstChild) {
        $paginacionDiv.removeChild($paginacionDiv.firstChild);
    }
    if ($spinner.classList.contains('invisible')) {
        $spinner.classList.remove('invisible');
    }
    const termino = document.querySelector('#termino').value;

    const key = '22366091-a07289f344ac46e3342799ad2';
    const url = `https://pixabay.com/api/?key=${key}&q=${termino}&per_page=${registrosPorPagina}&page=${paginaActual}`;

    fetch(url)
        .then(respuesta => respuesta.json())
        .then(resultado => {
            totalPaginas = calcularPaginas(resultado.totalHits);
            mostrarImagenes(resultado.hits);
            $spinner.classList.add('invisible');

        })
}

// Generador que va a registrar la cantidad de elementos de acuerdo a las paginas
function* crearPaginador(total) {
    for (let i = 1; i <= total; i++) {
        yield i;
    }
}

function calcularPaginas(total) {
    return parseInt(Math.ceil(total / registrosPorPagina))
}

function mostrarImagenes(imagenes) {
    while ($resultado.firstChild) {
        $resultado.removeChild($resultado.firstChild);
    }
    if (imagenes.length === 0) {
        mostrarAlerta('No hay resultados para su busqueda, pruebe con otra')

    }

    // construye el HTML con imágenes
    imagenes.forEach(imagen => {
        const { previewURL, likes, views, largeImageURL } = imagen;
        $resultado.innerHTML += `
            <div class = "w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-3 mb-4">
                <div class ="card-img p-2 rounded">
                    <img class="w-full h-48 object-contain" src="${previewURL}">
                    <div class="p-4">
                        <p class="font-bold text-white">${likes}<span class="font-light"> Me gusta </span></p>
                        <p class="font-bold text-white">${views}<span class="font-light"> Veces vista </span></p>
                        <a class =" block w-full bg-blue-800 hover:bg-blue-500 text-center text-white rounded mt-5 p-1" href="${largeImageURL}" target="_blank"> Ver Imagen </a>
                    </div>
                </div>
            </div>
        `
    });

    imprimirPaginador();

}

function imprimirPaginador() {
    // Manda a llamar al iterador
    iterador = crearPaginador(totalPaginas)
    while (true) {
        const { value, done } = iterador.next();
        if (done) return;
        const boton = document.createElement('a');
        boton.dataset.pagina = value;
        boton.textContent = value;
        boton.classList.add('siguiente', 'bg-yellow-400', 'px-4', 'py-1', 'mr-2', 'font-bold', 'mb-4', 'rounded', 'cursor-pointer');

        if (boton.textContent == paginaActual) {
            boton.classList.remove('bg-yellow-400')
            boton.classList.add('bg-red-400', 'desactivado')
        }
        boton.onclick = () => {
            paginaActual = value;
            buscarImagenes();
            window.scrollTo(top)
        }

        $paginacionDiv.appendChild(boton);
    }
}

function alternarBtnTop() {
    let distanciaScroll = scrollY;
    if (distanciaScroll > 0) {
        if ($btnTop.classList.contains('invisible')) {
            $btnTop.classList.remove('invisible');
        }
    } else {
        if (!$btnTop.classList.contains('invisible')) {
            $btnTop.classList.add('invisible');

        }
    }
}
