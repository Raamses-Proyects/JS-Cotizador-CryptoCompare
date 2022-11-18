// Variables
const selectMoneda = document.querySelector('#moneda');
const selectCriptomonedas = document.querySelector('#criptomoneda');
const formulario = document.querySelector('#formulario');
const cotizacion = document.querySelector('.cotizacion');
const datos = {
    moneda: '',
    criptomoneda: ''
}


// Eventos
document.addEventListener('DOMContentLoaded', () => {
    obtenerCrioptomonedasAPI();
    selectMoneda.addEventListener('change', llenarObjeto);
    selectCriptomonedas.addEventListener('change', llenarObjeto);
    formulario.addEventListener('submit', validarDatos);
});


// Funciones
function obtenerCrioptomonedasAPI() {
    const url = `https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD`;
    fetch(url)
        .then( respuesta => respuesta.json() )
        .then( criptomonedas => llenarSelectCriptomonedas(criptomonedas.Data) )
        .catch( error => console.log(error) )
}
function llenarSelectCriptomonedas(criptomonedas) {
    criptomonedas.forEach(dato => {
        const { FullName, Name } = dato.CoinInfo;
        const option = document.createElement('option');
        option.value = Name;
        option.textContent = FullName;
        selectCriptomonedas.appendChild(option);
    });
}
function validarDatos(e) {
    e.preventDefault();

    if( Object.values(datos).includes('') ) {
        alerta('Todos los campos tiene que estar llenos');
        return;
    }
    consultarAPI();
}
function consultarAPI() {
    const { moneda, criptomoneda } = datos;
    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;

    spinner();

    fetch(url)
    .then( respuesta => respuesta.json() )
    .then( datosAPI => cotizacionHTML(datosAPI.DISPLAY[criptomoneda][moneda]) )
    .catch( error => console.error(error) )
}
function cotizacionHTML(datosAPI) {
    limpiarHTML();
    const { PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE, FROMSYMBOL } = datosAPI;

    const symbol = document.createElement('p');
    symbol.classList.add('cotizacion__symbol');
    symbol.textContent = FROMSYMBOL;

    const precio = document.createElement('p');
    precio.classList.add('cotizacion__precio');
    precio.textContent = 'Precio: ';
    const precioSpan = document.createElement('span');
    precioSpan.classList.add('cotizacion__span');
    precioSpan.textContent = PRICE;
    precio.appendChild(precioSpan);

    const precioAlto = document.createElement('p');
    precioAlto.innerHTML = `
    <p class="cotizacion__texto">El precio mas alto del día: 
        <span class="cotizacion__span">${HIGHDAY}</span> 
    </p>`;

    const precioBajo = document.createElement('p');
    precioBajo.innerHTML = `
    <p class="cotizacion__texto">El precio mas bajo del día: 
        <span class="cotizacion__span">${LOWDAY}</span> 
    </p>`;

    const ultimas24hrs = document.createElement('p');
    ultimas24hrs.innerHTML = `
    <p class="cotizacion__texto">Variación de las últimas 24hrs:
        <span class="cotizacion__span">%${CHANGEPCT24HOUR}</span> 
    </p>`;

    const ultimaActualizacion = document.createElement('p');
    ultimaActualizacion.innerHTML = `
    <p class="cotizacion__texto">Ultima actualización::
        <span class="cotizacion__span">${LASTUPDATE}</span> 
    </p>`;

    // Agregando al HTML
    cotizacion.appendChild(symbol);
    cotizacion.appendChild(precio);
    cotizacion.appendChild(precioAlto);
    cotizacion.appendChild(precioBajo);
    cotizacion.appendChild(ultimas24hrs);
    cotizacion.appendChild(ultimaActualizacion);
}



// Helpers
function llenarObjeto(e) {
    datos[e.target.name] = e.target.value;
}
function alerta(mensaje) {
    const existe = document.querySelectorAll('.alerta');
    if(existe.length === 0) {
        const contenedorAlerta = document.createElement('div');
        contenedorAlerta.classList.add('alerta');
        const texto = document.createElement('p');
        texto.classList.add('alerta__texto');
        texto.textContent = mensaje;
        contenedorAlerta.appendChild(texto);
        contenedorAlerta.classList.add('error');

        // Agregando al HTML
        formulario.appendChild(contenedorAlerta);
        
        // Eliminando
        setTimeout(() => {
            contenedorAlerta.remove();
        }, 3000);
    }
}
function limpiarHTML() {
    while(cotizacion.firstChild) {
        cotizacion.removeChild(cotizacion.firstChild);
    }
}
function spinner() {
    limpiarHTML();
    const spinner = document.createElement('div');
    spinner.classList.add('sk-folding-cube');
    spinner.innerHTML = `
        <div class="sk-cube1 sk-cube"></div>
        <div class="sk-cube2 sk-cube"></div>
        <div class="sk-cube4 sk-cube"></div>
        <div class="sk-cube3 sk-cube"></div>
    `;
    cotizacion.appendChild(spinner);
}