---
layout: post
language: "es"
code: "the-art-of-cracks-and-keygens-nicolausi"
title: The art of cracks and keygens – Nicolausi
_title: El arte de los cracks y keygens – Nicolausi
description: Have you ever wondered how these things worked? Well, finding it out can be very fascinating.
_description: ¿Alguna vez te preguntaste cómo funcionan estas cosas? Descubrirlo puede ser muy fascinante.
thumb: /assets/images/posts/the-art-of-cracks-and-keygens-nicolausi/thumb.jpg
readtime: 15
---

# Introducción, y una pequeña historia sobre piratería
Durante toda mi infancia siempre fui un usuario de PC, nada de consolas. El hecho de que en mi país los videojuegos nunca fueron un mercado muy grande o barato por aquella época, el software **freeware** y la **piratería** estaban por todas partes. De hecho, yo lo considero un problema cultural que siempre existió y que lo sigue haciendo hasta día de hoy, pero que por suerte las nuevas tiendas/plataformas digitales como Steam, con su sistema de precios regionales, ayudó mucho en reducir este problema y forma de pensar. Pero a lo que voy es que la piratería estaba normalizada, y (en el mundo del PC) los **cracks** y **keygens** (generadores de llaves/códigos) eran muy comúnes de ver. Si había algún juego comercial para descargar (en línea) o a la venta (al menos por acá), de seguro era una copia pirata e incluía uno de estos.

Siempre me fascinaron los keygens: abrir el programa, copiar este código, generar, volver, pegar y listo, ya tenés el juego completamente desbloqueado. No puedo decir lo mismo de los cracks, ya que estos estaban presentes pero nunca lo notabas. Aún recuerdo el *'proceso de instalación'*, llevado a cabo por mi padre, el cual siempre incluía un crack o un serial/keygen. Momentos nostálgicos. Pero el punto es el mismo: siempre pensé que era normal, y nunca comprendí el daño que causaba la piratería. Esto es a lo que me refería con *'problema cultural'*. No estoy intentando justificarlo, pero las cosas eran así.

Durante los primeros años de mi adolescencia, mantuve esta cultura y accionar de piratería, solo que ahora por mi propia cuenta. Esto me llevó a estar cada vez más interesado en este tipo de cosas, y todos los aspectos técnicos que hay detrás. Ya no se trataba más sobre los juegos, pero sino de saltarse los mecanismos de seguridad, rompiendo programas de formas que nunca fueron pensados romperse, *eso era emocionante*. Sin embargo, por aquel tiempo no era capaz de comprender casi nada sobre todo esto, ni hablar del conocimiento y habilidades necesarias, más allá de ni siquiera tener idea de por donde empezar a buscar y aprender.

Eventualmente, ese día llego (bueno, no literalmente, sino que fue un proceso), y desde entonces siempre estuve jugando con distintos tipos de protecciones. Una vez que te adentras en este mundo, te das cuenta de lo desafiante y entretenido que puede ser, y lo voy a demostrar con un caso interesante en la siguiente lectura, un juego que no me importa un carajo, y aún así acá estoy: **Nicolausi** por **TOM Productions**, para DOS y Windows.

<br>

# El juego
Nicolausi es un juego de *'acción'* alemán, donde tenemos que ayudar a Papá Noel (o *Nikolaus* en este caso, del cual supongo que deriva el nombre del juego) a recolectar y entregar regalos a la casa correcta en cada nivel. Por supuesto que al mismo tiempo, estamos siendo perseguidos por nadie más que el mismísimo Conejo de Pascua, quien, equipado con su *'Estéreo Portátil'* y el poder de la música techno, intentará destruirnos y arruinar la Navidad, así que es mejor evitarlo.

El juego es básicamente un juego de laberintos isométrico, un poco frustrante y aburrido, ya que es más sobre avanzar a la fuerza bruta en lugar de pensar cuidadosamente tus movimientos. Un poco corto en contenido también, con solo 3 niveles disponibles en la versión **shareware**. Pero eso ya no va a ser un problema, porque vamos a desbloquear los 10 niveles de la versión **registrada**.

