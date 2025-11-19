//Variables Globales//
let text1="";
let textSinEspacio="";
let contadorSignos= 0;


function entradaTexto(){
    // *** CÓDIGO CORREGIDO: Usamos .innerHTML para obtener el contenido del DIV ***
    let textoEntrada = document.getElementById("campoTex").innerHTML;
    
    text1= textoEntrada;
    console.log("Contenido HTML capturado:", text1);
    
    // El resto de tu innerHTML está bien, ya que usa la variable text1 que ya tiene un valor válido
    document.getElementById('salidaConsola').innerHTML = `
    <p>El enunciado es: ${text1}</p>
    <p>Numero de Palabras: ${contarPalabrasConFor(text1)}</p>
    <p>Numeros de Signos: ${contarPuntuacionEspecifica(text1)}</p>
    <p>Numero de Vocales: ${contarVocales(text1)}</p>
    <p>Numero de Consonantes: ${contarConsonantes(text1)}</p>
    <p>Cantidad de numeros: ${contarDigitos(text1)}</p>
    <p>Cantidad de Mayusculas al Inicio de Cada Palabra: ${contarMayusculasIniciales(text1)}</p>
    <p>Cantidad de Minusculas al Inicio de cada Palabra: ${contarMinusculasIniciales(text1)}</p>
    <p>Numero de Parrafos: ${contarParrafos(text1)}</p>
    <p>Texto Invertido: ${invertirTexto(text1)}</p>
    <p>Numeros de caracteres: ${(eliminarEspacios(text1)).length}</p>
    <p>Numero de caracteres en Posicion Pares: ${contarCaracteresPares(text1)}</p>
    <p>Numero de caracteres en Posicion Impares: ${contarCaracteresImpares(text1)}</p>

    <P>Enunciado sin espacio: ${eliminarEspacios(text1)}</P>
    <p>Palabra a buscar: ${buscarPalabraManual(text1)}</p>
    <p>${contarCaracterEspecifico(text1)}</p>
    <p>Frase Añadida Inicio-Final: ${concatenarInicioYFin(text1)}</p>
    <p></p>
    <p></p>
    `;
}


function lineaActualNumero() {
    // La variable 'textarea' debe ser encontrada globalmente o pasada como argumento
    const editorElement = document.getElementById("campoTex"); 
    const lineaNumeroDiv = document.getElementById("lineaNumero");
    
    // Usa .innerText para contar líneas si estás usando un DIV contenteditable
    const lines = editorElement.innerText.split('\n').length; 
    
    // Generamos el HTML para el div de números (1, 2, 3, etc.)
    let numbersHtml = '';
    for (let i = 1; i <= lines; i++) {
        numbersHtml += `<div>${i}</div>`;
    }
    lineaNumeroDiv.innerHTML = numbersHtml;
}



// Función para sincronizar el scroll vertical
function sincronizacionMouse() {
    // La variable 'textarea' debe ser encontrada globalmente o pasada como argumento
    const editorElement = document.getElementById("campoTex");
    const lineaNumeroDiv = document.getElementById("lineaNumero");
    // Sincroniza la posición de scroll del div con la del div editable
    lineaNumeroDiv.scrollTop = editorElement.scrollTop; 
}

// Llama a la función al cargar la página por primera vez
document.addEventListener('DOMContentLoaded', (event) => {
    // Todo el código que interactúa con elementos HTML al cargar la página va aquí dentro.

    // Usamos un nombre consistente para el elemento principal
    const editorElement = document.getElementById("campoTex"); 
    
    // Funcionalidad de manejo del foco para los botones de formato
    const formatButtons = document.querySelectorAll('.format-buttons button');

    // Funcionalidad de números de línea y scroll
    lineaActualNumero(); // Esta función ahora usa 'editorElement' internamente
    
    // Usa 'input' para capturar cambios en el div editable
    editorElement.addEventListener('input', lineaActualNumero); 
    editorElement.addEventListener('scroll', sincronizacionMouse);

    
    formatButtons.forEach(button => {
        button.addEventListener('mousedown', (e) => {
            // Esto es vital: previene que el click en el botón quite el foco del editor.
            e.preventDefault(); 
        });
    });
    
    // (Opcional) Puedes añadir otros listeners aquí
});

