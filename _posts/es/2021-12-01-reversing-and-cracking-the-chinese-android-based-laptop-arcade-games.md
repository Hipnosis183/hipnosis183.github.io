---
layout: post
language: "es"
code: "reversing-and-cracking-the-chinese-android-based-laptop-arcade-games"
title: Reversing and cracking the Chinese, Android-based, Laptop Arcade games
_title: Analizando y crackeando el dispositivo chino basado en Android, el Laptop Arcade Player
description: China is cool man.
_description: Algún día China va a dominar el mundo.
thumb: /assets/images/posts/reversing-and-cracking-the-chinese-android-based-laptop-arcade-games/thumb.jpg
readtime: 12
---

# Un poco de historia con ingeniería inversa en Android
Si bien durante estos ultimos años estuve haciendo ingeniería inversa mayormente con software para *plataformas x86*, mis primeros pasos en el arte que es la retroingeniería fueron experiencias con aplicaciones para **Android**, aproximadamente a finales de 2018 (por aquel entonces solo sabía lógica computacional y un poco de Python muy básico). Lo que me motivó fue la popularización de videojuegos en la plataforma que requerían conexión a un servidor online para comprobar licencias.

La idea es sencilla: si compraste la aplicación de la manera *legítima*, cuando es iniciada, ésta se conecta a un servidor propietario administrado por la compañía que desarrolló/publicó la aplicación para comprobar que todo esté en orden (aunque también es posible que Google ofreciera un servicio para esto, pero solo estoy especulando). Si el chequeo pasa correctamente, vas a poder jugar normalmente, pero de no ser así, aparecerá un mensaje de error que te devuelve al inicio. Para el usuario promedio esto esta bien, pero yo **no** soy el usuario promedio, soy un **pirata**, y como buen **pirata** me gusta tener mis *APKs* guardadas listas para usar.

Igualmente en una nota más seria, hay razones más importantes más allá de jugar sin pagar: **preservación**. Con este tipo de protecciones, no solamente es requerido que tengas una conexión a internet (aunque hoy en día esto ya no sea mucho problema), sino que también está la voluntad de la compañía de mantener *ESE* servidor con vida y accesible. Una vez que lo desenchufan, *el juego se fue para siempre*.

Además, la mayoría de estos videojuegos realmente no necesitan estar en línea para funcionar (algunos ni siquiera tienen funcionalidad online para nada). No estamos hablando de *MMOs* o similares, sino de videojuegos normales que justo suceden tener estas capas de protección adicional. Y tristemente, estas protecciones, si bien no son a propósito, sino por diseño, están destinadas a condenar los títulos que tanto conocemos y amamos.

Por este motivo (y por lo de la piratería, no voy a mentir), hice mi primer *salto de licencia* sin saber un carajo sobre **Dalvik** y **Java**, *y se sintió muy bien*. La víctima fue **Monster Hunter Stories**, y esta protección en particular fue fácil de saltar, ya que la aplicación nunca se detiene, sino que aparece un mensaje del sistema por encima que no te permite interactuar con el videojuego, y cierra la aplicación al confirmarlo. Con el parche, el chequeo sigue en su lugar, pero nunca aparece el mensaje de error. *Una solución elegante, ¿verdad?*

Después de esto, continué con otros títulos de **CAPCOM**, principalemente la serie **Ace Attorney**, la cual compartía una protección similar. Además de cracks, también desarrollé *desbloqueadores*, que extraían datos adicionales durante la instalación, desbloqueando así compras dentro de la aplicación sin la necesidad de usar herramientas externas como **Lucky Patcher**. Además de esto, una vez usé estas habilidades pero no para piratear, sino para *des-piratear*, eliminando pantallas de inicio o mensajes añadidos por hackers, ya que había unos cuantos títulos que no tenían APKs limpios disponibles en internet (en su mayoría aplicaciones de Android 1-4).

Al final, despues de meses aprendiendo las **técnicas** y **herramientas**, me cansé de trabajar con aplicaciones de Android, ya que parchear y documentar tantas se volvió una tarea muy pesada, además de que quería seguir adelante y hacer otras cosas. Pero solo tomaría 2-3 años para volver al tema, motivado por un *inesperado, irresistible y pequeño dispositivo chino*.

<br>

