<?php
session_start();

@header("Content-type: text/xml");
$xml = '<?xml version="1.0" encoding="utf-8"?>' . "\n";
$xml .= '<resultados>' . "\n";  //inciamos el XML
$palabras = array("rojo","verde","amarillo");//array con la posibles palabras


if(isset($_GET['inicio'])){     //se ha indicado iniciar un nuevo juego
    $inicio = intval($_GET['inicio']);  //obtenemos el parametro inicio
    if($inicio=='si'){
        $_SESSION['palabra'] = $palabras[rand(0,count(count($palabras)))];//seleccionamos una palabra aleatoria del array $palabras
        $longitud_palabra = strlen($_SESSION['palabra']);
        $xml .= "<longitud><![CDATA[".$longitud_palabra."]]></longitud>" . "\n";//retornamos la longitud de la palabra escogida
        $xml .= "<palabra><![CDATA[".$_SESSION['palabra']."]]></palabra>" . "\n";//retornamos la palabra para testear.
    }
}else{
    
    $palabra=$_SESSION['palabra'];
    if(isset($_GET['letra'])){  //se ha indicado una letra
        
      
        $letra = $_GET['letra'];    //obtenemos el parametro letra
        $posicion = strpos($palabra, $letra); //buscamos cuantas veces aparece $letra dentro de $palabras
        
          
        if($posicion===false){
             $xml .= "<encontrado><![CDATA[-1]]></encontrado>" . "\n";  //si no se ha encontrado ninguna coincidencia se retorna -1
        }
        while($posicion!==false){//retornamos las posiciones encontradas
             $xml .= "<encontrado><![CDATA[$posicion]]></encontrado>" . "\n";
             $posicion=$posicion+1;
             $posicion = strpos($palabra, $letra,$posicion); //encontramos la siguiente aparicion de la letra
            
        };
    }else{
         $xml.='No se ha indicado letra';
    }
}
//Tipo de archivo a retornar:
$xml .= '</resultados>' . "\n";


// End XML response
echo($xml);
?>