////////////////////////////////////////////////////////////////////////////////////////////////
/////Funciones Para el Editor////////////


////////ELIMINAR ESPACIOS DEL ENUNCIADO////////
function eliminarEspacios(texto) {
    textSinEspacio= "";

    // Iteramos sobre cada carácter del texto original
    for (let i = 0; i < texto.length; i++) {
        let caracterActual = texto[i];

        // Si el carácter actual NO es un espacio (' '), lo añadimos al nuevo texto
        if (caracterActual !== ' ' && caracterActual !== '\n' && caracterActual !== '\t') {
            textSinEspacio += caracterActual;
        }
        // Si es un espacio, simplemente lo ignoramos y el bucle pasa al siguiente carácter
    }
    return textSinEspacio;
}

///////CONTAR SIGNOS DE PUNTUCACION//////////
function contarPuntuacionEspecifica(texto) {
    contadorSignos = 0;
    // Define los caracteres específicos que quieres contar
    const caracteresBuscados = ".,;:!?¿¡\""; 
    // Nota: La comilla doble al final está escapada con barra invertida (\")

    // Iteramos sobre cada carácter del texto de entrada
    for (let i = 0; i < texto.length; i++) {
        const caracterActual = texto[i];

        // Verificamos si el carácter actual está incluido en nuestra lista de caracteres buscados
        if (caracteresBuscados.includes(caracterActual)) {
            contadorSignos++;
        }
    }
    return contadorSignos;
}


////////CONTAR CADA PALABRA///////////
function contarPalabrasConFor(texto) {
    // Usamos .trim() para limpiar espacios al inicio y al final
    let textoLimpio = texto.trim();
    let numeroDePalabras = 0;

    // Si el texto está vacío después del trim, retornamos 0
    if (textoLimpio === "") {
        return 0;
    }

    // Bandera para saber si estamos actualmente dentro de una palabra o no
    let enPalabra = false;

    // Iteramos sobre cada carácter del texto limpio
    for (let i = 0; i < textoLimpio.length; i++) {
        let caracterActual = textoLimpio[i];

        // Definimos qué caracteres son delimitadores de palabra (espacio, salto de línea, tabulación)
        // La expresión regular /\s/ busca cualquier tipo de espacio
        let esDelimitador = /\s/.test(caracterActual);

        if (!esDelimitador) {
            // Si el carácter NO es un espacio, estamos DENTRO de una palabra.
            // Si es la primera vez que entramos en una palabra (la bandera estaba en falso),
            // significa que hemos encontrado el inicio de una NUEVA palabra, así que la contamos.
            if (!enPalabra) {
                numeroDePalabras++;
                enPalabra = true; // Actualizamos la bandera a verdadero
            }
        } else {
            // Si el carácter ES un espacio o salto de línea, hemos salido de la palabra.
            enPalabra = false; // Actualizamos la bandera a falso
        }
    }
    return numeroDePalabras;
}


/////CONTADOR DE VOCALES//////
function contarVocales(texto) {
    let contadorVocales = 0;
    // Definimos una cadena que contenga todas las vocales posibles para una fácil comparación
    let vocalesPermitidas = "aeiouAEIOU";

    // Iteramos sobre cada carácter del texto de entrada
    for (let i = 0; i < texto.length; i++) {
        let caracterActual = texto[i];

        // Verificamos si el carácter actual está incluido en nuestra lista de vocales permitidas.
        if (vocalesPermitidas.includes(caracterActual)) {
            contadorVocales++;
        }
    }
    return contadorVocales;
}


