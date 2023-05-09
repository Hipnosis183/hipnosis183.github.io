---
layout: post
language: "es"
code: "recreating-a-server-for-a-dead-online-single-player-game-jewelry-master"
title: Recreating a server for a dead online single-player game - Jewelry Master
_title: Recreando un servidor para un videojuego en línea ya muerto - Jewelry Master
description: Let's save old and forgotten online games from obscurity.
_description: Salvemos estos títulos en línea viejos y abandonados del olvido.
thumb: /assets/images/posts/recreating-a-server-for-a-dead-online-single-player-game-jewelry-master/thumb.jpg
readtime: 19
---

# Introducción a los videojuegos en línea
Todos hemos experimentado juegos en línea alguna vez, incluso sin siquiera notarlo. Ya sea un *MMO*, un modo multijugador, o simplemente el requerimiento de una conexión a un servidor, desde finales de los 90 los juego en línea se encuentran por todos lados y en formas diferentes, y con la inclusión de las plataformas móviles sobre la ya masiva base de usuarios de PC existente, solo continuaron creciendo cada vez más a través de los años.

Los juegos en línea unificaron a los **videojuegos** con las **tecnologías web**, encontrando así un mejor uso para éstas más que visitar sitios web y enviar correo. Éstos también ofrecen una experiencia que de otra manera no sería posible, tanto para usuarios como desarrolladores. Pero semejantes oportunidades también vienen con un precio: es **necesaria** una conexión a un servidor para poder jugar. Ésta es la mayor desventaja de los juegos en línea, ya que como su nombre indica, es necesario tener una conexión a internet, y al mismo tiempo, tiene que existir un servidor del otro lado. Podemos manejar la primera parte fácilmente, pero no tenemos ningún control sobre la segunda. Esto se volvió un problema en los últimos años, ya que esta comunicación entre servidor-cliente se ha implementado también como una forma de **protección** (DRM) ante la piratería de software, pero en contraparte hace que el programa sea completamente dependiente en este servidor web, haciendo de éste totalmente inútil sin una conexión a internet (ya hablé sobre el tema en el [artículo anterior](/blog/reversing-and-cracking-the-chinese-android-based-laptop-arcade-games/), pero pensé que valía la pena mencionarlo).

Pero conforme pasa el tiempo, dejamos de lado todas las risas y los buenos momentos y empezamos a ver la cruda realidad: ***nada dura para siempre***. Ese título que tanto amas y que jugaste durante años va a desaparecer en algún momento, y todo lo que va a quedar son los recuerdos y *los amigos que hicimos en el camino*. *Pero pará*, no todo está perdido, solo es cuestión de que aparezca alguien con el tiempo, conocimiento y ganas para solucionar este problema.

<br>

# Antecedentes
Algo que siempre quise hacer es *revivir viejos juegos en línea*, y desde entonces me pregunté que tan complicado sería hacerlo. Cuando empecé a hacer desarrollo web hace dos años, pude comprender de forma progresiva como funcionan las tecnologías web y la comunicación entre redes, cosas que siempre me fueron confusas hasta ese punto.

