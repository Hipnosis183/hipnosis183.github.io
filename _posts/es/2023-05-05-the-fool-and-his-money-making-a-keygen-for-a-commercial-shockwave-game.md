---
layout: post
language: "es"
code: "the-fool-and-his-money-making-a-keygen-for-a-commercial-shockwave-game"
title: The Fool and his Money - Making a keygen for a commercial Shockwave game
_title: The Fool and his Money - Haciendo un keygen para un videojuego de Shockwave comercial
description: Wise men make proverbs, but fools repeat them.
_description: Los sabios hacen proberbios, pero los tontos los repiten.
thumb: /assets/images/posts/the-fool-and-his-money-making-a-keygen-for-a-commercial-shockwave-game/thumb.jpg
position: top
readtime: 11
---

# Una nota
Antes de comenzar, me gustaría aclarar que este es va a ser artículo corto y rápido, ya que [mi próximo gran proyecto](https://www.youtube.com/watch?v=dKa7DvTEwqI) va a tardar bastante tiempo en estar completo, así que escribí esto para no perder el ritmo y acortar la brecha. Ya hablé sobre keygens en [otra oportunidad](/blog/the-art-of-cracks-and-keygens-nicolausi/), así que en esta ocasión va a ser más directo al punto.

<br>

# Introducción
¿Te acordás de Adobe/Macromedia **Shockwave**? Si bien yo siempre fuí más entusiasta de **Flash**, Shockwave tuvo su buena cantidad de videojuegos a finales de los 90 y principios de la década del 2000, siendo durante un tiempo la plataforma de preferencia para el desarrollo de videojuegos en línea. Y si bien era una tecnología muy completa, de a poco quedaría detrás de la competencia, sus propios parientes, con el pasar del tiempo.

Aún considerando que Adobe **Director** estaba evolucionando y añadiendo funcionalidades constantemente, quedaría obsoleto por otros dos productos de Adobe: Flash, poniéndose a su altura y hasta superándolo, dominando en materia de videojuegos en línea, y Adobe AIR, haciendo lo mismo pero para aplicaciones de escritorio. Shockwave termino quedando en medio de ambos, sin destacar en ninguno.

A pesar de esto, algunos juegos desarrollados en Shockwave seguirían lanzandose durante la década del 2010, hasta su muerte oficial en 2017, lo cual nos lleva al tema de hoy.

<br>

# Una historia de aventuras y filosofía
**The Fool's Errand** es un videojuego de rompecabezas lanzado para la Macintosh original en 1987. Yo no soy mucho de este tipo de juegos (ni del Macintosh), pero aparentemente es de alta estima en la comunidad de Mac, ya que tiene un estilo muy peculiar, inclusive para hoy en día.

Éste recibiría una secuela en 2012, **The Fool and his Money**, después de varios retrasos viniendo desde el 2003, así que está de más decir que fue un título muy anticipado, al menos para los más fanáticos.

El creador de la serie, **Cliff Johnson**, quien también es un cineasta (y un tipo *muy* filosófico), decidió lanzar el título por su cuenta, disponible para su compra exclusivamente en su sitio web a través de correo electrónico. Si leíste my [artículo sobre Nicolausi](/blog/the-art-of-cracks-and-keygens-nicolausi/), ya sabrás que esta es una **idea terrible** a la larga, que eventualmente lleva a que sea innecesariamente complicado comprarlo o directamente imposible. ¿Adiviná que pasó?

Cliff fue contactado recientemente por alguien que quería comprar una licencia para este título, ahora inobtenible (no está disponible en internet), y su respuesta fue, y cito:

<br>

![](/assets/images/posts/the-fool-and-his-money-making-a-keygen-for-a-commercial-shockwave-game/00.png){: .center-image }

{: .center-text }
Que manera tan filosófica de describir vagancia.

<br>

No estaba jodiendo cuando dije que era un tipo ***muy*** filosófico, un poco demasiado para mi gusto. Pero la pregunta es, ¿por qué? ¿Es el juego incompatible con sistemas modernos? ¿Será muy costoso actualizarlo y ponerlo en tiendas modernas como **GOG** o **Steam**? ¿Qué es? Voy a intentar responder estas preguntas al final.

<br>

Pero primero, veamos de que se trata el **sistema de licencias**, explicado por la [guía de instalación](https://www.fools-errand.com/06-FM/guide-installation.htm) en el sitio web:

- Descargar el juego.
- Obtener la `PassWord` (contraseña) y `PassKey.zip` en el correo de confirmación.
- Poner `PassKey.zip` dentro del directorio del juego y desempacar el archivo `PassKey.txt`.
- Abrir el juego e ingresar la contraseña.
- Disfrutar el juego.

<br>

El código descompilado más pertinente estará disponible en [GitHub](https://gist.github.com/Hipnosis183/40630dcc5337a24f0586130907d36487) para el que quiera seguir a la par.

<br>

# Organizando lo que tenemos
Todo lo que sabemos hasta ahora es que tenemos un juego de Adobe Director/Shockwave entre manos. ¿Pero cómo lo encaramos? Hasta ahora, si leíste mis otros artículos ya sabrás, solo trabajé con programas nativos de Windows y aplicaciones de Android, pero esto no es ninguno, así que es momento de sentarse y ponerse a investigar un poco.

Lo único que se sobre Shockwave es que las archivos vienen en formato `DCR` (película publicada) o `DIR` (película editable), pero el juego tiene un ejecutable, uno bastante grande. Así que primero hay que desempaquetarlo, para lo cual voy a usar **[director-files-extract](https://github.com/n0samu/director-files-extract)**, un script de Python para extraer todo el contenido que se encuantra dentro del ejecutable. Esto genera varios archivos `CST` (casts editables) y el archivo de proyecto `DCR`:

<br>

![](/assets/images/posts/the-fool-and-his-money-making-a-keygen-for-a-commercial-shockwave-game/01.png){: .center-image }

{: .center-text }
No sé por qué `zzz-COPY-Game-HERE` exactamente, pero quién soy yo para juzgar.

<br>

Pero si intentamos abrir los archivos todo lo que vemos es texto ilegible, ya que estos son archivos publicados, los cuales se comportan de forma similar a programas compilados, por lo que deben ser descompilados para poder leer su contenido. Para ello, voy a usar **[ProjectorRays](https://github.com/ProjectorRays/ProjectorRays)**, un descompilador de Director/Shockwave, con todos los archivos extraídos previamente. Pero, ¿qué hacemos con éstos?

<br>

# Como en los viejos tiempos
Ahora que todos los archivos son legibles, pensé en echar un vistazo al código y ver de que se trata el sistema de contraseñas, pero no es tan fácil todavía: es *necesario* tener Adobe Director para abrir los archivos del proyecto. El juego fue desarrollado con Director `11.0.3` (2008), y yo encontré una copia de la versión `11.5` (2009) en [archive.org](https://archive.org/details/adobe_director_11.5), y parece ser que todo funciona bien.

<br>

![](/assets/images/posts/the-fool-and-his-money-making-a-keygen-for-a-commercial-shockwave-game/02.png){: .center-image }

{: .center-text }
Chicos, el abuelo vino a visitar.

<br>

Al abrir Director, tenemos la opción de ingresar un código de registro o continuar con una **prueba de 90 días**; creo yo que es más que suficiente tiempo para nuestros propósitos. Después de abrir el proyecto en Director, somos recibidos con esta interfaz:

<br>

![](/assets/images/posts/the-fool-and-his-money-making-a-keygen-for-a-commercial-shockwave-game/03.png){: .center-image }

{: .center-text }
UI reducida solo con lo que necesitamos.

<br>

Como no vamos a desarrollar un videojuego, todo lo que nos importa es el panel de **casts** a la derecha, el cual va a contener todas las escenas y código relacionado, y los controles de reproducción abajo del panel principal (o en la barra superior), para ejecutar y probar el código que modifiquemos.

Mirando entre los archivos cast, el código relacionado con las contraseñas se encuentra en el cast `103`, **miembro** `08-StartUp`, así que veamos que pasa ahí.

<br>

# El sistema PassKey
Como expliqué antes, el juego lee el archivo `PassKey.txt` y la contraseña que venían incluídos con el correo de compra. Podemos suponer que el archivo de texto incluye esta contraseña de alguna u otra forma para comprobar su validez.

Indagando en el código **[Lingo](https://en.wikipedia.org/wiki/Lingo_(programming_language))**, podemos ver la primera mención del archivo `PassKey.txt` dentro de la función `special_Frame_2()`:

<br>

![](/assets/images/posts/the-fool-and-his-money-making-a-keygen-for-a-commercial-shockwave-game/04.png){: .center-image }

<br>

Este código chequea la validez del archivo `PassKey.txt`, al igual que la presencia de `PassKey.zip` para avisarle al usuario que se olvió de desempaquetarlo. Primero chequea el tamaño del archivo (`1000` bytes), y después pasa el contenido empezando desde el `4to` byte a la función `decodeZip()`, la cual va a aparecer de forma recurrente durante todo el proceso de chequeo, al igual que en otras operaciones que vamos a discutir más adelante. Después del proceso de decodificación, podemos ver el formato del nombre y contraseña en pleno: *barra vertical*, **contraseña**, *barra vertical*, **nombre**, *barra vertical* (o `|ABC123XYZ|Hipnosis|`).

Ahora con esta información, es momento de analizar las funciones de **codificación/decodificación**:

<br>

<div id="code-0" class="collapsible-hide">Presiona para mostrar el código</div>

<div id="code-0-data" class="content-hide" markdown="1">
{% highlight js %}
// Definir miembros cast 'zip-code' y 'zip-mark'.
const zipCode = [37, 28, 52, 88, 65, 20, 92, 49, 67, 11, 5, 44, 2, 29, 3, 93, 60, 22, 69, 56, 3581, 83, 68, 24, 13, 31, 80, 26, 8, 85, 19, 94, 77, 90, 41, 66, 79, 58, 30, 17, 73, 34, 15, 75, 2791, 43, 50, 48, 25, 53, 23, 72, 55, 42, 82, 51, 39, 4, 32, 46, 36, 74, 33, 70, 1, 84, 59, 14, 3864, 7, 71, 16, 40, 57, 61, 10, 86, 63, 45, 78, 76, 47, 87, 54, 62, 89, 21, 12, 9, 6, 18];
const ZM = '*&^%$#@!?=({[/|\\]})+<>:;,.”’';

const encodeZip = (S) => {
  // Obtener un caracter aleatoriamente.
  let ct = Math.floor(Math.random() * ZM.length);
  // Guardar caracter para la decodificación.
  let SS = ZM[ct];
  // Iterar por todos los caracteres de entrada.
  for (let x = 0; x < S.length; x++) {
    // Obtener código de tecla del caracter actual.
    let N = S[x].charCodeAt();
    // Chequear si el caracter actual es un caracter ASCII válido.
    if (N >= 32 && N <= 126) { ct++;
      if (ct >= 94) { ct = 0; }
      N = S[x].charCodeAt() + zipCode[ct];
      if (N > 126) { N -= 94; }
      SS += String.fromCharCode(N);
    } // Caracter inválido, dejar como está.
    else { SS += S[x]; }
  } // Devolver texto codificado.
  return SS;
}
{% endhighlight %}
</div>

{: .center-text }
Traducción de Lingo a JavaScript de la función de codificación.

<br>

Estas funciones utilizan dos constantes codificadas, `zip-mark` (`ZM`) y `zip-code` (`zipCode`), así que para obtener su valor de forma fácil solo añadí una función `put()` en el código, que es la manera de Lingo para imprimir en la consola, mostrando los resultados en una ventana de `Mensajes` en Director. Para la referencia Adobe tiene un [diccionario](https://help.adobe.com/archive/en_US/director/UsingScripting/director_reference.pdf) disponible en línea, bastante útil considerando que estamos trabajando con un lenguaje de programación obsoleto.

Para el proceso de codificación, un **caracter aleatorio** de `ZM` es seleccionado como **punto de inicio** y se añade al **texto de salida** (para saber como decodificarlo más adelante). Esto significa que el mismo texto de entrada puede generar diferentes resultados. Después, se controla que todos los caracteres sean caracteres **ASCII** válidos (códigos de tecla `32-126`), y finalmente procesa cada uno con los valores dentro del array `zipCode`, tomando otro valor como índice, `ct`, el cual se reinicia cada cierta cantidad de iteraciones. Decodificar es lo mismo, pero al revés.

Pasar estas funciones a otro lenguaje (**JavaScript** en este caso) es bastante directo, la única diferencia siendo la indexación que empieza en `1`, y algunas funciones que se comportan algo diferente. También es muy fácil probar el código, ya que podemos usar las funciones en Lingo originales para saber el resultado esperado. Ahora con todo listo, ya podemos empezar con el keygen.

<br>

# Engañando al tonto
Si bien con las funciones de codificación y decodificación ya casi estamos, todavía tenemos que crear el archivo `PassKey.txt`. Con nuestro **nombre** y **contraseña** de preferencia con el formato descrito anteriormente, todo lo que nos queda ver son los primeros `3` bytes y el resto para rellenar los `1000` bytes requeridos para ser válido. Resulta que no importa que pongamos, así que lo voy a rellenar con espacios. Así que ya estamos, *es eso*. Me llevó más tiempo hacer la imagen de cabecera que el keygen.

Podés acceder al codificador, decodificador y keygen en [GitHub](https://gist.github.com/Hipnosis183/40630dcc5337a24f0586130907d36487), o en línea en la sección de [extras](/extras/fool-and-his-money/).

<br>

# Hay que creer
Todavía no terminamos, ya que hay un pequeño detalle que pasamos por alto. De vuelta al sitio web, las intrucciones de instalación tiene dos secciones: **compras actuales** y **pre-compras de verdaderos creyentes**. La única diferencia es que el último no viene con el archivo `PassKey.txt`, solo con la contraseña. Esto significa que tiene que haber una manera de ingresar al juego solo con una contraseña, y si bien es posible, es fácil pasarlo por alto a simple vista.

La función `special_Frame_3()` controla el estado de la escena para ingresar contraseñas, asegurándose de que sea correcta y que coincida con la información dentro de `PassKey.txt`. La fase `5` se encarga principalmente de esto, donde al principio se llama a una función, `special_FindPassWordName()`, que dentro recorre la variable `theDataTotal`, la cual se asigna primero al final de `special_Frame_2()` a partir del miembro cast `miscellaneous`, el cual es una cadena de texto codificada bastante grande, que se encuentra en el cast `101`. Añadiendo algunas funciones `put()`, podemos confirmar que esto son los nombres y contraseñas que buscamos. Pero intentar decodificarla como está no funciona, ya que no es una sola cadena codificada, sino que varias concatenadas, incluyendo un índice al principio. Esto significa que para poder ver que hay dentro, tenemos que **reimplementar** la función `special_ReadDataChunk()`,la cual se llama justo despues de la asignación:

<br>

<div id="code-1" class="collapsible-hide">Presiona para mostrar el código</div>

<div id="code-1-data" class="content-hide" markdown="1">
{% highlight js %}
const special_ReadDataChunk = (miscellaneous) => {
  const len = miscellaneous.length;
  let N = decodeZip(miscellaneous.slice(0, 13));
  const totalLong = parseInt(N);
  N = decodeZip(miscellaneous.slice(13, 26));
  const totalName = parseInt(N);
  const theDataChunk = miscellaneous.slice(26, miscellaneous.length);
  let chunkLong = decodeZip(theDataChunk.slice(0, totalLong));
  let chunkName = theDataChunk.slice(totalLong, theDataChunk.length);
  let pos = chunkLong.indexOf('|') + 1;
  N = chunkLong.slice(0, pos - 1);
  const theDataTotal = parseInt(N);
  chunkLong = chunkLong.slice(pos, chunkLong.length);
  let arrayLong = [];
  for (let x = 0; x < theDataTotal; x++) {
    pos = chunkLong.indexOf('|') + 1;
    N = chunkLong.slice(0, pos - 1);
    arrayLong[x] = parseInt(N);
    chunkLong = chunkLong.slice(pos, chunkLong.length);
  } let theDataName = [], theDataTrue = [];
  for (let x = 0; x < theDataTotal; x++) {
    theDataName[x] = decodeZip(chunkName.slice(0, arrayLong[x]));
    chunkName = chunkName.slice(arrayLong[x], chunkName.length);
    theDataTrue[x] = decodeZip(chunkName.slice(0, 10));
    chunkName = chunkName.slice(10, chunkName.length);
  }
}
{% endhighlight %}
</div>

<br>

Acá no hay mucho para explicar, más allá de que se lee manualmente el índice para después poder escribir los datos dentro de unos arrays, los cuales van a ser usados en `special_FindPassWordName()` para comprobar que la contraseña coincida con alguno de estos *verdaderos tontos* que pre-compraron en el 2003.

Antes de continuar, hay una cosa más que me gustaría mencionar. Volviendo a `special_Frame_3()`, fase `12`, hay un último chequeo final que compara la cadena `^DR$_GMlsLT~ydL`, o `Jonathan Raven` decodificado, que coincide con uno de los nombres en la lista de verdaderos creyentes. Específicamente para este nombre, se activa una bandera llamada `AUTO-SOLVE` (solucionar automáticamente), y si bien esto ejecuta código algo diferente, nada cambia dentro del juego, y no me importa demasiado como para investigarlo en profundidad. Sólo pensé que raro es que haya un chequeo tán específico, y me hace especular si tiene algún significado o está solo para probar algo.

Como sea, tanto esta función como la lista entera de verdaderos creyentes decodificada también están disponibles en [GitHub](https://gist.github.com/Hipnosis183/40630dcc5337a24f0586130907d36487).

<br>

# ¿Quién es el tonto ahora?
Es bueno ver otro título viejo disponible y completamente funcional, incluso si en este caso no es muy a mi gusto (bueno, tampoco lo fue Nicolausi). Pero ahora que vimos que todo funciona correctamente, y que es relativamente sencillo circunvenir el sistema `PassKey`, con o sin código de fuente, es momento de intentar responder las preguntas del inicio.

Llegue a tres posibles conclusiones: falta de interés, vagancia o a Cliff no le gusta el dinero. Creo yo que es una combinación de todo, pero sean cuales sean los motivos, *no importa*, ya que ahora podemos generar nuestras propias llaves. Es una pena, ya que un juego como este vendería muy bien hoy en día, más que nada en tiendas como **GOG**.

En el lado más técnico no hay mucho que decir, pero fue interesante trabajar no solo con una tecnología obsoleta como Shockwave, pero también tener **código completamente legible** disponible por lo menos *una vez*. Al principio no esperaba escribir un artículo, solo quería crackear la protección de forma rápida, pero terminó llevando más tiempo del que esperaba. Eso sumado a las razones que listé al principio, dije por qué no.

Además, encuentro particularmente interesante el hecho de que las herramientas que usé para extraer el código son relativamente recientes, lo que implica que esto no hubiera sido posible algunos años atrás. Así que me gustaría agradecer a la gente detrás del desempaquetador y descompilador (también debería recordar agradecer a la **NSA** por **Ghidra** algún día de estos).

Dicho esto, voy a regresar a mi cueva a trabajar en ***cosas más importantes***.