# Una serie de eventos raros y casuales
A fines de noviembre del 2021, se me dió a conocer que cierta gente había encontrado un dispositivo de videojuegos *basado en Android* para la venta por internet, del cual nadie parecía saber nada, el **Laptop Arcade Player**, el cual incluía un grupo de videojuegos muy impresionante en cuestión de calidad, hechos *exclusivamente* para esta máquina en particular (pero sí, también incluye **MAME** y unos cuantos títulos de cuestionable calidad). Impresionante considerando lo que es común para este tipo de dispositivos, que normalmente consisten de un **SoC** (sistema en chip) empaquetado con un montón de videojuegos emulados y/o baratos. Pero algunos títulos en particular destacan del montón, como **Rupture Void** y **Fighting Master Ultimate**, ya que se nota que tienen un cierto nivel de esfuerzo detrás, y todo para ser lanzados exclusivamente en este dispositivo portable en particular.

<br>

![](/assets/images/posts/reversing-and-cracking-the-chinese-android-based-laptop-arcade-games/00.png){: .center-image }

{: .center-text }
El Laptop Arcade Player y sus especificaciones.

<br>

Había visto que ciertas personas habían conseguido **extraer** los contenidos (**APKs**) de los videojuegos que incluye, pero aún había un problema: parece que existía un tipo de **protección**/**registro** durante el inicio de las aplicaciones, que no permitía continuar más allá de la pantalla con el logo del desarrollador en ningún otro dispositivo que no sea el original. Entonces me dije: *¡Eso es un trabajo para mí!*. Eventualmente me olvidé de contactar a esta gente en el momento, pero después de una semana me acordé y le envié un mensaje a **[GuileWinQuote](https://twitter.com/GuileWinQuote)**, una de las personas involucradas en este misterio, quien respondío de forma amable y dentro de la hora ya estaba listo para comenzar.

Esta es una historia que, aunque corta, es muy interesante, pero quiero poner énfasis en el aspecto de **analizar aplicaciones de Android con ingeniería inversa**. Estuve queriendo hablar sobre el tema por bastante tiempo, y esta oportunidad es la *excusa perfecta* para hacerlo.

<br>

# Analizando el problema
Ahora que tengo los archivos en mi posesión, ya puedo empezar a probarlos. Al instalar una de las aplicaciones, aparece la siguiente pantalla con un mensaje:

<br>

![](/assets/images/posts/reversing-and-cracking-the-chinese-android-based-laptop-arcade-games/01.png){: .center-image }

{: .center-text }
Traducción: **🍋 LEMON ON**. Registro no está instalado, por favor intente de nuevo después de instalar.

<br>

Esta es la *'pantalla de la muerte'*, después de aparecer la aplicación se cierra. Por ahora, podemos ver dos cosas importantes: primero, **es un mensaje del sistema y no lógica del programa**, lo cual nos hace la vida mucho más fácil, y segundo, **tenemos una cadena de texto**, lo cual nos va a ahorrar mucho tiempo en encontrar lo que estamos buscando. Esto sucede con todas las aplicaciones, por lo que es seguro pensar que todas usan la misma protección, y que la solución para una potencialmente funcione para todas.

Una cosa más antes de comenzar. solo me interesa que las aplicaciones funcionen fuera del dispositivo original, y el enfoque que voy a tomar es para cumplir solamente ese objetivo. No voy a hacer ningún análisis en cómo funciona el proceso de registro internamente ni cómo las aplicaciones interaccionan con el sistema personalizado de la máquina original. Acá solo importa circunvenir esta *'protección'*. Dicho esto, empecemos a desempaquetar esta APK.

<br>

# Descompilando la aplicación
Para los que desconocen, vamos a repasar rápidamente algunos **conceptos fundamentales**. Las aplicaciones son programadas en **Java**, lo cual se compila a bytecode de **JVM** (Máquina Virtual de Java), que luego se transforma de nuevo en bytecode de **Dalvik**, la forma final del código incluído en el APK. **Bytecode** es un conjunto de instrucciones legible por un intérprete, en este caso la **Dalvik VM** (Máquina Virtual de Dalvik), la cual se puede ver como una interfaz entre el sistema de Android y el proceso de la aplicación. A pesar de ser un intérprete, Dalvik era muy rápido, incluyendo un compilador en tiempo de ejecución **JIT** (Just-In-Time). Digo *'era'*, porque fue reemplazado por el mas eficiente **ART** (Android Runtime) en **Android 5**, aunque ambos tienen la misma estructura (Ejecutable Dalvik), y es transparente para las aplicaciones y desarrolladores. Pero el bytecode de Dalvik **no es legible por personas**, y ahí es cuando **Smali** entra en juego. El formato Smali nos permite leer el bytecode Dalvik de forma **fácil y comprensible**, pareciéndose a una mezcla entre código Java y Ensamblador. Este formato es lo que vamos a utilizar, tanto para las modificaciones como la recompilación de las APKs.

Si alguna vez descompilaste o retroingeniaste aplicaciones de Android, podrás saber que hay *muchas formas* de abordar este tema. Pero yo me voy a aferrar a la manera en que siempre hice las cosas, usando **APK-Multi-Tool**, un conjunto de herramientas de análisis en un solo paquete. Este **script** nos permite administrar todo lo que necesitamos, en nuestro caso, **descompilar**, **compilar** y **firmar** las APKs, y lo usamos particularmente por esto último, ya que no quiero meterme con el tema de las llaves y demás. El núcleo de este script es **Apktools**, el programa que maneja la descompilación/compilación y el smaling/backsmaling. Además de este script, existen otras herramientas como el **Descompilador JEB**, que descompila la aplicación a clases de Java (y aparentemente también permite recompilar la APK), pero que no voy a usar ya que no solamente no tengo experiencia con su uso, sino que ya me siento muy cómodo trabajando con código Smali/Dalvik (aunque voy a estar leyendo algo de código Java más adelante).

En una nota final, la versión de Apktools incluída con APK-Multi-Tool es *viejísima*, la última actualización siendo en 2016. Después de inspeccionar unos cuantos errores, me dí cuenta que solo necesitaba actualizar Apktools manualmente, ya que es probable que esta versión antigua no soportara algunas de las funcionalidades introducidas en nuevas versiones del **SDK Platform API** (las aplicaciones con las que estamos trabajando usan el nivel de API 28, Android 9, 2018).

Ahora adentrándonos en la descompilación en sí, después de ejecutar el script de **AMT**, nos da la bienvenida con esta hermosa interfaz de usuario:

<br>

![](/assets/images/posts/reversing-and-cracking-the-chinese-android-based-laptop-arcade-games/02.png){: .center-image }

{: .center-text }
"¡Que demonios! Toma una decisión y hazlo. No cometemos errores, solo tenemos accidentes felices."

<br>

Asusta, ¿verdad? Pero no te dejes confundir con todas esas opciones, ya que para nuestros intereses solo vamos a necesitar **4**. Pero antes que nada, tenemos que poner las APKs en la muy descriptiva carpeta `place-apk-here-for-modding` dentro del directorio de AMT. Una vez hecho esto, hay que seleccionar el proyecto con el que queremos trabajar con la opción **27**. Luego viene la descompilación, con la opción **9**. Esto va a crear el proyecto con todos los archivos y código descompilado dentro de la carpeta `projects`:

<br>

![](/assets/images/posts/reversing-and-cracking-the-chinese-android-based-laptop-arcade-games/03.png){: .center-image }

{: .center-text }
Normalmente usaríamos solo la carpeta **`smali`**, pero en algunas de estas aplicaciones también hay que modificar el archivo **`AndroidManifest.xml`**, debido a algunos problemas de compatibilidad con Apktools durante la compilación.

<br>

# Inspeccionando y crackeando el código
Ahora que tenemos el APK descompilado, ya podemos analizar el código Smali en la carpeta `smali`. Dentro, tenemos código para la aplicación en sí y otras librerías/dependencias externas, así que en este caso solo queremos explorar la primera.

<br>

![](/assets/images/posts/reversing-and-cracking-the-chinese-android-based-laptop-arcade-games/04.png){: .center-image }

{: .center-text }
Estructura de directorios del código de la aplicación.

<br>

Por lo que se puede ver, todas las aplicaciones usan el motor **Unity**, así que podemos ignorar la carpeta `unity3d` del análisis. Aparte de esto, la carpeta `registerlib` y el archivo `Verify.smali` suenan muy sospechosos (*quién lo hubiera dicho*), así que son lugares en los que definitivamente vamos a investigar.

Pero primero comencemos por buscar la cadena de texto que nos encontramos al principio, **el mensaje de error**. Encontramos un resultado en el archivo `RegisterHelper.smali`:

<br>

<div id="code-0" class="collapsible-hide">Presiona para mostrar el código</div>

<div id="code-0-data" class="content-hide" markdown="1">
{% highlight cl %}
.line 324
:cond_2
const/4 v2, 0x2 
if-ne p1, v2, :cond_3
 
.line 325
const-string v1, "Register is not installed, please try again after installation." 
goto :goto_0
{% endhighlight %}
</div>

<br>

Esta porción de código se encuentra dentro de la función `errorHandle()`, para, bueno, manejar errores. Parece haber cuatro niveles de error diferentes, pero el que nos interesa es éste, el código `0x2`. Buscando por llamadas a esta función nos da resultados dentro del mismo archivo, notablemente dentro de las funciones `launchOnlineAppRegisterFlow()` y `launchRegisterFlow()`, las cuales, si sus nombres no mienten, parecieran **inicializar el proceso de registro**.

<br>

<div id="code-1" class="collapsible-hide">Presiona para mostrar el código</div>

<div id="code-1-data" class="content-hide" markdown="1">
{% highlight cl %}
.line 145
:cond_0
const/4 v2, 0x2

invoke-direct {p0, v2}, Lcom/sencatech/registerlib/RegisterHelper;->errorHandle(I)V
goto :goto_0
{% endhighlight %}
</div>

<br>

Podemos ver que este bloque de código, al final de ambas funciones y como resultado de una condición fallida, ejecuta la función `errorHandle()` con el parámetro `v2`, un registro con el valor de `0x2`, nuestro código de error.

En este momento solamente estamos probando varias cosas, por lo que voy a **eliminar** esta llamada o *'invocación'* a la función, lo que debería deshabilitar el mensaje de error y la función `exit()`. Para **recompilar** el código modificado de nuevo a un APK, tenemos que seleccionar la opción **12** en AMT, y después firmarlo con la opción **4**. El APK final se va a generar en la carpeta `place-apk-here-for-signing` con el nombre `signed{nombre}.apk`. Bien, veamos que sucede:

<br>

![](/assets/images/posts/reversing-and-cracking-the-chinese-android-based-laptop-arcade-games/05.png){: .center-image }

<br>

Bueno, misión cumplida. *¿O lo está?*

<br>

# Llevándolo un paso mas allá
Si bien ahora las aplicaciones se ejecutan perfectamente bien, todavía podemos hacerlo mejor. Por el momento, el proceso de registro tiene lugar, pero nosotros solo deshabilitamos el manejo de errores, es decir, el mensaje de error y el cierre de la aplicación. Pero, ¿por que detenernos ahí cuando podemos **deshabilitar el proceso de registro** completamente?

Volviendo al código, teníamos las funciones `launchOnlineAppRegisterFlow()` y `launchRegisterFlow()` dentro de la clase `RegisterHelper`, las cuales contenían las llamadas al `errorHandle()`, así que veamos dónde están siendo usadas/inicializadas. Buscando por la primera no obtenemos resultados, por lo que la función *no es utilizada*. Pero la segunda aparece en dos instancias, una en el previamente sospechoso `Verify.smali` y la otra en `Senca_ServiceConnect.smali`, ambas compartiendo el mismo código:

<br>

<div id="code-2" class="collapsible-hide">Presiona para mostrar el código</div>

<div id="code-2-data" class="content-hide" markdown="1">
{% highlight cl %}
.line 14
new-instance v0, Lcom/sencatech/registerlib/RegisterHelper;
 
invoke-direct {v0, p0, p1}, Lcom/sencatech/registerlib/RegisterHelper;-><init>(Landroid/content/Context;Ljava/lang/String;)V

invoke-virtual {v0}, Lcom/sencatech/registerlib/RegisterHelper;->launchRegisterFlow()V
{% endhighlight %}
</div>

<br>

Lo que se puede traducir a Java como:

<br>

<div id="code-3" class="collapsible-hide">Presiona para mostrar el código</div>

<div id="code-3-data" class="content-hide" markdown="1">
{% highlight java %}
new RegisterHelper(context).launchRegisterFlow();
{% endhighlight %}
</div>

<br>

Este bloque de código está efectivamente **creando una nueva instancia** de la clase `RegisterHelper`, y no solamente inicializandola, sino también ejecutando la función `launchRegisterFlow()`. Así que si eliminamos estas inicializaciones de clase, si bien obtendríamos el mismo resultado de antes, ahora deberíamos **evitar completamente el proceso de registro**, en lugar de simplemente dejarlo fallar.

<br>

![](/assets/images/posts/reversing-and-cracking-the-chinese-android-based-laptop-arcade-games/06.png){: .center-image }

{: .center-text }
Funciona exactamente igual.

<br>

¿Es realmente necesario? No, *para nada*, pero tal vez sea más correcto, y al final decidí tomar este camino para los parches finales.

Una nota antes de finalizar, ésta es solo una forma de hacer las cosas, ya que hay muchos caminos y soluciones a un mismo problema. Sucede en la programación, y la ingeniería inversa hereda estas propiedades.

<br>

# Algunas conclusiones
Después de volver a experimentar con la retroingeniería de aplicaciones de Android, puedo entender como hace 3 años, con *muy poca* experiencia programando, me las arreglé para modificar y crackear aplicaciones. El proceso de modificación y recompilación no es nada en comparación con programas de **Windows** y **Linux**, más allá del nivel técnico. Aunque debo decir que la experiencia adicional ayuda y acelera **mucho** las cosas (por ejemplo, lo de **MHS** me llevó alrededor de dos días, mientras que esto solo 20 minutos, y los dos son básicamente lo mismo).

El hecho de que las aplicaciones de Android ejecuten bytecode en una máquina virtual hace mucho más fácil de comprender lo que esta pasando, especialmente con Dalvik/Smali, que son de **muy alto nivel** (comparado con Ensamblador e incluso código recompilado en ciertos casos), y heredan muchas propiedades de **Java** y **POO**, como **clases** y **objetos**.

Dentro de todo, es divertido e interesante a su manera, aunque no puedo decir que también es necesariamente desafiante, o al menos no en este tipo de retroingeniería, *saltar protecciones*. Igualmente, al final los resultados son tan satisfactorios de ver como siempre.

<br>

# Un vistazo rápido a las aplicaciones
Ahora que tenemos estos títulos, eh..., *especiales* (a falta de una palabra mejor), y ahora son ejecutables en nuestro emulador favorito de preferencia, **sería una lástima no hacerles una cobertura**, al menos a los títulos más importantes. Recordá que éstos fueron desarrollados *exclusivamente* para este dispositivo.

Comenzando con los más destacados, y la razón por la cual la gente se interesó en esta máquina en primer lugar, es el videojuego de peleas **Rupture Void**, y su contraparte beat 'em up, **Fury Fight**. Mientras que este último es un beat 'em up decente aunque bastante genérico, la parte interesante se encuentra en el primero. Si bien todos los personajes, gráficos e historia son *completamente originales* en ambos títulos, toda la música y efectos de sonido fueron *'tomados prestado'* de otros videojuegos. Con solo escuchar los **primeros 2 segundos** ya detecté **3 efectos de sonido robados**. Pero aún más importante, mientras la jugabilidad es decente, la IA está **rotísima**.

El otro videojuego de peleas, **Fighting Master Ultimate**, brilla por lo malo que es, siendo una mezcla entre horrible pero impresionante al mismo tiempo, tomando prácticamente todo de la serie **Street Fighter**, incluyendo arte, movimientos, animaciones y audio. *Verdaderamente un privilegio poder verlo en acción*.

<br>

![](/assets/images/posts/reversing-and-cracking-the-chinese-android-based-laptop-arcade-games/07.png){: .center-image }

{: .center-text }
H A C K E R

<br>

Por último, tal vez el más *civilizado* de todos es **Steam Gear**, muy similar al clásico **Metal Slug**.
Si bien no es nada de otro mundo, tiene un buen aspecto visual y se juega bien, con contenido completamente original.

Antes de terminar esta sección, quisiera destacar el título mas interesante para mí (y que se mostró primero en el artículo), **Conspiracy Genius of Three Kingdoms**, por ser un **port para Android** de un título **exclusivo de iOS** ([AppStore](https://apps.apple.com/us/app/id1487807886)), desarrollado (y **traducido al inglés**) *de forma exclusiva, solo para este dispositivo en particular*.

<br>

# La búsqueda de consolas chinas basadas en Android puede continuar
Si bien permanecimos *victoriosos* frente al **Laptop Arcade Player**, aún hay un ejército (*juro* que todavía no toque el **3 Kingdoms**) de consolas baratas basadas en Android ahí afuera. Tal vez no muchas con este nivel de calidad de software, pero quién sabe cuándo podrá aparecer otra *maravilla* con un catálogo semejante. Y si eso llegase a pasar en el futuro, estoy listo para ayudar a la causa.

Quiero agradecer a todas las personas en la **FGC** que descubrieron este dispositivo tan interesante, y uno especial a **[GuileWinQuote](https://twitter.com/GuileWinQuote)** que gastó **$150 dólares** en esta cosa y se las arregló para extraer las aplicaciones, haciendo de todo esto posible. También hizo un video sobre el tema en [YouTube](https://www.youtube.com/watch?v=pFzAJj8eGPs), así que asegurate de darle una visita si querés saber más sobre la historia del Laptop Arcade.

<br>

**中國萬歲！**