En mi proyecto más reciente, **[Instagular](https://github.com/Hipnosis183/Instagular)** (reimplementación del cliente de **Instagram**), tuve que averiguar como reimplementar y comunicar cierta funcionalidad servidor-cliente de Instagram, para lo que fue necesario analizar las peticiones entre ambos, incluyendo la autenticación de usuario. Esto me permitió combinar desarrollo web con ingeniería inversa, y sin darme cuenta, me dió un panorama sobre retroingeniar y emular un servidor web.

Pasaron unos cuantos meses y decidí tomarme un descanso de ese proyecto para enfocarme en otro de naturaleza similar, pero completamente diferente al mismo tiempo. Algo que siempre quise hacer, per no tenía la capacidad ni experiencia para hacerlo, hasta ahora: *un emulador de servidor web para un juego en línea*.

<br>

# Un diamante en bruto
A través de los años mantuve una lista de juegos en línea que ya pasaron a mejor vida, y que serían candidatos para cuando llegase el tiempo indicado. Uno que siempre estuvo al principio de la lista, y sabía que sería el primero en caer, es **Jewelry Master**.

**Jewelry Master** fue un juego de rompecabezas arcade en línea desarrollado por **Arika** (conocidos por las series **Tetris Grand Master** y **Street Fighter EX**) en 2006, y fue lanzado como un proyecto de pruebas para evaluar la posibilidad de una versión más producida para consolas en el futuro, lo cual sucedió cuatro años más tarde con el lanzamiento de **Jewelry Master Twinkle** en Xbox 360. Los servidores se dieron de baja alrededor del año 2011, resultando en que este título ya no se pueda jugar.

Supongo que a estas alturas ya sabés por qué elegí este título en particular. No solo éste tiene similitudes con un juego que me encanta, **TGM3** (hasta el punto en que desarrollé un [emulador](https://github.com/Hipnosis183/TTX-Monitor) y un [parche de resolución](https://github.com/Hipnosis183/TGM3HD) para éste), pero también porque este **no es** un juego en línea **multijugador**, sino uno en línea para **un solo jugador**, dejame explicar.

Jewelry Master solo tiene dos funcionalidades en línea: autenticación de usuario y manejo de puntuaciones/tabla de posiciones. Pero aún así, el juego no pasa de la pantalla de inicio sin un servidor funcionando del otro lado. Esto hace que este título sea el sujeto *perfecto* para un primer proyecto como este, ya que no tenemos que preocuparnos por múltiples servidores, control de estado multiugador y otros conceptos similares. Y como podrás leer más adelante, este título no tiene ningún tipo de seguridad o protección, así que va a ser directo al grano.

También es importante recordar que estamos tratando con un juego sin servidor disponible, así que todo lo que tenemos para trabajar es el cliente, lo cual hace las cosas mucho más complicadas de lo que deberían ser. En adición, nunca probé este juego personalmente, así que no tengo idea de como deberían funcionar ciertas cosas. Para este proyecto, vamos a ver el proceso de ingeniería inversa, para después poder aplicar todo el conocimiento adquirido en una solución de software que sea capaz de replicar la funcionalidad del servidor original lo más cerca posible.

<br>

# Comunicación con el servidor
Cuando abrimos el programa somos llevados al menú principal, donde podemos iniciar sesión con el nombre de usuario y contraseña que deberíamos haber creado anteriormente en la *ya difunta* página web de registro. Independientemente de la información que introduzcamos, el resultado es siempre el mismo:

<br>

![](/assets/images/posts/recreating-a-server-for-a-dead-online-single-player-game-jewelry-master/00.png){: .center-image }

{: .center-text }
Claramente el servidor está muerto, así que no hay nada a lo que conectarse.

<br>

Ahora que ya conocemos la situación actual, veamos la comunicación con el servidor en **Wireshark**:

<br>

![](/assets/images/posts/recreating-a-server-for-a-dead-online-single-player-game-jewelry-master/01.png){: .center-image }

{: .center-text }
Isolado el tráfico generado por el juego.

<br>

Podemos sacar información valiosa de esto, y ver que el dominio del servidor es `hg.arika.co.jp`, para el cual el servidor DNS no puede encontrar una dirección válida. Debido a esto, no podemos avanzar mucho más en la situación actual, así que tenemos que encontrar una manera de poder continuar.

<br>

# Engañando al cliente
Ahora tenemos que engañar al juego para que busque al servidor en otra parte. Para nuestra suerte, en Windows tenemos el *archivo de hosts*, que nos permite **redirigir un nombre de host a una dirección IP diferente**, una solución temporal perfecta que nos permite evitar tener que parchear el programa o hacer **hooking** (inyección de código) en las funciones de red. Añadiendo una nueva entrada, podemos redirigir el nombre de dominio a *cualquier* servidor que queramos, en nuestro caso el *localhost*:

<br>

<div id="code-0" class="collapsible-hide">Presiona para mostrar el código</div>

<div id="code-0-data" class="content-hide" markdown="1">
{% highlight conf %}
127.0.0.1 hg.arika.co.jp
{% endhighlight %}
</div>

<br>

Con este pequeño cambio, todas las llamadas al servidor bajo ese dominio van a tener el nombre de host reemplazado con localhost, mientras el número de puerto y el resto de la URL quedarán intactos. Esto nos va a permitir implementar nuestro propio servidor como un reemplazo *in-situ*, siempre y cuando mantengamos la estructura del original, así que vamos a eso.

<br>

# Creando un servidor
Para el desarrollo de la reimplementación del servidor voy a usar **Node.js**, ya que lo uso prácticamente todos los días, pero una vez que esté todo terminado, también voy a portear el código del servidor a **C** usando alguna librería de redes para que sea más nativo y simple de usar. Además, voy a estar usando **Express.js** para que el enrutamiento y demás operaciones sean más fáciles de manejar, así que empecemos con un servidor sencillo:

<br>

<div id="code-1" class="collapsible-hide">Presiona para mostrar el código</div>

<div id="code-1-data" class="content-hide" markdown="1">
{% highlight js %}
const express = require('express');
const app = express();
const port = 8081;

app.get('/', (req, res) => {
  res.statusCode = 200;
  res.send();
});

app.listen();
{% endhighlight %}
</div>

{: .center-text }
Esto solo devuelve un 'OK' como respuesta.

<br>

Esto nos debería permitir pasarnos el error de DNS y finalmente poder ver que es lo que el programa le está pidiendo al servidor. Vamos a volver a monitorear los paquetes con Wireshark (usando ahora el **adaptador de tráfico loopback**, de otra manera no vamos a poder capturar desde localhost) y ver como reacciona el juego:

<br>

![](/assets/images/posts/recreating-a-server-for-a-dead-online-single-player-game-jewelry-master/02.png){: .center-image }

{: .center-text }
Bueno, eso fue fácil.

<br>

Supongo que ya está. Sucede que al juego no le importa un carajo el servidor después de todo, y **puede funcionar perfectamente sin ninguna funcionalidad implementada**. En este estado, todo funciona menos el mensaje de texto (la parte con el HTML roto), la escritura y lectura de puntuaciones y el sistema de repeticiones, pero en su esencia es de otra manera completamente jugable. Si bien el juego ya es funcional en el estado actual, ahora ya es momento de comenzar a implementar todas las funcionalidades del servidor *una por una*.

<br>

# Reimplementando el servidor
Si analizamos los resultados de Wireshark podemos ver múltiples peticiones al servidor cuyos puntos de enrutamiento no pueden ser encontrados, todos ellos sobre la ruta `/JM_test/service/`:

<br>

![](/assets/images/posts/recreating-a-server-for-a-dead-online-single-player-game-jewelry-master/03.png){: .center-image }

{: .center-text }
Como podemos ver por los parámetros de consulta, el cliente no encripta la información que envía, facilitando bastante nuestro trabajo.

<br>

Podemos usar esta información (junto a las cadenas de texto dentro del ejecutable) para saber que *puntos de enrutamiento* tenemos que implementar en nuestro servidor, y analizar como el cliente maneja la información que espera recibir (o simplemente adivinar) para finalmente comprender cómo funciona todo. Suena bien en teoría, pero veamos lo que cuesta ponerlo en práctica.

<br>

<div id="code-2" class="collapsible-hide">Presiona para mostrar el código</div>

<div id="code-2-data" class="content-hide" markdown="1">
{% highlight slim %}
GET     /JM_test/service/GameEntry
GET     /JM_test/service/GetMessage
GET     /JM_test/service/GetName
GET     /JM_test/service/GetRanking
GET     /JM_test/service/GetReplay
POST    /JM_test/service/ScoreEntry
{% endhighlight %}
</div>

{: .center-text }
Listado de todas las peticiones hechas por el programa.

<br>

Comencemos sacándonos de encima el más simple de todos, `GetMessage`, devolviendo una cadena de texto:

<br>

<div id="code-3" class="collapsible-hide">Presiona para mostrar el código</div>

<div id="code-3-data" class="content-hide" markdown="1">
{% highlight js %}
app.get('/JM_test/service/GetMessage', (req, res) => {
  res.statusCode = 200;
  res.send('Hello World!');
});
{% endhighlight %}
</div>

<br>

![](/assets/images/posts/recreating-a-server-for-a-dead-online-single-player-game-jewelry-master/04.png){: .center-image }

{: .center-text }
Me siento muy afligido por haber desperdiciado esta oportunidad **perfecta** para escribir alguna frase graciosa en lugar de un simple `Hola Mundo!`, pero soy una persona adulta y debo comportarme como tal.

<br>

La función que más se llama de todas es `GameEntry`, la cual asumo que es para la **autenticación de usuario**, usada para iniciar sesión, obtener las puntuaciones y comenzar una partida. Estos días uno esperaría un token encriptado siendo transferido seguramente hacia el servidor, pero en este caso solo tenemos los parámetros de consulta `id` y `pass`. También hay un parámetro `game`, siempre con el valor `0`, y uno `ver`, para asegurarse de que el cliente está siempre actualizado.

Este es el punto en el cual tenemos que empezar a pensar sobre armar una base de datos para almacenar la información de usuario (y más adelante también las puntuaciones). Para esto voy a usar **MongoDB** con **Mongoose** para el modelado (porque prefiero morir antes que usar **SQL**), aunque cualquier otro motor de base de datos debería funcionar. Así que asumiendo un modelo con los campos `id`, `pass` y `rankings` (para puntuaciones personales), una implementación completa sería así:

<br>

<div id="code-4" class="collapsible-hide">Presiona para mostrar el código</div>

<div id="code-4-data" class="content-hide" markdown="1">
{% highlight js %}
app.get('/JM_test/service/GameEntry', (req, res) => {
  res.statusCode = 200;
  User.findOne({ id: req.query.id, pass: req.query.pass }, (e, user) => {
    // Comprobar si el usuario existe y las credenciales son correctas.
    if (user) { res.send(); }
    // Comprobar si ya existen usuarios con el mismo id y crear uno si se permite.
    else if (req.query.id.length > 0 && options.register) {
      User.findOne({ id: req.query.id }, (e, exists) => {
        if (!exists) {
          // Guardar nuevo usuario en la base de datos.
          const user = new User({ id: req.query.id, pass: req.query.pass, rankings: [] });
          user.save(); res.send();
        // Un usuario con este id ya existe.
        } else { res.send('1'); }
      });
    // Nombre de usuario o contraseña incorrectos.
    } else { res.send('1'); }
  });
});
{% endhighlight %}
</div>

<br>

Este código no implementa ninguna medida de seguridad, ya que eso está fuera del alcance de este proyecto. En un servicio en línea real (por si alguien quiere hacer eso), este comportamiento probablemente deba cambiarse, o al menos no guardar las contraseñas como texto plano. Aparte de eso, añadí una propiedad `register` en un objeto de opciones, que permite que los usuarios se registren desde el cliente mismo si el `id` no concuerda con ningún resultado en la base de datos. Además, habrás notado el retorno del valor `1` como mensaje de error si el inicio de sesión falla. Después de investigar un poco, descubrí que ésta es la respuesta necesaria para activar el mensaje de *'id o contraseña incorrectos'* en el cliente, en adición al código `10` para el error de conexión con el servidor y otro más que no pude encontrar para activar el error de versión del cliente.

Siguiente tenemos a la llamada `GetRanking`, la cual tal vez sea la última parte de retroingeniería que tengamos que hacer, ya que ninguno del resto de los puntos de enrutamiento requieren datos formateados especialmente como respuesta. Los parámetros de consulta son `id` (id de usuario, el cual puede ser opcional), `mode` (dificultad), que puede ser `0` (normal), `1` (difícil) o `2` (muerte), y un parámetro `view` para determinar entre puntuaciones de usuario o globales. Antes de continuar, veamos como se estructuran y clasifican las puntuaciones, y cuál es la respuesta del cliente hasta ahora.

Las puntuaciones se clasifican en dos grupos principales: **puntuaciones personales** y **puntuaciones globales**, y cada una está clasificada a su vez dependiendo de la dificultad, dando un total de **6** listas de puntuaciones. La diferencia principal entre ambas es que las personales pueden almacenar hasta 10 entradas en cada tabla sin guardar repeticiones, mientras que las globales pueden contener una cantidad indefinida de entradas con repeticiones, pero solo una por usuario. Las puntuaciones, tanto personales como globales, contienen los siguientes campos: `id` (id de usuario, dueño de la entrada), `mode`, `score`, `jewel`, `level`, `class` (*asumo* que es el título del jugador) y `time` (también hay un campo `date` dentro del juego, pero aparentemente nunca se llegó a implementar). Estos campos también son enviados por el cliente en la llamada de `ScoreEntry`, por lo que podemos crear un modelo de base de datos a partir de estos.

<br>

![](/assets/images/posts/recreating-a-server-for-a-dead-online-single-player-game-jewelry-master/05.png){: .center-image }

{: .center-text }
Parece que el juego intenta usar la página HTML 'no encontrada' que Express.js envía automáticamente.

<br>

Esto me llevó un par de horas para entenderlo, pero así es como funciona el formato de de las puntuaciones: cada objeto de puntuaciones es una cadena de texto de 10 líneas, y un grupo de ellas se delimitan con un caracter de punto (.). Las primeras dos líneas indican el **índice de tabla** y el **id de la puntuación**, y los siguientes son (en orden) el `id` (de usuario), `score`, un **valor sin usar**, `level`, `class`, `time`, `jewel` y finalmente una **bandera de resaltado**. Los primeros dos valores solo son útiles para las puntuaciones globales, ya que el primero se usa para indicar la posición inicial de la puntuación del usuario en las puntuaciones globales (y para obtener el índice de `Mi Récord`), y el segundo es un valor (asignado por el servidor) para identificar y pedir una repetición con `GetReplay`. El valor de `class` (de vuelta, asumiendo que es el título de jugador) puede ser `101`, `102`, `201`, `202`, `301`, `302` y `303`, y la bandera de resaltado colorea las puntuaciones de amarillo, aunque no sé bajo qué condiciones una puntuación debería ser marcada con ésta (nuevamente, voy a asumir que su uso intencionado es el de marcar la puntuación más alta del usuario en una tabla).

La mejor parte es que cada objeto de puntuaciones tiene que tener *exactamente* 10 líneas, una más o una menos y el cliente se cuelga. Casualmente sucede que la respuesta por defecto de Express.js también tiene 10 líneas, funcionando perfectamente como un objeto de puntuaciones válido. Esto fue la clave para entender por qué el programa se colgaba cuando cambiaba la respuesta, y eventualmente me ayudó a comprender el formato. La implementación completa:

<br>

<div id="code-5" class="collapsible-hide">Presiona para mostrar el código</div>

<div id="code-5-data" class="content-hide" markdown="1">
{% highlight js %}
app.get('/JM_test/service/GetRanking', (req, res) => {
  res.statusCode = 200;
  // Administrar las puntuaciones personales.
  if (req.query.id && req.query.view == '0') {
    User.findOne({ id: req.query.id }, (e, u) => {
      let ranks = [];
      // Ordenar las puntuaciones de forma descendente.
      let rankings = u.rankings.sort((a, b) => b.score - a.score);
      for (let r of rankings) {
        // Construir una cadena de respuesta.
        let lit = (r == 0) ? 1 : 0;
        let rank = `0\n0\n${r.id}\n${r.score}\n0\n${r.level}\n0\n${r.time}\n${r.jewel}\n${lit}`;
        // Añadir puntuaciones para el modo seleccionado.
        if (req.query.mode == r.mode) { ranks.push(rank); }
      }
      // Responder con las cadenas concatenadas.
      res.send(ranks.join('.'));
    });
  // Administrar las puntuaciones globales.
  } else {
    // Ordenar las puntuaciones de forma descendente.
    Ranking.find({ mode: req.query.mode }).sort({ score: -1 }).exec((e, r) => {
      if (r.length > 0) {
        let ranks = [], f = -1;
        // Asignar el índice de la tabla de puntuaciones.
        let index = req.query.view == '-1' ? 0 : req.query.view;
        if (req.query.id) {
          // Encontrar el índice de posición de la puntuación en la tabla.
          f = r.findIndex((v) => v.id == req.query.id);
          if (f != -1) { index = Math.floor(f / 10); }
        }
        // Rellenar la tabla de puntuaciones de 10 ranuras.
        for (let i = (index * 10); i < (index * 10 + 10); i++) {
          if (!r[i]) { break; }
          // Construir una cadena de respuesta.
          let lit = (i == f) ? 1 : 0;
          ranks.push(`${index}\n${r[i]._id}\n${r[i].id}\n${r[i].score}\n0\n${r[i].level}\n${r[i].class}\n${r[i].time}\n${r[i].jewel}\n${lit}`);
        } res.send(ranks.join('.'));
      } else { res.send(); }
    });
  }
});
{% endhighlight %}
</div>

<br>

Pero para poder **ver** las puntuaciones, primero tenemos que ser capaces de **guardarlas**. Así que ahora es momento de añadir una ruta para la llamada de `ScoreEntry`, la cual a diferencia del resto, es la única petición `POST` de todas. A pesar de esto, toda la información de la puntuación se transmite a traves de parámetros de consulta, ya que el cuerpo se usa para enviar los **datos de repetición**. No voy a entrar en los detalles del código ya que es bastante largo y simplemente guarda la información recibida, pero cabe mencionar que el servidor se encarga de administrar las puntuaciones y repeticiones adecuadamente, actualizando y reemplazando las entradas cuando sea necesario. Además implementé una opción `multiscores`, para permitir múltiples entradas por usuario en las puntuaciones globales, y posibilitar así el almacenamiento de múltiples repeticiones. Los datos son enviados como un objeto `application/octet-stream` envuelto en una petición `multipart/form-data`. Si bien Express.js incluye una función para enviar datos adjuntos (descarga), no puede recibir/guardar (subir) este tipo de peticiones, para lo cual voy a usar el middleware **Multer** y dejar que se encargue de eso.

<br>

![](/assets/images/posts/recreating-a-server-for-a-dead-online-single-player-game-jewelry-master/06.png){: .center-image }

{: .center-text }
Debo decir que son muy buenas puntuaciones para solo una sesión de pruebas.

<br>

Y ahora que ya tenemos las repeticiones guardadas en el servidor, podemos enviarlas a petición del cliente. Implementar `GetReplay` es muy sencillo (recordemos que tenemos control sobre el valor de id, enviado con `GetRanking`):

<br>

<div id="code-6" class="collapsible-hide">Presiona para mostrar el código</div>

<div id="code-6-data" class="content-hide" markdown="1">
{% highlight js %}
app.get('/JM_test/service/GetReplay', (req, res) => {
  res.download(path.resolve() + '/rep/' + req.query.id + '.rep');
});
{% endhighlight %}
</div>

{: .center-text }
Las repeticiones están almacenadas en la carpeta `rep` con la extensión `.rep`.

<br>

Finalmente, por último y mucho menos importante, la llamada `GetName`, para la cual no pude encontrar ningún uso.

<br>

# Porteando el servidor
Ahora que ya tenemos el servidor de Node.js listo con todas las funcionalidades implementadas, es momento de pasarnos al *lado oscuro*, un lugar al cual no le desearía estar ni a mi peor enemigo, hacer un servidor web en ***El Lenguaje de Programación C™***. Para esta tarea masoquista, me voy a ayudar con el **Servidor Web Mongoose** (no confundir con el anterior Mongoose para el modelado de base de datos), una libraría de C diseñada para crear pequeños servidores en dispositivos embebidos, y **LMDB**, una base de datos *llave-valor* (en contraste al modelo basado en *documentos* de Mongo) muy liviana y rendidora. Otras librerías que voy a utilizar incluyen **[mjson](https://github.com/cesanta/mjson)** (por los desarrolladores de Mongoose) para leer y escribir los objetos en la base de datos y las estructuras JSON enviadas por el cliente, e **[ini](https://github.com/rxi/ini)** (muy descriptivo) para leer el archivo de configuración del servidor. No voy a explicar en detalle la implementación en C (a menos que me quieras escuchar quejándome sobre errores de asignación de memoria y la cagada que es manipular *objetos* y *texto*, perdón, ***estructuras*** y ***arrays de caracteres terminados en valor nulo*** en C) ya que es básicamente lo mismo conceptualmente a lo que ya vimos con Node.js, y el código es como cuatro veces más largo. Si querés podes ir y verlo en la página de [GitHub](https://github.com/Hipnosis183/JM-Server).

Sin embargo, sí voy a hablar sobre la nueva adición en esta versión, específicamente la **inyección de DLLs** y **hooks (enganches) de funciones de redes**. Hasta ahora estuvimos editando el archivo de hosts de Windows para redirigir todas las llamadas del cliente hacia nuestro servidor local, ¿pero no sería genial no tener que hacer eso?. Además, sería ideal poder iniciar con el servidor de fondo mientras se ejecuta el cliente, y detenerlo cuando el proceso de éste se termine, dando así una experiencia más transparente. De la misma manera, también queremos algo de flexibilidad, así podemos usar estos hooks para conectarnos a otros servidores, tanto en C como en Node.js, de forma local o a través de internet, así que vamos a ello.

<br>

# Inyectando los hooks
De las *mil maneras* que hay para inyectar DLLs y hacer hooks de funciones del sistema, voy a usar un método de inyección que ya tenía hecho de otro proyecto, y el conocido **MinHook** como librería de hooking. Así que veamos qué es lo que tenemos que enganchar abriendo **Ghidra** y mirando las importaciones en el ejecutable del cliente:

<br>

![](/assets/images/posts/recreating-a-server-for-a-dead-online-single-player-game-jewelry-master/07.png){: .center-image }

<br>

De todas las librerías, la única que nos interesa es **WinINet** (`wininet.dll`), una API de redes del sistema para manejar todas las operaciones de comunicación a través de HTTP y FTP. Como lo único que queremos hacer es redirigir las llamadas al servidor, las únicas funciones que nos interesan son `InternetOpenUrlA` para todas las peticiones `GET`, e `InternetConnectA`, la cual es necesaria para que `ScoreEntry` abra la conexión antes de pedir la URL. Para implementar los hooks, inicializamos MinHook en `DllMain` y apuntamos a las funciones de desvío, las cuales van a modificar el nombre del host con la dirección que le demos, y finalmente devolver el flujo de ejecución a la función original con el parámetro modificado.

<br>

<div id="code-7" class="collapsible-hide">Presiona para mostrar el código</div>

<div id="code-7-data" class="content-hide" markdown="1">
{% highlight cpp %}
// Definir punteros hacia las funciones originales.
typedef int (WINAPI *INTERNETCONNECTA)(HINTERNET, LPCSTR, INTERNET_PORT, LPCSTR, LPCSTR, DWORD, DWORD, DWORD_PTR);
INTERNETCONNECTA fpInternetConnectA = NULL;
typedef int (WINAPI *INTERNETOPENURLA)(HINTERNET, LPCSTR, LPCSTR, DWORD, DWORD, DWORD_PTR);
INTERNETOPENURLA fpInternetOpenUrlA = NULL;

// Definir funciones para sobrescribir las originales.
int WINAPI dInternetConnectA(HINTERNET hInternet, LPCSTR lpszServerName, INTERNET_PORT nServerPort, LPCSTR lpszUserName, LPCSTR lpszPassword, DWORD dwService, DWORD dwFlags, DWORD_PTR dwContext) {
  // Cambiar el nombre de host original con la dirección IP configurada.
  return fpInternetConnectA(hInternet, (LPCSTR)HOSTNAME, nServerPort, lpszUserName, lpszPassword, dwService, dwFlags, dwContext);
}
int WINAPI dInternetOpenUrlA(HINTERNET hInternet, LPCSTR lpszUrl, LPCSTR lpszHeaders, DWORD dwHeadersLength, DWORD dwFlags, DWORD_PTR dwContext) {
  // Cambiar el nombre de host original con la dirección IP configurada.
  char buf[200]; int ofs = 21; snprintf(buf, 200, "http://%s%s", HOSTNAME, lpszUrl + ofs);
  return fpInternetOpenUrlA(hInternet, buf, lpszHeaders, dwHeadersLength, dwFlags, dwContext);
}

BOOL WINAPI DllMain(HMODULE hModule, DWORD fdwReason, LPVOID lpReserved) {
  switch (fdwReason) {
    case DLL_PROCESS_ATTACH:
      // Inicializar MinHook.
      MH_Initialize();
      // Hacer hook a InternetConnect() y InternetOpenUrl() para redirigir las llamadas al servidor hacia localhost.
      MH_CreateHookApiEx(L"wininet", "InternetConnectA", &dInternetConnectA, (LPVOID *)&fpInternetConnectA, NULL);
      MH_CreateHookApiEx(L"wininet", "InternetOpenUrlA", &dInternetOpenUrlA, (LPVOID *)&fpInternetOpenUrlA, NULL);
      MH_EnableHook(&InternetConnectA);
      MH_EnableHook(&InternetOpenUrlA); break;
    case DLL_THREAD_ATTACH: break;
    case DLL_THREAD_DETACH: break;
    case DLL_PROCESS_DETACH:
      // Desactivar hooks y cerrar MinHook.
      MH_DisableHook(&InternetConnectA);
      MH_DisableHook(&InternetOpenUrlA);
      MH_Uninitialize(); break;
  } return TRUE;
}
{% endhighlight %}
</div>

{: .center-text }
Prestarle atención a la variable global `HOSTNAME`, la cual va a almacenar la dirección asignada en el archivo de configuración `server.ini`. No voy a mostrar la carga de las opciones para ser breve.

<br>

Para terminar con esta parte, quisiera mencionar que también intenté hacer un hook para la librería de `Direct3D 9` para forzar el modo de la ventana a pantalla completa, pero me encontré con varios problemas. Pasa que, como se puede apreciar en las importaciones, no hay rastro de `d3d9.dll`. Eso es porque el programa delega todas las funcionalidades del juego (video, audio, controles, desempaquetamiento de datos, etc.) a la librería `Skeleton.dll`, la cual es cargada con `LoadLibraryA` una vez que el programa se ejecuta. Debido a la forma en la que funciona MinHook (y cualquier otra librería de hooking), es necesario que el DLL ya esté cargado en memoria para poder obtener su dirección y realizar el hook. Eso no debería ser un problema si creamos un hook para `LoadLibraryA` y dentro de este crear un nuevo hook después de que ya se haya cargado el DLL, ¿verdad?. Si bien esto debería ser así (bueno, supongo), MinHook devulve un error de inicialización cuando intenta activar el hook, a pesar de que es capaz de crearlo perfectamente bien. Yo creo que es un error específico de MinHook, pero a estas alturas ya estoy cansado (y corto de tiempo) como para reportar el problema o cambiar de librería, y ninguna de las alternativas que encontré eran igual de fáciles de usar y pequeñas en tamaño. Supongo que será para otra ocasión.

<br>

# Configuración del servidor y uso del programa
Ahora que tanto el servidor como el hooking de librerías están completos, hablemos un poco sobre como van a funcionar desde la perspectiva del usuario. Como mencioné previamente, quería flexibilidad durante el uso del programa, para poder jugar localmente, conectarse a un servidor en línea u hospedar uno propio. Para conseguir esto diseñé **modos de servidor**, los cuales, dependiendo de cual esté seleccionado, cambiará la forma en la que se comporta el programa:

<br>

- Modo `0` es para un servidor **local para un solo jugador**, corriendo en el fondo mientras se ejecuta el cliente.
- Modo `1` es para una **conexión en línea**, desactivando la inicialización del servidor y base de datos, conectándose a la dirección especificada en el archivo de configuración.
- Modos `2` y `3` son para crear un servidor en la dirección especificada en el archivo de configuración. Uno inicia el programa del cliente, el otro una ventana de consola con información del servidor.

<br>

![](/assets/images/posts/recreating-a-server-for-a-dead-online-single-player-game-jewelry-master/08.png){: .center-image }

{: .center-text }
Un servidor funcionando en el modo en línea (`1`) conectado a otro en modo de hospedaje (`2`) en una conexión **LAN**.

<br>

También añadí una opción para deshabilitar el hooking de DLLs, ya que podría alertar a programas de anti-virus (esto va a requerir añadir una entrada en el archivo de hosts manualmente). Además de configurar la conexión, también están las opciones de usuario mencionadas anteriormente: **registro**, **múltiples puntuaciones** y **sin puntuaciones**, porque por qué no. Aparte de esto, para usar el servidor solo basta con poner los archivos en la carpeta del cliente. Hablando de este, como ya no se puede descargar de forma oficial, me tomé la libertad de subirlo a [archive.org](https://archive.org/details/jewelry-master). Este cliente es la versión `1.32`, la única guardada por la **Wayback Machine**, pero la última versión conocida es `1.40`. Si en algún momento la consigo voy a actualizar el archivo, y si no cambiaron mucho el servidor debería funcionar igual, considerando que no usa ningún parche *específicamente codificado*.

<br>

# Error de servidor: desconectando...
Esta fue, *como siempre*, una experiencia interesante. Finalmente pude trabajar en un emulador de servidor y descubrir si todas las ideas y especulaciones que siempre tuve a través de los años eran ciertas (*lo fueron*). Si bien admito que este caso en particular fue un ejemplo bastante sencillo, y no es muy representativo de emuladores de servidores en general (usualmente *mucho* más complejos), aún así fue suficiente como para responder las preguntas que tenía, y al final pude cumplir mi objetivo de **devolver un juego muerto a la vida**. Y aparte, la sensación de saber que (probablemente) sos la primera persona en experimentar un título después de más de una década no tiene precio, a pesar de que en este caso ya sé que no lo soy (otro tipo [ya intentó](https://tetrisconcept.net/threads/jewelry-master-clone-for-pc.3230/#post-64740) hacerlo hace unos años, pero nunca consiguió descubrir el formato del sistema de puntuaciones).

También estoy sorprendido por la cantidad de cosas que *simplemente funcionaron* puramente por adivinar o probar cosas, como la creación inicial del servidor y el formato de las puntuaciones, más que nunca antes. Al principio pensé que me llevaría más de una semana solamente haciendo ingeniería inversa del cliente para intentar descubrir su funcionamiento hasta cierto punto, pero en realidad solo me llevo 3-4 días incluyendo el desarrollo total del servidor en Node.js. De hecho, lo que más tiempo me llevó fue la implementación en C, casi 2 semanas. Supongo que es entendible ya que hasta ahora nunca antes había creado un programa en C desde cero (ni siquiera un *Hola Mundo*), completamente por mi cuenta. Fue un día para investigar como crear un servidor, otro para entender las asignaciones de memoria, punteros, compilar, creo que se entiende.

Al final estoy muy contento con los resultados, y espero que esto sirva como una fundación para proyectos futuros similares, porque esto es solamente el comienzo.
