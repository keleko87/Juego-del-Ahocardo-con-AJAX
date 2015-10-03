var longPalabra = 0;       // Numero de letras que tiene la palabra
var letraInsertada = ""; 
var numFallos =0;           
var numAciertos = 0;
var activar = 1;         // Activar la funcion iniciarPartida();

/** Recarga la página para empezar una nueva partida
 * 
 * @returns {undefined}
 */
function cargarNuevaPartida(){
    location.reload();     // Recarga la página para empezar una nueva partida - (Peticion Síncrona)
    activar = 1;
}

/** Funcion para activar y desactivar la funcion iniciarPartida(); 
 *  Controla que si se pulsa por segunda vez el boton 'inicia Partida' no haga una nueva peticion de palabra aleatoria mediante AJAX
 * 
 * @returns {undefined}
 */
function activarIniciarPartida(){
    if(activar==1){          // Si la variable es igual a 1 se activa la función
        iniciarPartida();
        activar=0;           // Desabilitar la funcion poniendo a 0 la variable
    }
}

/** Pide una palabra aleatoria al documento PHP y es devuelta en formato XML
 * 
 * @returns {undefined}
 */
function iniciarPartida(){
        var input = document.getElementById('letra'); 
	input.disabled = false;                          // Habilitar el input para poder escribir 
        input.focus();                                   // Situar el foco en el input
        
	var xmlHttp = new XMLHttpRequest();
	var urlDestino = "ahorcado.php?inicio=si";
	xmlHttp.open("GET", urlDestino, true);
	xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

	xmlHttp.onreadystatechange = function() {
		if (xmlHttp.readyState == 4) {
                    var resp = xmlHttp.responseXML;                      
                    var tagLong= resp.getElementsByTagName('longitud');
                    longPalabra = tagLong[0].firstChild.nodeValue;
                     
                    lineasParaLetras(longPalabra);      // Mostrar lineas para cada una de las letras   
            }
	};
	xmlHttp.send(null);
}



/** Busca coincidendias de la letra introducida en el input, en la palabra almacenada en la variable de sesion
 * 
 * @returns {undefined}
 */
function buscarLetra(){
    inputUnaLetra();   // Controla que NO se introduzca mas de un caracter, mas de una letra
    var letraEnviada = document.getElementById('letra').value;    // Obtener el valor de la letra 
    document.getElementById('letra').value = "";          // Limpiar el input  
    
    var xmlHttp = new XMLHttpRequest();
    var urlDestino = "ahorcado.php?letra="+letraEnviada;
    
    xmlHttp.open("GET", urlDestino, true);
    xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4) {
            var resp = xmlHttp.responseXML;    
            var letras = resp.getElementsByTagName('encontrado');

            for(var i=0; i<letras.length; i++){
                var letraPosicion = letras[i].firstChild.nodeValue;    // Devuelve la posicion o posiciones de esa letra en la palabra

                if(letraPosicion >= 0){                                // Si la posicion es distinta de -1 la letra será correcta
                    document.getElementById('lin'+letraPosicion).innerHTML = letraEnviada;
                    letraInsertada = letraEnviada;
                    mostrarAciertos();
                }else{
                    numFallos++;
                    imagenAhorcado(numFallos);    // Muestra imagen correspondiente al numero fallos que lleve en ese momento
                    mostrarFallos();
                }
            }
        }
    };
    xmlHttp.send(null);
}


/** Crea una linea para cada letra de la palabra y las añade al HTML
 * 
 * @param {type} longPalabra
 * @returns {undefined}
 */
function lineasParaLetras(longPalabra){
    var lineas = new Array();                        // Array para almacenar las lineas para las letras
    for(var i=0; i<longPalabra; i++){
       lineas[i]='<span id="lin'+i+'">_</span>';    // Crear tantas lineas como letras tenga la palabra y almacenarlas en array
    }
    // Insertar las lineas en el HTML
    for(var j=0; j<longPalabra; j++){      
        var lineasTot = document.getElementById('lineas').innerHTML+lineas[j];
        document.getElementById('lineas').innerHTML = lineasTot;
     } 
}   

/** Controla que NO se introduzca mas de un caracter en el input
 * 
 * @returns {undefined}
 */
function inputUnaLetra(){
    var valorInput =  document.getElementById('letra').value;       // Obtenemos el valor del input
    var numCaracteres = valorInput.length;
    if(numCaracteres > 1){                           // Si se introduce mas de un caracter en la misma consulta 
        numFallos--;                                // No cuenta como error
        alert('ERROR: Introduce solo una letra');
    }

}


/** Muestra los fallos cometidos en el HTML
 * 
 * @returns {undefined}
 */
function mostrarFallos(){
    var fallos = document.getElementById('fallos');
    fallos.innerHTML = numFallos;
    var input = document.getElementById('letra'); 
    input.focus();                // Situar el foco en el input 
    
    if(numFallos == 6){
        input.disabled = true;  // Deshabilitar el input para que no se pueda escribir
        alert('Has perdido!');
    }
}

/** Muestra un mensaje si aciertas todas las letras de la palabra
 * 
 * @returns {undefined}
 */
function mostrarAciertos(){
    var input = document.getElementById('letra'); 
    input.focus();
    numAciertos++;
//    if(valorInput == letraInsertada){           // Si introducimos en el input una letra que ya habiamos introducido antes
//        alert('ERROR: Ha repetido la letra'); 
//    }else{
//        numAciertos++;
//    }
    if(numAciertos == longPalabra){          // Si el numero de aciertos es igual al numero de letras de la palabra
        input.disabled = true;                            // Deshabilitar el input para que no se pueda escribir
        alert('Enhorabuena! Has acertado la palabra');
    }  
}

/** Recibe el numero de fallos, y muestra la imagen que corresponda 
 * 
 * @param {type} numeroFallos
 * @returns {undefined}
 */
function imagenAhorcado(numeroFallos){
    var imagen = document.getElementById('imgAhorcado');
    
    switch(numeroFallos){
        case 1:
            imagen.innerHTML="<img alt='imagen 2' src='2.PNG' />";
        break;

        case 2:
            imagen.innerHTML="<img alt='imagen 3' src='3.PNG' />";
        break;

        case 3:
            imagen.innerHTML="<img alt='imagen 4' src='4.PNG' />";
        break;

        case 4:
            imagen.innerHTML="<img alt='imagen 5' src='5.PNG' />";
        break;

        case 5:
            imagen.innerHTML="<img alt='imagen 6' src='6.PNG' />";
        break;

        case 6:
            imagen.innerHTML="<img alt='imagen 7' src='7.PNG' />";
        break;  

    } 

}