////CONTADOR DE CONSONANTES/////////
function contarConsonantes(texto) {
    let contadorConsonantes = 0;
    let vocales = "aeiouáéíóú";
    // Una lista completa de todas las letras del alfabeto para verificar si el carácter es una letra válida
    let alfabeto = "abcdefghijklmnopqrstuvwxyzáéíóúñ"; 

    // Iteramos sobre cada carácter del texto de entrada
    for (let i = 0; i < texto.length; i++) {
        let caracterActual = texto[i];
        
        // Paso 1: Convertir el carácter actual a minúsculas para hacer una sola comparación
        let caracterMinuscula = caracterActual.toLowerCase();

        // Paso 2: Verificar si el carácter es una letra del alfabeto usando .includes()
        // (Reemplaza la lógica que hacía el .test())
        let esLetraAlfabetica = alfabeto.includes(caracterMinuscula);

        if (esLetraAlfabetica) {
            // Paso 3: Si es una letra, verificar si NO está incluida en la lista de vocales.
            if (!vocales.includes(caracterMinuscula)) {
                // Es una letra Y no es vocal, por lo tanto, es una consonante.
                contadorConsonantes++;
            }
        }
        // Si no es una letra alfabética (es un número, espacio, símbolo, etc.), simplemente se ignora.
    }
    return contadorConsonantes;
}

/////Contar Numeros #5 /////////
function contarDigitos(texto) {
    let contadorDigitos = 0;
    
    // comparamos sobre cada carácter del texto de entrada
    for (let i = 0; i < texto.length; i++) {
        let caracterActual = texto[i];
        // --- Lógica solo con if y comparaciones directas ---
        
        // Verificamos si el carácter actual es mayor o igual que '0' Y menor o igual que '9'.
        // JavaScript puede comparar caracteres de esta manera porque están ordenados secuencialmente.
        if (caracterActual >= '0' && caracterActual <= '9') {
            contadorDigitos++;
        }
        // --- Fin de la lógica ---
    }
    return contadorDigitos;
}


///////Contar sola la Primera Mayuscula #6///////////
function contarMayusculasIniciales(texto) {
    let textoLimpio = texto.trim();
    let contadorMayusculas = 0;

    if (textoLimpio === "") {
        return 0;
    }
    // Iteramos sobre cada carácter del texto
    for (let i = 0; i < textoLimpio.length; i++) {
        let caracterActual = textoLimpio[i];

        // Verificamos si el carácter actual es mayúscula
        let esMayuscula = (caracterActual >= 'A' && caracterActual <= 'Z');

        // Lógica clave: ¿Es el primer carácter del texto O el carácter anterior era un espacio?
        let esInicioDeTexto = (i === 0);
        let anteriorEraEspacio = (i > 0 && (textoLimpio[i - 1] === ' ' || textoLimpio[i - 1] === '\n' || textoLimpio[i - 1] === '\t'));

        if (esMayuscula && (esInicioDeTexto || anteriorEraEspacio)) {
            // Si es mayúscula Y es el inicio de una palabra (inicio del texto o después de un espacio), lo contamos.
            contadorMayusculas++;
        }
    }
    return contadorMayusculas;
}

///////Contar solo Inicio de Minusculas #7//////
function contarMinusculasIniciales(texto) {
    let textoLimpio = texto.trim();
    let contadorMinusculas = 0;

    if (textoLimpio === "") {
        return 0;
    }

    // Iteramos sobre cada carácter del texto
    for (let i = 0; i < textoLimpio.length; i++) {
        let caracterActual = textoLimpio[i];

        // Verificamos si el carácter actual es minúscula
        // Usamos la comparación de rango: de 'a' a 'z'
        let esMinuscula = (caracterActual >= 'a' && caracterActual <= 'z');

        // Lógica clave: ¿Es el primer carácter del texto O el carácter anterior era un espacio?
        let esInicioDeTexto = (i === 0);
        // Comprobación manual de delimitadores (espacio, salto de línea, tabulación)
        let anteriorEraEspacio = (i > 0 && (textoLimpio[i - 1] === ' ' || textoLimpio[i - 1] === '\n' || textoLimpio[i - 1] === '\t'));

        if (esMinuscula && (esInicioDeTexto || anteriorEraEspacio)) {
            // Si es minúscula Y es el inicio de una palabra (inicio del texto o después de un espacio), lo contamos.
            contadorMinusculas++;
        }
    }
    return contadorMinusculas;
}