<br>

# Pero por qué
No sé, pasaron cosas. Supongo que fue el hecho de que este programa no contara ya con un crack o versión registrada disponible en internet, por lo que me ví obligado a hacer algo al respecto (que no sea pagar $14 dólares por un juego mediocre de hace más de 20 años). Además, como vas a poder leer en un momento, hay cosas bastante interesantes en relación a este título.

<br>

# Aviso
Antes de empezar, tengo que dejar en claro que este artículo solo tiene propósitos educacionales y de entretenimiento, y no es para fomentar la piratería. Esto es debido a que el juego **todavía está a la venta** por el desarrollador (sí, en su [sitio web](https://www.tom-productions.de/), como en los viejos tiempos). Por lo tanto, si bien va a haber investigación, código y algoritmos expuestos, no se mostrará ningún código de registro, ni tampoco el keygen final estará disponible públicamente. Dicho esto, *vamo' a empeza'*.

<br>

# Eligiendo entre DOS y Windows
Bueno, tenemos que crackear un programa de DOS, lo cual significa **[DOSBox Debugger](https://www.vogons.org/viewtopic.php?t=7323)**. Lo he usado antes, y si bien no es igual de cómodo y fácil de usar como las contrapartes de Windows, cumple con su trabajo satisfactoriamente, y es definitivamente mejor que cualquier depurador nativo corriendo bajo DOS. A pesar de esto, solo lo usé para depurar la **API de DOS**, como chequeos de CD y demás, pero nunca tuve mucha suerte con la lógica de los programas, por lo que intento evitar usarlo siempre que pueda. Para mi suerte, también existe una versión de Nicolausi para Windows.

La versión de Windows, desarrollada *'debido a alta demanda'*, es un port en **DirectDraw** de la versión de DOS, siendo referenciado como un *'emulador'* (tal vez lo sea, pero dudo que hayan desarrollado un emulador de DOS exclusivamente para esto en lugar de hacer un puto port del juego, o aún más fácil, publicarlo junto a **[DOSBox](https://www.dosbox.com/)**). También hay un **emulador de Ad-lib** (el **Sound-Engine**), porque por qué no, además de preservar esa *hermosa música techno* que se reproduce cada vez que el Conejo de Pascua está cerca. Para terminar, esta versión también usa los archivos originales de DOS.

Ahora, el plan inicial es sencillo: crackear la versión de Windows, y después ver si hay alguna manera de aplicar algo de lo producido en el ejecutable de DOS. Más allá de que el programa corra o no en un emulador, la lógica del juego debería ser similar. Antes de empezar con el análisis, veamos las diferencias entre ambas versiones:

<br>

![](/assets/images/posts/the-art-of-cracks-and-keygens-nicolausi/00.png){: .center-image }

{: .center-text }
A la izquierda la versión de DOS, y a la derecha la de Windows. Por lo que se puede ver, el único cambio perceptible es el incremento en la resolución.

<br>

# El chequeo del registro
Al completar el tercer nivel, aparece una ventana para registrar el programa, donde hay que ingresar un nombre y un código:

<br>

![](/assets/images/posts/the-art-of-cracks-and-keygens-nicolausi/01.png){: .center-image }

{: .center-text }
A pesar de que el sitio web afirme lo contrario, la versión de Windows solo está disponible en Alemán. Ingreso del nombre a la izquierda, ingreso del código a la derecha.

<br>

Vamos a cargar el ejecutable en **[Ghidra](https://www.ghidra-sre.org/)**. A estas alturas, donde recién empezamos, estoy buscando por cadenas de texto, cuando de repente algo llama mi atención:

<br>

![](/assets/images/posts/the-art-of-cracks-and-keygens-nicolausi/02.png){: .center-image }

{: .center-text }
`CHECKID` y `WRONGID` se ven sospechosos. También tenemos `PASSWORD` y `LICENSE`, pero el primero está relacionado con el sistema de contraseñas de los niveles, y el segundo con la lectura/escritura del archivo de licencia.

<br>

Este bloque en específico se ve bastante interesante, y puede ser que esas condiciones nos lleven a algo relacionado a los chequeos que estamos buscando, así que lo vamos a estar mirando de cerca. Ahora vamos a pasarnos a **[x64dbg](https://x64dbg.com/)**, y empezamos a analizar esta dirección de memoria para ver el código en acción:

<br>

![](/assets/images/posts/the-art-of-cracks-and-keygens-nicolausi/03.png){: .center-image }

{: .center-text }
Ey, ¡ese soy yo!

<br>

Ingresé mi nombre cuando el programa lo pidió, y ahora podemos ver que aparece en esta región de memoria. Si relacionamos este valor en la dirección `0x44A388` con la **descompilación en C** de Ghidra, ahora sabemos que el primer chequeo es el ingreso del nombre, para asegurarse de que no sea `NULL`. Adicionalmente, el nombre tiene que tener al menos dos palabras separadas, de otra manera no podremos continuar.

Siguiente, tenemos la función en la dirección `0x4133C0` que toma el texto del nombre como argumento. Voy a verlo en mayor detalle más adelante, ya que podemos asumir que esta función maneja el **algoritmo para la generación de llaves** basado en el nombre. Esta función regresa y guarda la llave en una variable, la cual está en la siguiente comparación.

Cuando estaba comprobando el valor en la dirección de memoria `0x44A294`, tenía un valor de `0`. Ese es el número que aparece por defecto, y aún no lo cambié, así que probemos de nuevo con un número al azar:

<br>

![](/assets/images/posts/the-art-of-cracks-and-keygens-nicolausi/04.png){: .center-image }

![](/assets/images/posts/the-art-of-cracks-and-keygens-nicolausi/05.png){: .center-image }

{: .center-text }
Si transformamos `0x138D5` de hexadecimal a decimal, obtenemos nuestro número 'aleatorio', `80085`.

<br>

Con esto, ya podemos confirmar que la dirección de memoria `0x44A294` almacena el valor del código que ingresamos, lo que significa que en la segunda comparación el programa comprueba que nuestra llave coincida con el resultado correcto/esperado generado por el algoritmo. Ahora ya podemos *auto-felicitarnos*, encontramos lo que estábamos buscando. Sobre el resto del código, no nos interesa, solo son mas chequeos para manejar errores, asignando `CHECKID` si la llave es `0`, o `WRONGID` si el código que ingresamos es incorrecto/inválido.

Por último, como dato interesante y a la vez completamente inútil, estos chequeos se ejecutan cada vez que ocurren ciertas acciones, inclusive en juego, como cargar menús, niveles y presionar teclas, y no me importa saber por qué.

Así que ahora solo es cuestión de cambiar estas instrucciones de salto y ya estamos listos:

<br>

![](/assets/images/posts/the-art-of-cracks-and-keygens-nicolausi/06.png){: .center-image }

{: .center-text }
El quinto nivel, porque me rehúso a seguir jugando esta cosa.

<br>

# Hermoso, ¿pero que hay de DOS?
Por desgracia hay un problema, que supongo que era de espererse. El código en ambas versiones es diferente, y por lo tanto el parche para Winodows no es aplicable en el ejecutable de DOS, así que necesitamos encontrar otra forma.

La solución es muy sencilla de hecho, y es inclusive mejor que un parche específico. ¿Recordás cuando dije que la función en la dirección `0x4133C0` maneja el algoritmo para generar las llaves? Bueno, ahí está. Ahora que tenemos un nombre, y el programa fue tan amable de calcular la llave correcta por nosotros, ya podemos usar el formulario de registro de forma normal. Esta combinación de *nombre+llave* funciona en las dos versiones, así que son intercambiables.

Hay dos formas de hacerlo, ingresando el formulario de registro, o copiando los archivos `G_NIC1.SCR` y `LICENSE.TOM`.

<br>

# Que aburrido
Si, este juego es aburrido, pero todavía nos podemos entretener con él.

Hasta ahora hicimos un crack para una de las versiones, y generamos nuestras llaves para ambas, aunque de una forma poco convencional, así que hay que arreglar eso.

Después de todo, este es el punto principal del artículo, analizar el algoritmo para la generación de llaves e implementarlo en un lenguaje de alto nivel, así podemos generar llaves con el presionar de un botón en lugar de buscar en memoria durante la ejecución del programa. La parte más emocionante de todo es que nunca hice nada como esto, no a este bajo nivel, y tengo *cero* teoría y experiencia en algoritmos, así que deséenme suerte.

<br>

# Analizando el algoritmo
Ahora es momento de destripar la función ubicada en `0x4133C0`, la cual vamos a llamar **función de keygen**. Como podemos ver en la primera imagen con el código descompilado, la función toma dos argumentos, el primero es un puntero hacia la cadena de texto del nombre, y el segundo, después de investigar un poco, es una **sal** de `32-bits`, la cual voy a nombrar como **sal principal**. No me interesa saber de dónde viene, ya que siempre tiene el mismo valor consistente de `0x3533335`, y eso es suficiente para trabajar en el *hash*.

La función de keygen comienza por asignar una **sal local** de `16-bits`, la cual es generada a partir de la sal principal al `XOR`ear los bits altos con los bits bajos. Por lo tanto, esta sal hereda la consistencia, con un valor de `0x3066`. Asignar esto es importante, ya que este será el **punto de reinicio**, que veremos con más detalle en un momento. Después de eso, en base a la sal local, se declara una **sal global**, que es la que va a ser utilizada durante el *hashing*. Finalmente se inicializa una variable de retorno (para la llave generada).

Después comienza el **análisis del texto**, tomando el primer caracter del puntero. No voy a entrar en mucho detalle, pero básicamente funciona así: la función chequea cada caracter (en **ASCII**); si es un espacio, número o símbolo, directamente incrementa el puntero hacia el siguiente caracter, y si es una letra, asigna su valor en mayúsculas dentro de un array. Este array almacenará la actual **cadena de texto en uso**, delimitada por los caracteres inválidos. Por ejemplo, si el texto ingresado es `Renzo123 Pigliacampo456`, los arrays en uso serían `RENZO` y `PIGLIACAMPO`, ingnorando completamente espacios y números. Estas cadenas de texto van a ser procesadas más adelante en distintas iteraciones del *hashing*.

Y ya que estamos hablando del tema, un dato de color sobre el ingreso del nombre dentro del juego. A pesar de que no se hacen chequeos para controlar un desborde del array (con un tamaño máximo de `80` bytes), el programa te tiene cubierto, ya que si llenás completamente el cuadro de texto (`35` caracteres) en la versión de Windows, el programa se cuelga. Y por si te lo estás preguntando, esto no pasa en DOS, pero en su lugar, el bloque de texto se corre unos cuantos pixeles a la derecha cada vez que se reintenta. Parece que alguien se olvidó de probar sus cuadros de texto.

<br>

![](/assets/images/posts/the-art-of-cracks-and-keygens-nicolausi/07.png){: .center-image }

{: .center-text }
De todos modos no podía leerlo en alemán.

<br>

Después de armar un array con los caracteres en uso, se detiene ese proceso y comienza el *hashing*. La sal local se reinicia (a `0x3066`), en caso de que sea una iteración consecuente, y de ahí comienza el procesamiento de cada caracter. Se llama a una **nueva función de salado**, que multiplica la sal global con una nueva, `0x15A4E35`, más `0x01`. Esta función almacena el resultado de `32-bits` en la variable de la sal global, pero solo los bits altos. Este valor firmado de `16-bits` se va a `XOR`ear con el caracter siendo actualmente procesado, sumando el resultado a la variable con la llave final. Este proceso se repite con el resto de los caracteres, y una vez que termina, retoma el análisis de lo que queda de la cadena de texto. Cuando todo esta listo, los bits bajos de la llave se `OR`ean con `0x2000`, y finalmente se devuelve el valor.

Y eso es todo, espero que no haya sido muy complicado de seguir. Si querés, podes guiarte con la descompilación revisada en [GitHub](https://github.com/Hipnosis183/NicolausiKey), que contiene una versión aislada de estas funciones.

<br>

# Hagamos un keygen
Ahora que conocemos la lógica detrás de la generación de llaves, podemos replicar su funcionalidad usando el lenguaje de programación de nuestra preferencia. Para esto, iba a elegir **JavaScript**, ya que estuve haciendo mucho desarrollo web estos últimos meses, pero al final decidí que tal vez el *viejo y confiable* **C#** sería más apropiado para la tarea, ya que por ahora no necesitamos más que una aplicación de consola. Si más adelante termino publicando el keygen, un **Windows Forms** con diseño extravagante y música chiptune es necesario, *sin excusas*.

El programa va a compartir la estructura descrita anteriormente, y si bien voy a mantener algunas operaciones fundamentales intactas, como operaciones con bits, todo lo que sea posible va a ser implementado en un mayor nivel, así que, por ejemplo, no necesitamos nuestro propio analizador de texto. Por lo tanto, solo voy a demostrar estos casos de alto nivel.

Primero, inicializamos y configuramos todo el saleo:

<br>

<div id="code-0" class="collapsible-hide">Presiona para mostrar el código</div>

<div id="code-0-data" class="content-hide" markdown="1">
{% highlight cs %}
// A pesar de ser calculadas, sus valores son consistentes.
const uint mainSalt = 0x03533335;
const uint localSalt = mainSalt >> 0x10 ^ mainSalt & 0xFFFF; // 0x3066

// Asignar sal global.
SetGlobalSalt(localSalt);

static void SetGlobalSalt(uint localSalt) {
  // Asignar una máscara de 16-bits de la sal local.
  globalSalt = localSalt & 0xFFFF;
}
{% endhighlight %}
</div>

<br>

Después, el analizador de texto:

<br>

<div id="code-1" class="collapsible-hide">Presiona para mostrar el código</div>

<div id="code-1-data" class="content-hide" markdown="1">
{% highlight cs %}
// Procesar la cadena de texto.
while (nameInput.Length != 0) {
  // Convertir a mayúsculas y eliminar espacios y números.
  NameFormat();
}

static void NameFormat() {
  foreach (char letter in nameInput) {
    // Eliminar caracter de la cadena de texto.
    nameInput = nameInput.Remove(0, 1);

    // Chequear si el caracter es un espacio o número.
    if (letter != 0x20 && !Char.IsNumber(letter))
      // Añadir al texto ya procesado.
      nameParsed += (Char.ToUpper(letter));
    else break;
  }
}
{% endhighlight %}
</div>

<br>

Una vez que tenemos una cadena de texto en uso, es momento de procesarla:

<br>

<div id="code-2" class="collapsible-hide">Presiona para mostrar el código</div>

<div id="code-2-data" class="content-hide" markdown="1">
{% highlight cs %}
// Declarar los primeros 4 bytes de la cadena en uso, necesario para el hashing.
byte[] nameGlobal = Encoding.ASCII.GetBytes(nameParsed.PadRight(4, 0x00));
uint nameGlobal32 = BitConverter.ToUInt32(nameGlobal, 0);
nameGlobal32 = nameGlobal32 & 0xFFFF0000;

while (nameParsed.Length != 0) {
  // Establecer los 2 bytes bajos de la cadena en uso, comenzando por el caracter actual.
  byte[] nameLocal = Encoding.ASCII.GetBytes(nameParsed.PadRight(2, 0x00));
  uint nameLocal16 = BitConverter.ToUInt16(nameLocal, 0);

  // El hashing en sí.
  charSalt = ReturnGlobalSalt();
  charSalt = charSalt ^ (nameGlobal32 ^ nameLocal16);

  // Sumar el resultado a la llave.
  keyCode += (int)charSalt;

  // Eliminar el caracter de la cadena siendo analizada.
  nameParsed = nameParsed.Remove(0, 1);
}
{% endhighlight %}
</div>

<br>

Como tenemos un enfoque de alto nivel, es necesario **simular** algunos de los comportamientos de bajo nivel, en este caso algo de administración de memoria.

Primero el programa guarda la cadena de texto en uso producida en un bloque contínuo de `80` bytes, de la cual solo los primeros `4` bytes se leen en el registro que será usado para almacenar el caracter procesado (la variable `nameGlobal32` en este caso). Por ejemplo, con la cadena en uso `RENZO`, solo se va a cargar `RENZ`.

Pero después de que el primer caracter es procesado, solo los bytes bajos se `AND`ean con `0x0000`, siendo reemplazados por los primeros `2` bytes de la cadena comenzando por el siguiente caracter en el puntero (`nameLocal16`). Eso significa que los bytes altos siempre son los mismos durante todo el proceso de *hashing* para esa cadena en uso. Así que siguiendo con el ejemplo anterior, en la segunda iteración, el valor (generado por `nameGlobal32 ^ nameLocal16`) sería `ENNZ`, que después de ser hasheado con la sal, sigue con `NZNZ`, `ZONZ`, `O0NZ` y finalmente `00NZ`. Como después del último caracter no hay nada, es necesario rellenar siempre `nameLocal16`, y en el caso de nuestra implementación, especificar el caracter con el valor de `0x00`, ya que sino, la función `PadRight` va a añadir un espacio (`0x20`), y *ciertamente* no queremos que pase eso.

<br>

Finalmente, cuando ya está todo listo, devolvemos la llave final:

<br>

<div id="code-3" class="collapsible-hide">Presiona para mostrar el código</div>

<div id="code-3-data" class="content-hide" markdown="1">
{% highlight cs %}
// Devolver los bytes bajos del resultado final de la llave.
return (uint)keyCode & 0xFFFF | 0x2000;
{% endhighlight %}
</div>

<br>

Entonces solo nos queda llamar la función desde `Main()`:

<br>

<div id="code-4" class="collapsible-hide">Presiona para mostrar el código</div>

<div id="code-4-data" class="content-hide" markdown="1">
{% highlight cs %}
static void Main() {
  // Ingreso de nombre.
  Console.Write("Ingresar nombre: ");
  string nameConsole = Console.ReadLine();

  // Generación de llave.
  uint keygenResult = KeyGenerate(nameConsole);
  Console.WriteLine("Tu llave es: " + keygenResult);
  Console.ReadKey();
}
{% endhighlight %}
</div>

<br>

Y eso es todo, ya tenemos un keygen funcional. En esta implementación cubrí todos los casos de entrada de texto que el programa normalmente permitiría, excepto por el manejo de caracteres especiales, donde una solución expandida y de más bajo nivel puede ser necesaria para procesarlos correctamente. Pero por ahora, estoy feliz con los resultados.

<br>

# Pero esperá, todavía hay más
Los desarrolladores, **TOM Productions**, tienen unos cuantos títulos más bajo la manga, y uno de ellos específicamente usa el mismo motor que Nicolausi, **PC-Bakterien**, también para DOS y Windows. Por curiosidad, decidí echarle un vistazo a este título, y resulta que mi teoría inicial era correcta: el keygen también funciona para PC-Bakterien. Bueno, *casi*, ya que éste tiene una sal diferente (`0x784326`), pero después de cambiarla, funciona a la perfección.

<br>

![](/assets/images/posts/the-art-of-cracks-and-keygens-nicolausi/08.png){: .center-image }

{: .center-text }
PC-Bakterien tiene `20` niveles en lugar de los `10` de Nicolausi. Ante ustedes el nivel 20. Por supuesto que no soy un masoquista para haber completado todos los niveles, pero en su lugar modifiqué el archivo de guardado. Esta modificación consistió en cambiar `80` bytes a `0x00`, e incluso me dió puntuaciones muy altas. Esto también funciona con Nicolausi (`40` bytes en lugar de `80`). Y como dato de color, **sí**, PC-Bakterien tiene exactamente el mismo problema de cuelgue y casilla de texto que Nicolausi.

<br>

No probé con el resto de los títulos, pero creo que ya tuve suficiente. Sin embargo, solamente la colleción de la serie **Robot** fue lanzada para Windows, así que ese sería el único título que podría analizar e intentar conseguir la sal, en caso de que el keygen comparta la misma lógica. Pero de todos modos, yo llamaría a este proyecto un éxito.

<br>

# Para cerrar
Todo esto me llevó alrededor de 3-4 días, *mucho menos* de lo que esperaba. Definitivamente fue mucho más entretenido que jugar al juego en sí. Pero lo más importante, cumplí mi sueño de hacer un keygen, y espero que sea el primero de muchos.

Igualmente ahora hablando en serio, a pesar de que me burlé del juego durante todo el artículo, no es *tan* malo, y si te gustan este tipo de títulos puede que encuentres algo de entretenimiento. Sin embargo, esta forma de entretenimiento de 1995 definitivamente *no* vale $14 dólares en 2021, y sobre esto, tener que comprarlo exclusivamente desde el sitio web del desarrollador no ayuda mucho. Si por algun motivo sos parte de TOM Productions y estas leyendo esto (hola **Andreas**), pongan las cosas en **Steam** o **GOG** a un precio más accesible, y tal vez así tengan más visibilidad y logren vender algo. Como dije al principio, la única manera de que yo y otras personas puedan comprar juegos es a través de Steam, y si Nicolausi hubiera estado disponible ahí, lo hubiera adquirido sin ninguna duda.

Y por último, como prometí, no va a haber un crack o keygen disponible publicamente, aunque podrías desarrollar uno fácilmente con la explicación y código demostrados anteriormente. Además, está la descompilación revisada en GitHub, disponible para que aquellos interesados puedan guiarse durante la explicación, o hacer lo que quieran realmente. Pero si elegís hacer esto último, por favor guardatelo y no lo compartas en internet, tengamos algo de respeto por los desarrolladores, quienes sorpresivamente siguen dándole soporte a un programa para una plataforma muerta.

Dicho esto, el momento en que los desarrolladores dejen de soportar y/o venderlo, y me entere de ello, el keygen completo tanto para Nicolausi como PC-Bakterien estarán disponibles en [GitHub](https://github.com/Hipnosis183/NicolausiKey). Hasta entonces, espero que hayas disfrutado la lectura.

<br>

**Actualización 24/12/21:** Bueno, parece que dejaron de vender el juego antes de lo que esperaba. ¡Es un regalo de navidad!

<br>

# Hipnosis 4:20 - Aquellos que esperen serán recompensados con el tiempo
Como era de esperarse, TOM Productions finalmente pusieron fin a su tienda propietaria del mal, haciendo en consecuencia que todos sus productos sean oficialmente **imposibles de comprar**. Y como lo prometido es deuda, el keygen ahora está disponible para descargar. Dirigite a la página del proyecto en [GitHub](https://github.com/Hipnosis183/NicolausiKey) para conseguir el keygen en uno de dos sabores: **C#** (Windows Forms y Consola) o **JavaScript**. Al final decidí añadir este último porque estoy planeando crear una sección en la página para que pueda ser usado sin tener que descargar nada.

<br>

**Actualización 28/02/22:** Ya está en funcionamiento, lo podés encontrar en la sección de [extras](/extras/tom-productions).

<br>

![](/assets/images/posts/the-art-of-cracks-and-keygens-nicolausi/09.png){: .center-image }

{: .center-text }
El mismísimo keygen. Ya sé que no tiene el nivel de extravagancia que alguna vez prometí, pero por desgracia no tengo el tiempo ni las ganas para hacerlo. Pero por otro lado, definitivamente destaca por su simplicidad.

<br>

Entonces, ¿que nos depara el futuro? Todavía me gusta a idea de visitar sus otros títulos, principalmente la serie **Robot**, la cual sorprendentemente tiene un grupo de seguidores muy dedicados, incluyendo su propio [sitio web](http://www.game-of-robot.de/) y foro, donde una persona [fabricó una edición de coleccionista personalizada](https://forum.tom-productions.de/gameofrobot/robot-spiele/robot-allgemein/the-game-of-robot-collection-box/). A la mierda.

Hasta que llegue ese día, podés disfrutar (o sufrir) con Nicolausi y PC-Bakterien.

<br>

***¡Felices Fiestas!***