///////Contar Espacios (/n) #8//////////
function contarParrafos(texto) {
    // Usamos trim() para ignorar espacios y saltos de línea iniciales/finales accidentales.
    let textoLimpio = texto.trim();
    let contadorParrafos = 0;

    if (textoLimpio === "") {
        return 0;
    }

    // Iteramos sobre cada carácter del texto limpio para encontrar saltos de línea
    for (let i = 0; i < textoLimpio.length; i++) {
        let caracterActual = textoLimpio[i];

        if (caracterActual === '\n') {
            // Cada vez que encontramos un salto de línea, significa que un párrafo acaba de terminar.
            contadorParrafos++;
        }
    }

    // Lógica importante: Si el texto no termina con un salto de línea explícito,
    // el último bloque de texto sigue siendo un párrafo que debe contarse.
    // Como ya contamos los saltos de línea intermedios, sumamos 1 al final.
    // Esto funciona porque ya verificamos que el texto no esté vacío al inicio.
    
    // Incrementamos el contador en 1 para incluir el último párrafo.
    contadorParrafos++;

    return contadorParrafos;
}

///////Invertir mi texto #9///////////////
function invertirTexto(texto) {
    let textoInvertido = "";
    // Obtenemos la longitud del texto
    let longitud = texto.length;

    // Iteramos desde el último índice del texto (longitud - 1) hasta el primer índice (0)
    for (let i = longitud - 1; i >= 0; i--) {
        // En cada iteración, tomamos el carácter actual y lo añadimos al final del nuevo texto invertido
        textoInvertido += texto[i];
    }

    return textoInvertido;
}


///////////Buscar Palabra #11///////////////
function buscarPalabraManual(texto) {
    // 1. Pedir al usuario la palabra a buscar mediante un prompt
    let palabraBuscada = prompt("Ingrese la palabra que desea buscar en el texto:");

    // Limpiamos la entrada y la palabra buscada a minúsculas para una búsqueda que no distinga mayúsculas/minúsculas
    let textoMin = texto.toLowerCase();
    let palabraMin = palabraBuscada.toLowerCase();

    // Verificaciones básicas
    if (palabraMin === "" || textoMin === "") {
        return "No se pudo realizar la búsqueda. Asegúrate de ingresar texto en ambos campos.";
    }

    let encontrada = false;

    // 2. Iterar sobre el texto principal
    for (let i = 0; i <= textoMin.length - palabraMin.length; i++) {
        let coincidenciaActual = true;

        // 3. Iterar sobre la palabra buscada para comparar caracteres
        for (let j = 0; j < palabraMin.length; j++) {
            // Comparamos el carácter actual del texto principal (i + j) con el carácter de la palabra buscada (j)
            if (textoMin[i + j] !== palabraMin[j]) {
                coincidenciaActual = false;
                // Si un carácter no coincide, salimos del bucle interno y pasamos a la siguiente posición en el texto principal
                break; 
            }
        }

        // 4. Si el bucle interno terminó sin romper, significa que encontramos una coincidencia completa
        if (coincidenciaActual) {
            encontrada = true;
            // Si la encontramos, podemos salir del bucle principal también
            break; 
        }
    }
    // 5. Devolver el mensaje de resultado
    if (encontrada) {
        return `La palabra '${palabraBuscada}' SÍ se encuentra en el texto.`;
    } else {
        return `La palabra '${palabraBuscada}' NO se encuentra en el texto.`;
    }
}

/////////////////////
function contarCaracterEspecifico(texto) {
    // 1. Pedir al usuario el carácter a buscar mediante un prompt
    let caracterBuscado = prompt("Ingrese el carácter que desea contar en el texto (solo la primera letra será usada):");

    // Limpiamos la entrada del prompt para asegurarnos de que solo usamos el primer carácter válido.
    if (!caracterBuscado || caracterBuscado.length === 0) {
        return "No se ingresó un carácter válido para buscar.";
    }
    
    // Tomamos solo el primer carácter ingresado y lo ponemos en minúscula para la comparación
    let caracterMin = caracterBuscado[0].toLowerCase();
    let textoMin = texto.toLowerCase();
    let contador = 0;

    // 2. Iterar sobre el texto principal
    for (let i = 0; i < textoMin.length; i++) {
        let caracterActual = textoMin[i];

        // 3. Comparar el carácter actual del texto con el carácter buscado
        if (caracterActual === caracterMin) {
            contador++;
        }
    }

    // 4. Devolver el mensaje de resultado
    return `El carácter '${caracterBuscado[0]}' aparece ${contador} veces en el texto.`;
}

////////Contar Caracteres en Posiciones Pares////////////
function contarCaracteresPares(texto) {
    let contadorPares = 0;
    let longitud = texto.length;

    // Iteramos sobre el texto. No necesitamos comprobar el carácter actual,
    // solo necesitamos saber que la posición (i) existe.
    for (let i = 0; i < longitud; i++) {
        // La condición clave es verificar si el índice actual (i) es par.
        // El operador `%` (módulo) devuelve el resto de una división.
        // Si i % 2 es 0, significa que el número es par.
        if (i % 2 === 0) {
            contadorPares++;
        }
        
        // Alternativamente, se podría incrementar 'i' de dos en dos en el bucle for:
        // for (let i = 0; i < longitud; i += 2) { contadorPares++; }
        // Pero la verificación con el módulo dentro del bucle de uno en uno es más clara para este ejemplo.
    }

    return contadorPares;
}

/////////Contar Caracteres en Posiciones Impares//////////////
function contarCaracteresImpares(texto) {
    let contadorImpares = 0;
    let longitud = texto.length;

    // Iteramos sobre el texto. 
    for (let i = 0; i < longitud; i++) {
        // La condición clave es verificar si el índice actual (i) es impar.
        // El operador `%` (módulo) devuelve el resto de una división.
        // Si i % 2 es diferente de 0 (es decir, 1), significa que el número es impar.
        if (i % 2 !== 0) { // O también puedes usar if (i % 2 === 1)
            contadorImpares++;
        }
    }
    return contadorImpares;
}
///////////////////////////////
function concatenarInicioYFin(texto) {
    let fragmentoAnadir = prompt("Ingrese el texto o fragmento que desea añadir al inicio Y al final:");

    if (fragmentoAnadir === null || fragmentoAnadir.trim() === "") {
        // Si el usuario cancela o no escribe nada, usamos un valor por defecto.
        fragmentoAnadir = "[Fragmento]";
    }

    // Concatenamos todo en una sola línea y lo guardamos en una sola variable `textoFinal`
    // Formato: [Fragmento] [Texto Original] [Fragmento]
    let textoFinal = fragmentoAnadir + " " + texto + " " + fragmentoAnadir;

    // Devolvemos la cadena de texto final directamente
    return textoFinal;
}



////////Funciones de Botones del Editor Texto//////////
function formatText(command) {
    // 'command' es el string que pasas desde HTML, ej: 'bold', 'justifyCenter'
    document.execCommand(command, false, null);
    document.getElementById("campoTex").focus();
}

function copySelectedText() {
    document.execCommand('copy');
    document.getElementById("campoTex").focus();
}

function pasteSelectedText() {
    document.execCommand('paste');
    document.getElementById("campoTex").focus();
}




console.log(`Hola javaScript ${text1}`)