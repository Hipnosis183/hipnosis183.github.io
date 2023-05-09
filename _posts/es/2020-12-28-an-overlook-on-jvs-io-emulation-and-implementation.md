---
layout: post
language: "es"
code: "an-overlook-on-jvs-io-emulation-and-implementation"
title: An overlook on JVS I/O emulation and implementation
_title: Explorando la emulación de E/S de JVS y su implementación
description: How we get to run PC-based arcade software at home, and expanding on what already exists.
_description: Cómo conseguimos correr software arcade basado en PC en casa, y expandiendo sobre lo ya existente.
thumb: /assets/images/posts/an-overlook-on-jvs-io-emulation-and-implementation/thumb.jpg
readtime: 18
---

# Introducción
Ya van casi dos décadas que los PCs se convirtieron en una plataforma viable para arcades, y el gran éxito de la **Type X** de **Taito** ya lo dejó por sentado para jamás regresar a las placas tradicionales. Las razónes logísticas son sencillas, componentes comunes de producción en masa son mucho más baratos y simples de dar soporte y reponer, reduciendo los costos considerablemente. No solamente esto, sino que el software sería mucho más fácil y accesible de desarrollar como nunca antes, ya que la arquitectura de la plataforma no solamente ya es muy conocida, sino que también más estandarizada. Los *arcades basados en PC* tienen el potencial de abrirle las puertas a una mayor cantidad de desarrolladores de software.

La única contra debe ser la piratería y el *bootlegging*, y si bien esto siempre fue un problema en la comunidad arcade, ahora puede volverse peor, ya que los PCs, así como es más simple desarrollar para ellos, también es igual de sencillo crackear protecciones y desencriptar información. Estos forman parte de la capa que nos impide ejecutar el software en PCs normales, en conjunto con los *dispositivos de E/S* (entrada y salida).

<br>

# Un poco de historia
Si bien existen muchas plataformas arcades basados en PC que fueron apareciendo con el tiempo, siendo hoy en día todavía la norma, solo me voy a enfocar en dos máquinas de hardware en específico y su software: **Taito Type X** y **Examu eX-BOARD**, una fue *clásica*, la otra un *fracaso*, pero ambas fueron pioneras en el movimiento de arcades basados en PC.

Esta historia tiene lugar por el 2009-2011 (no recuerdo exactamente), cuando *dumps* (copias/extracciones) de datos de la mayoría de los títulos de Type X, algunos de **X2**, y todos los de eX-BOARD fueron publicados en foros arcade. Estos datos estaban desprotegidos, lo que significó que no era necesario ningún dispositivo o chequeo de seguridad para que los juegos funcionen. No puedo recordar si el emulador de E/S también fue lanzado al mismo tiempo, pero seguro que apareció al poco tiempo. Este primer *loader* (cargador) simplemente hacía eso, emular el dispositivo de E/S, de manera que eliminaba el último obstáculo que impedía que el software funcionara sin que aparezca una pantalla de `I/O ERROR` (I/O es inglés para E/S).

Un tiempo después, **Romhack** reconstruyó este cargador en el *emulador de Type X de código abierto*, **ttx_monitor**, y más tarde en base a éste, la *variante de eX-BOARD*, **xb_monitor**. Más adelante también hizo una *variante de Cave-PC*, **cv_monitor**, pero hasta donde sé nunca liberó el código. Los emuladores de Romhack se convirtieron en los que todos usaban durante mucho tiempo, haste que recientemente aparecieron nuevas alternativas, como **JConfig** y **TeknoParrot**, y si bien éstos emulan muchos más dispositivos de E/S de otras máquinas, los núcleos de Type X y eX-BOARD están hechos en base a los emuladores de Romhack. Ahora inclusive yo entré en la tendencia, y desarrollé *versiones mejoradas* tanto de ttx_monitor como de xb_monitor, **TTX-Monitor+** y **XB-Monitor+** respectivamente.

<br>

# Qué esperar
Primero, vamos a echarle un vistazo a la protección del software en un alto nivel, después veremos el hardware (y **JVS** en general), cómo emularlo, analizar la implementación de Romhack y construir sobre lo existente, añadiendo funcionalidades y mejoras de calidad de vida.

Como no tengo ningún arcade, desconocía cierta terminología básica como **JAMMA**, y todavía lo hago un poco, por lo que mis únicas fuentes de información fueron la documentación de JVS original y el código de Romhack, además de *experimentar* por mi cuenta con el software que usan estos dispositivos. Aún así, creo que fue suficiente como para comprender como funciona todo, de ahí el énfasis en lo de *alto nivel*. Dicho esto, este artículo tal vez sea informativo solo para gente casual que no está muy involucrada en el tema, y no te sorprendas si hay información errónea o inexacta presente durante la lectura.

<br>

# Protección en todo su esplendor
Algunas máquinas antiguas han implementado protecciones bastante *complejas*, incluso al nivel de hardware, como chips o baterías suicidas. Pero por suerte en este caso no tenemos nada de esa protección kamikaze, sino un simple *chequeo de dongle* (llave) a través de USB, pero veámoslo en mayor detalle. El disco duro tiene dos particiones:

<br>

![](/assets/images/posts/an-overlook-on-jvs-io-emulation-and-implementation/00.png){: .center-image }

{: .center-text }
Imagen de disco duro clonado de **Chaos Breaker**.

<br>

La primera tiene una instalación de `Windows XP Embedded`, un *cargador/lanzador* de Type X y una *imagen de disco virtual* con los datos del juego.

<br>

![](/assets/images/posts/an-overlook-on-jvs-io-emulation-and-implementation/01.png){: .center-image }

{: .center-text }
La raíz de la partición **C:**, el contenido de la carpeta **TypeXsys** y al final la imagen de disco encriptada dentro de la carpeta **data** con los datos del juego. Además, **yes.txt**.

<br>

El cargador se encarga de hacer chequeos de hardware (dongle, disco duro, particiones) y si todo está en orden, se devuelve una llave que desencripta el archivo de imagen de disco, siendo posible correr el programa. Una vez ejecutado, chequea por un **dispositivo JVS de E/S** válido en el **puerto COM2**. Si está presente, el juego continúa normalmente, y sino, aparece el *error de placa de E/S*.

<br>

![](/assets/images/posts/an-overlook-on-jvs-io-emulation-and-implementation/02.png){: .center-image }

{: .center-text }
Pantalla de error de E/S en **Trouble Witches** y **GigaWing Generations**, respectivammente.

<br>

También está la segunda partición, que almacena toda la configuración y datos del juego. La razón por la cual supongo que esto es así es que la primera partición podría ser de *solo lectura*, o por lo menos no se escribe nada ahí.

<br>

![](/assets/images/posts/an-overlook-on-jvs-io-emulation-and-implementation/03.png){: .center-image }

{: .center-text }
Una partición solo para esto.

<br>

En el caso de los juegos de eX-BOARD, estos fueron distribuídos en **cartuchos IDE**, siendo solo esto protección suficiente. O por lo menos eso es lo que pensó Examu, ya que fue crackeada al poco tiempo. A falta de mayor documentación sobre esta protección, observando el código de xb_monitor podemos ver un **hook** (inyección de código) en la librería `IpgExKey.dll`, función `_GetKeyLicense@0`:

<br>

<div id="code-0" class="collapsible-hide">Presiona para mostrar el código</div>

<div id="code-0-data" class="content-hide" markdown="1">
{% highlight cpp %}
BOOL APIENTRY HookFunctions() {
  // Hook de funciones de eX-BOARD.
  HGetKeyLicense = HookIt("IpgExKey.dll", "_GetKeyLicense@0", Hook_GetKeyLicense);
}

INT APIENTRY Hook_GetKeyLicense(VOID) { return 1; }
{% endhighlight %}
</div>

{: .center-text }
Hook de funciones en XB-Monitor+.

<br>

Cargando el DLL en **Ghidra**, podemos ver todas las funciones exportadas, siendo `GetKeyLicense` una de ellas:

<br>

![](/assets/images/posts/an-overlook-on-jvs-io-emulation-and-implementation/04.png){: .center-image }

<br>

Creo que es seguro asumir a partir de su nombre que maneja el *chequeo de protección*, por lo que al develover siempre *verdadero* es suficiente para saltárselo. Ahora que tenemos los datos desencriptados y la protección crackeada, lo único que nos queda es el dispositivo de E/S.

<br>

# Dispositivo de comunicación
La placa JVS tiene la funcionalidad de E/S en una *placa separada*, la cual tiene un conector JAMMA para los controles, y un conector de **CN2** a **USB**, para transferir datos entre la **placa de E/S principal** y la **placa TAITO de E/S secundaria** dentro de la propia Type X. Más allá de la conexión física por USB, se utiliza el **protocolo JVS** para la transferencia de datos a través de una transmisión serial **RS-485**. La placa secundaria está conectada al puerto COM2 en la placa madre, así que podemos decir que funciona como una interfaz entre la placa de E/S y la máquina en sí.

<br>

![](/assets/images/posts/an-overlook-on-jvs-io-emulation-and-implementation/05.png){: .center-image }

{: .center-text }
Esquema de la Type X, la placa de JVS principal y la placa JVS de E/S conectada a la placa de E/S secundaria.

<br>

El software lee los datos de los controles del dispositivo en el puerto COM2. Los datos son transferidos en **paquetes** a través del protocolo JVS:

<br>

![](/assets/images/posts/an-overlook-on-jvs-io-emulation-and-implementation/06.png){: .center-image }

{: .center-text }
Estructura de un paquete del protocolo JVS.

<br>

En pocas palabras, el `Sync Code` determina el inicio de un paquete JVS válido, que siempre tiene un valor de `0xE0`. El `Node` indica la dirección o el dispositivo/nodo secundario de destino. El `Byte` determina el tamaño del resto del paquete, incluyendo el *checksum* (suma de control), y esta suma ayuda a identificar si un paquete está corrupto o no. La sección `Data` es, bueno, para los datos, conformado por un *comando* y argumentos. Existe una larga lista de comandos para realizar diferentes operaciones. En la emulación, la mayoría de estos comandos están codificados a la fuerza para la inicialización de la placa de E/S, por lo que el único que realmente nos interesa es el comando `0x20`, `SWINP`, o de forma más entendible, **Switch Inputs** (entradas/botones):

<br>

![](/assets/images/posts/an-overlook-on-jvs-io-emulation-and-implementation/07.png){: .center-image }

{: .center-text }
Bytes de datos del comando `SWIMP` para controles normales (también los hay para paneles de mahjong y palancas dobles)

<br>

Entonces, ¿cómo emulamos este proceso?

<br>

# Emulación de E/S
Como la placa JVS de E/S está conectada al puerto COM2, necesitamos un **dispositivo COM falso** que nos permita hacer pasar cualquier dispositivo de entrada como uno compatible con JVS. Para esto, *inyectamos* nuestros propios *hooks* para las **funciones COM** en la librería del sistema `Kernel32` para el proceso en ejecución, que van a devolver la información correcta del dispositivo virtual falso que creamos.

<br>

<div id="code-1" class="collapsible-hide">Presiona para mostrar el código</div>

<div id="code-1-data" class="content-hide" markdown="1">
{% highlight cpp %}
BOOL APIENTRY HookFunctions() {
  // Hooks de funciones para los dispositivos de comunicación.
  HOOK("kernel32.dll", ClearCommError, H, LP, Hook);
  HOOK("kernel32.dll", CloseHandle, H, LP, Hook);
  HOOK("kernel32.dll", EscapeCommFunction, H, LP, Hook);
  HOOK("kernel32.dll", GetCommModemStatus, H, LP, Hook);
  HOOK("kernel32.dll", GetCommState, H, LP, Hook);
  HOOK("kernel32.dll", GetCommTimeouts, H, LP, Hook);
  HOOK("kernel32.dll", SetCommMask, H, LP, Hook);
  HOOK("kernel32.dll", SetCommState, H, LP, Hook);
  HOOK("kernel32.dll", SetCommTimeouts, H, LP, Hook);
  HOOK("kernel32.dll", SetupComm, H, LP, Hook);
}
{% endhighlight %}
</div>

<br>

El concepto es simple, creamos una *corriente de datos* que va a *simular* la estructura de transferencia JVS, construir los paquetes correctos y devolver una respuesta válida. Básicamente introducimos los datos que la corriente está esperando. La parte interesante está en la petición del comando `0x20`, donde la segunda parte de la emulación entra en juego.

Aparte del dispositivo COM falso, también necesitamos una *capa de entrada verdadera*, la cual podemos conectar con la falsa y generar las señales de entrada a través de un **paquete de JVS virtual**. Para esto, creamos dos dispositivos de `DirectInput` (si bien cualquier *API* de controles funcionaría, usamos DInput ya que los juegos mismos también la usan, por lo que lo necesitamos de todas formas): uno *falso*, que conectamos al proceso del juego para que no detecte ninguna entrada o control, y uno *real*, que va a leer las entradas de nuestro dispositivo seleccionado. De esta manera, cancelamos cualquier lectura de entrada del proveniente del juego, e inyectamos las nuestras propias en la corriente virtual de JVS, la cual entonces va a ser leída e interpretada por el programa.

<br>

<div id="code-2" class="collapsible-hide">Presiona para mostrar el código</div>

<div id="code-2-data" class="content-hide" markdown="1">
{% highlight cpp %}
// Previene a los juegos de obtener acceso a los dispositivos de entrada.
HRESULT APIENTRY Fake_DirectInput8Create(HINSTANCE hinst, DWORD dwVersion, REFIID riidltf, LPVOID* ppvOut, LPUNKNOWN punkOuter) {
  // Bandera para crear un dispositivo de DInput verdadero despues de que el falso ya haya sido creado.
  if (DIMagicCall)
    // Pase para crear un dispositivo de DInput normal.
    return FDirectInput8Create(hinst, dwVersion, riidltf, ppvOut, punkOuter);
  else {
    *ppvOut = (LPVOID)pFakeInterface;
    punkOuter = NULL;
    // Este dispositivo devuelve null cuando se llama a GetState(), asi no se registran entradas.
    return DI_OK;
  }
}
{% endhighlight %}
</div>

<br>

La inicialización de DInput se comporta de forma normal, los dispositivos son enumerados, adquirimos el que queremos y finalmente creamos un **hilo de rastreo**, que estará constantemente en ejecución. Cuando presionamos una tecla/botón en el dispositivo, se va a activar una *bandera* en un *array de estado de entrada*, el cual va a ser leído por el **proceso de rastreo de la corriente JVS**.

<br>

<div id="code-3" class="collapsible-hide">Presiona para mostrar el código</div>

<div id="code-3-data" class="content-hide" markdown="1">
{% highlight cpp %}
// Chequear por un comando de mando.
if (IS_JOY_OBJECT(InValue)) {
  // Chequear ejes y botones de mando.
}
// Chequear por comandos de teclado.
else {
  int Button = GET_JOY_BUT(InValue);
  StateTable[i] = JoyState[JoyNumber].rgbButtons[Button] & 0x80 ? 1 : 0;
}
{% endhighlight %}
</div>

{: .center-text }
Chequear si algún botón/tecla es presionada y asignar la bandera correspondiente en el array.

<br>

<div id="code-4" class="collapsible-hide">Presiona para mostrar el código</div>

<div id="code-4-data" class="content-hide" markdown="1">
{% highlight cpp %}
// Estado del control. Comando SWINP.
case 0x20: {
  // Enviar a byte 0.
  JVS.bPush(InputMgr.GetState(TEST_MODE) ? 0x80 : 0);
  // Enviar a bytes 1 y 2.
  JVS.bPush(InInfo.Xp1HiByte());
  JVS.bPush(InInfo.Xp1LoByte());
  JVS.bPush(InInfo.Xp2HiByte());
  JVS.bPush(InInfo.Xp2LoByte());
  break;
}
{% endhighlight %}
</div>

{: .center-text }
Entonces el rastreo de JVS obtiene el estado de la tabla de entradas y va a procesarla.

<br>

Cuando el dispositivo de JVS falso detecta la bandera, asigna el *bit* en el *byte* correspondiente en el **bloque de datos del Input Switch**:

<br>

<div id="code-5" class="collapsible-hide">Presiona para mostrar el código</div>

<div id="code-5-data" class="content-hide" markdown="1">
{% highlight cpp %}
BYTE Xp1HiByte() {
  BYTE Byte = 0;
  if (InputMgr.GetState(P1_START))
    Byte |= 0x80;
  if (InputMgr.GetState(P1_SERVICE))
    Byte |= 0x40;
  if (InputMgr.GetState(P1_UP))
    Byte |= 0x20;
  if (InputMgr.GetState(P1_DOWN))
    Byte |= 0x10;
  if (InputMgr.GetState(P1_RIGHT))
    Byte |= 0x04;
  if (InputMgr.GetState(P1_LEFT))
    Byte |= 0x08;
  if (InputMgr.GetState(P1_BUTTON_1))
    Byte |= 0x02;
  if (InputMgr.GetState(P1_BUTTON_2))
    Byte |= 0x01;
  return Byte;
}

BYTE Xp1LoByte() {
  BYTE Byte = 0;
  if (InputMgr.GetState(P1_BUTTON_3))
    Byte |= 0x80;
  if (InputMgr.GetState(P1_BUTTON_4))
    Byte |= 0x40;
  if (InputMgr.GetState(P1_BUTTON_5))
    Byte |= 0x20;
  if (InputMgr.GetState(P1_BUTTON_6))
    Byte |= 0x10;
  return Byte;
}
{% endhighlight %}
</div>

{: .center-text }
Asignando los primeros 2 bytes, los cuales pertenecen a las entradas del jugador 1.

<br>

Finalmente, el paquete es enviado y la función retorna, la respuesta es almacenada para después ser interpreta por el juego como una entrada de JVS *legítima*.

<br>

# Excelente, y ahora qué
Todo lo que vimos hasta ahora es lo que está implementado en los cargadores de Romhack. Esto incluye la emulación de E/S de JVS y el manejo de entradas. El primero funciona perfectamente, pero el segundo, si bien es funcional, en *mi opinión* le falta algunas *características básicas*. La mayoría de éstas se hicieron populares por cargadores como JConfig, por lo que estos emuladores se sienten viejos y obsoletos en comparación.

Pero entonces, ¿por qué no usar estas alternativas modernas? La respuesta es que, por algún motivo, *ninguna* de ellas tiene soporte para los títulos de la eX-BOARD de Examu, y me refiero particularmente a JConfig, ya que TeknoParrot parece ser compatible, pero como este software tiene un pasado cuestionable (liberando dumps con **VMProtect** que solo funcionan con este emulador), no me gusta usarlo y prefiero evitarlo, inclusive si eso significa desarrollar mi propia alternativa.

Acá es cuando mi versión mejorada del *único* emulador de código abierto, xb_monitor, entra en juego, intentando poner al viejo cargador en la altura de las alternativas modernas. Y ya que estábamos, también decidí aplicar el mismo tratamiento a ttx_loader, porque *por qué no* (además de que ambos comparten la mayoría del código), aunque más adelante le encontraría una buena razón para existir. Pero antes de avanzar con estas nuevas funcionalidades, es importante remarcar que ambos proyectos sufrieron un cambio total del código, de una manera en la que *personalmente* creo que es mucho más legible y entendible, por lo que si querés ver como funciona todo, probablemente sea mejor usar TTX-Monitor+ y XB-Monitor+ en lugar de los originales.

<br>

# Mejoras de calidad de vida
Primero, los *controles*. Los valores para la *zona muerta* estaban *muy* bajos, por lo que con controles modernos y más sensitivos, como el `Mando de Xbox` y `DualShock 4`, era literalmente *imposible* configurar y jugar con las palancas analógicas, y ni hablar si tenés problemas de *derrape* como yo, incluso si son mínimos. Incrementando este valor a la fuerza es suficiente para solucionar este problema.

<br>

<div id="code-6" class="collapsible-hide">Presiona para mostrar el código</div>

<div id="code-6-data" class="content-hide" markdown="1">
{% highlight cpp %}
#define DEADZONE 500 /*(MAX_AXIS_VAL / DEADZONE_DIV)*/
{% endhighlight %}
</div>

{: .center-text }
El nuevo valor para la zona muerta (500), con la implementación vieja al lado (10).

<br>

En la función de rastreo de entrada, solo el eje izquierdo (`AxisL`) y los botones eran detectados, *muy limitado*. Ahora se añadió soporte para el eje derecho (`AxisR`), gatillos (`AxisZ`) y la cruceta/flechas (`POVs`), en adición a una opción `PovAsAxis` que permite usar la cruceta como si fuera la palanca izquierda (similar al botón `Analógico` en los mandos DualShock).

<br>

<div id="code-7" class="collapsible-hide">Presiona para mostrar el código</div>

<div id="code-7-data" class="content-hide" markdown="1">
{% highlight cpp %}
// Definiciones de ejes.
#define AXIS_X              1
#define AXIS_Y              2
#define AXIS_Z              3
#define AXIS_RX             4
#define AXIS_RY             5
#define POVN                10
// Definiciones de cruceta.
#define POV_CENTER          -1
#define POV_UP              0
#define POV_UP_RIGHT        4500
#define POV_RIGHT           9000
#define POV_RIGHT_DOWN      13500
#define POV_DOWN            18000
#define POV_DOWN_LEFT       22500
#define POV_LEFT            27000
#define POV_LEFT_UP         31500

// Rastreo de los ejes y cruceta del mando.
switch (GET_JOY_AXIS(InValue)) {
  case AXIS_X: {
    if (IS_NEGATIVE_AXIS(InValue)) {
      if ((JoyState[JoyNumber].lX < -DEADZONE) || (mTable[CONFIG_POVASAXIS] &&
      ((Dir == POV_LEFT) || (Dir == POV_DOWN_LEFT) || (Dir == POV_LEFT_UP))))
        StateTable[i] = 1;
    }
    else {
      if ((JoyState[JoyNumber].lX > DEADZONE) || (mTable[CONFIG_POVASAXIS] &&
      ((Dir == POV_RIGHT) || (Dir == POV_UP_RIGHT) || (Dir == POV_RIGHT_DOWN))))
        StateTable[i] = 1;
    } break;
  }
  case POVN: {
    // Para evitar problemas, los controles de la cruceta son deshabilitados
    // y forzados a funcionar como ejes si la opción PovAsAxis está habilitada.
    if ((JoyState[JoyNumber].rgdwPOV[0] != -1) && !mTable[CONFIG_POVASAXIS]) {
      if (GET_JOY_RANGE(InValue) == POV_UP &&
      ((Dir == POV_UP) || (Dir == POV_UP_RIGHT) || (Dir == POV_LEFT_UP)))
        StateTable[i] = 1;
      if (GET_JOY_RANGE(InValue) == POV_RIGHT &&
      ((Dir == POV_RIGHT) || (Dir == POV_UP_RIGHT) || (Dir == POV_RIGHT_DOWN)))
        StateTable[i] = 1;
      if (GET_JOY_RANGE(InValue) == POV_DOWN &&
      ((Dir == POV_DOWN) || (Dir == POV_RIGHT_DOWN) || (Dir == POV_DOWN_LEFT)))
        StateTable[i] = 1;
      if (GET_JOY_RANGE(InValue) == POV_LEFT &&
      ((Dir == POV_LEFT) || (Dir == POV_DOWN_LEFT) || (Dir == POV_LEFT_UP)))
        StateTable[i] = 1;
    } break;
  }
}
{% endhighlight %}
</div>

{: .center-text }
Extracto de la función de rastreo de entrada.

<br>

Ahora que ya terminamos con los controles, veamos algunas funciones que creí que ya no serían necesarias de incluir: las *funciones de registro* y el *wrapper* (envoltorio) de `DirectDraw`. El primero todavía se encuentra presente en el código, y está disponible como *herramienta de depuración* para el desarrollo, en lugar de estar siempre activo y creando archivos de registro que a nadie le interesa. Si bien se eliminó el wrapper de DirectDraw, el de `Direct3D 9` aún es requerido para XB-Monitor+, pero se redució a un solo propósito: arreglar el renderizado de la ventana en **Arcana Heart 3**. La implementación original era más compleja, pero ahora solamente se fuerza el uso de *pantalla completa* a una resolución de `640x480`, tal y como lo hacen el resto de los títulos de eX-BOARD.

<br>

<div id="code-8" class="collapsible-hide">Presiona para mostrar el código</div>

<div id="code-8-data" class="content-hide" markdown="1">
{% highlight cpp %}
HRESULT HookIDirect3D9::CreateDevice(LPVOID _this, UINT Adapter, D3DDEVTYPE DeviceType, HWND hFocusWindow, DWORD BehaviorFlags, D3DPRESENT_PARAMETERS* pPresentationParameters, IDirect3DDevice9** ppReturnedDeviceInterface) {
  pPresentationParameters->Windowed = FALSE;
  pPresentationParameters->BackBufferWidth = 640;
  pPresentationParameters->BackBufferHeight = 480;
  return pD3D->CreateDevice(Adapter, DeviceType, hFocusWindow, BehaviorFlags, pPresentationParameters, ppReturnedDeviceInterface);
}
{% endhighlight %}
</div>

{: .center-text }
La parte importante del wrapper.

<br>

Esta decisión fue a favor del uso de *wrappers externos*, como el *excelente* **dgVoodoo**, el cual no solo puede solucionar *incompatibilidades* en sistemas modernos (particularmente importante ya que estamos hablando de máquinas que salieron en 2004-2008), sino también *mejorar* el aspecto visual. Otros cargadores como JConfig incluyen sus propios wrappers para una *experiencia más completa*, aunque bajo mi experiencia éstos sean muy limitados o les falten funcionalidades, y no funcionen muy bien.

Último pero no menos importante, un **parche de guardado**. Como se comentó al principio del artículo, la mayoría de los programas guardaban sus configuraciones y datos de puntuaciones en una partición diferente. Esto no ha cambiado, e intentarán guardar información en estos lugares. El problema está en que no todo el mundo tiene una segunda partición con la letra específica necesaria, y tampoco queremos tener todos estos archivos *por todos lados*. Para darle una solución, vamos a redirigir todas las operaciones de archivos y carpetas a una *carpeta de guardado* dedicada en el directorio raíz de la aplicación.

Para los títulos de eX-BOARD es sencillo, ya que los datos no se guardan en el disco duro, pero sino en *memoria volátil* (aunque no sé específicamente la forma en la que lo hace), así que creamos un archivo de **SRAM virtual**, el cual después es cargado en memoria. xb_monitor ubica el archivo binario de SRAM en la carpeta `sv`, una estructura que también se usa en JConfig y en varios parches binarios, y en XB-Monitor+ y TTX-Monitor+ no va a ser diferente.

<br>

<div id="code-9" class="collapsible-hide">Presiona para mostrar el código</div>

<div id="code-9-data" class="content-hide" markdown="1">
{% highlight cpp %}
VOID SaveSRAM() {
  FILE* Stream = NULL;
  Stream = fopen(SRAM_NAME, "wb");    
  if (!Stream) { return; }
  fwrite(SRAM, 1, SRAM_SIZE, Stream);
  fclose(Stream);
}
{% endhighlight %}
</div>

<br>

Pero la Type X es completamente diferente, que parece sencillo al principio, pero cuya implementación es bastante complicada. En *teoría* inyectamos nuestras propias funciones del sistema `CreateDirectory` y `CreateFile` (tanto para la variante *ANSI* como la de *caracteres largos*) y listo, pero cuando empezamos a tratar con subdirectorios, *todo se va al carajo*. Con la implementación actual, conseguí que todos los títulos almacenen los datos en la carpeta de guardado, pero algunos como **The King Of Fighters '98**, **Gouketsuji Ichizoku Senzo Kuyou** y **Trouble Witches** no logran leer estos datos. Si bien puede que sea posible arreglarlo, tal vez con un algoritmo diferente, realmente no valía la pena, considerando que otros cargadores tienen parches *específicos para cada juego* (TeknoParrot seguro), mientras que yo tuve un enfoque para dar una solución más dinámica.

<br>

<div id="code-10" class="collapsible-hide">Presiona para mostrar el código</div>

<div id="code-10-data" class="content-hide" markdown="1">
{% highlight cpp %}
using namespace std::literals;

// Hermosa recursión. Necesario para los títulos que crean subcarpetas para guardar los datos.
void CreateFolderA(CHAR* SaveFolder, CHAR* SaveSubFolderC) {
  if (strcmp(SaveFolder, SaveSubFolderC) != 0) {
    CHAR SaveSubFolder[MAX_PATH];
    strcpy(SaveSubFolder, SaveSubFolderC);
    strrchr(SaveSubFolderC, '\\')[0] = '\0';
    CreateFolderA(SaveFolder, SaveSubFolderC);
    HCreateDirectoryA(SaveSubFolder, nullptr);
  } else { HCreateDirectoryA(SaveFolder, nullptr); }
}

BOOL APIENTRY Hook_CreateDirectoryA(LPCSTR lpPathName, LPSECURITY_ATTRIBUTES lpSecurityAttributes) {
  if (mTable[CONFIG_SAVEPATCH]) {
    // Asumiendo que ningún título de Type X guarda información en la partición C:.
    // Excluye directorios/rutas relativas.
    if ((lpPathName[0] != 'C' && lpPathName[0] != 'c') && lpPathName[1] == ':') {
      CHAR RootPath[MAX_PATH];
      GetModuleFileNameA(GetModuleHandleA(nullptr), RootPath, _countof(RootPath));
      strrchr(RootPath, '\\')[0] = '\0';
      std::string SavePath = RootPath + "\\sv\\"s;
      return HCreateDirectoryA(SavePath.c_str(), nullptr);
    }
  } return HCreateDirectoryA(lpPathName, lpSecurityAttributes);
}

HANDLE APIENTRY Hook_CreateFileA(LPCSTR lpFileName, DWORD dwDesiredAccess, DWORD dwShareMode, LPSECURITY_ATTRIBUTES lpSecurityAttributes, DWORD dwCreationDisposition, DWORD dwFlagsAndAttributes, HANDLE hTemplateFile) {
  if (mTable[CONFIG_SAVEPATCH]) {
    // Asumiendo que ningún título de Type X guarda información en la partición C:.
    // Excluye directorios/rutas relativas.
    if ((lpFileName[0] != 'C' && lpFileName[0] != 'c') && lpFileName[1] == ':') {
      // Obtener el directorio del programa.
      CHAR RootPath[MAX_PATH];
      GetModuleFileNameA(GetModuleHandleA(nullptr), RootPath, _countof(RootPath));
      // Eliminar el ejecutable de la ruta.
      strrchr(RootPath, '\\')[0] = '\0';
      std::string FilePath = lpFileName;
      std::string FileName = FilePath.substr(3);
      // Obtener longitud del directorio actual.
      int PathLenght = 0;
      for (int i = 0; i < MAX_PATH; i++)
        if (RootPath[i] == '\0') {
          PathLenght = i;
          break;
        }
      // Excluir archivos del directorio. Evita romper operaciones de archivos normales.
      if (strncmp(lpFileName, RootPath, PathLenght) != 0) {
        std::string SavePath = RootPath + "\\sv\\"s;
        std::string SaveFile = SavePath + FileName;
        std::string SaveSubFolderS = SaveFile.substr(0, SaveFile.length() - (FileName.length() - FileName.rfind('\\')));
        CHAR SaveFolder[MAX_PATH];
        strcpy(SaveFolder, (SavePath.substr(0, SavePath.length() - 1)).c_str());
        CHAR SaveSubFolderC[MAX_PATH];
        strcpy(SaveSubFolderC, SaveSubFolderS.c_str());
        CreateFolderA(SaveFolder, SaveSubFolderC);
        return HCreateFileA(SaveFile.c_str(), dwDesiredAccess, dwShareMode, lpSecurityAttributes, dwCreationDisposition, dwFlagsAndAttributes, hTemplateFile);
      }
    }
  } return HCreateFileA(lpFileName, dwDesiredAccess, dwShareMode, lpSecurityAttributes, dwCreationDisposition, dwFlagsAndAttributes, hTemplateFile);
}
{% endhighlight %}
</div>

{: .center-text }
Hooks de funciones del sistema para redirigir archivos y directorios.

<br>

Algo importante de aclarar es que solamente redirigimos las operaciones de archivos que no son relativas al directorio actual. De esta manera no rompemos los programas cuando intenten leer sus propios archivos de datos.

<br>

# Introduciendo soporte para entrada de mahjong
La *nueva* y *emocionante* funcionalidad *única* de TTX-Monitor+ es el soporte para **títulos de mahjong**. Bueno, en realidad solo **Taisen Hot Gimmick 5** por ahora, quizás **Taisen Hot Gimmick Mix Party** más adelante. Hay bastante historia con estos juegos de mahjong y su emulación de E/S de JVS.

Aparentemente, si bien ambos juegos efectivamente usan JVS para la comunicación de E/S, parece que es una *implementación personalizada*, ya que JVS es lo *suficientemente flexible* como para hacerlo. *¿Por qué?* Ni idea, pudieron haberse quedado con la manera estándar (literalmente esta en el nombre, JV**S**) de manejar las entradas de mahjong. La gente detrás de JConfig estuvo intentando descifrar su funcionamiento, y me comentaron que un **dump de JVS** *diferente* es necesario para brindarle a los programas la *información correcta* que esperan. Hasta entonces, vayamos por una solución rápida.

Para nuestra suerte, los desarrolladores dejaron los controles de teclado activados para *depuración*, o al menos en `THG5`, que usa DirectInput. Pero `THGMP` no los tiene, aunque el ejecutable si parece asignar algunas teclas, las cuales no están activadas por algún motivo. Aún estoy investigándolo, así que con suerte puede haber una manera de desbloquear el teclado para THGMP. Al menos de esta forma los controles deberían funcionar hasta que se encuentre una manera de emular correctamente el panel de mahjong de JVS.

El *único* cargador que era capaz de ejecutar THG5 con los controles de depuración fue el primero de todos en publicarse, el `TypeX Loader`. Esto se debe a que los demás cargadores siempre crean un dispositivo de DirectInput falso para prevenir que los juegos capturen las entradas por su cuenta, y así forzar que solo las entradas virtuales de JVS sean reconocidas. Para los títulos de mahjong, este dispositivo se *deshabilitaba*, permitiendo que los juegos reconozcan las entradas, y a pesar de que el cargador permitía configurar los controles para el panel de mahjong, nunca fue realmente implementado y *nunca funcionó*. Entonces, vamos a estar haciendo lo primero, y *arreglando* esto último.

Con esto en mente, la idea es dar la *falsa sensación* de una emulación correcta, habilitando la reasignación de los controles en el teclado a cualquier dispositivo conectado, incluyendo el mismo teclado. Para esto, implementamos un nuevo wrapper de DirectInput con un poco de complejidad algorítmica. Básicamente se encarga de administrar todas las entradas, tanto las *originales* como las *asignadas por el usuario*. De esta manera, buscamos evitar cualquier conflicto que pueda ocurrir cuando estas dos configuraciones se superpongan entre ellas.

Si bien al principio sonó sencillo, en realidad fue bastante complicado de implementar correctamente. Toda la configuración de entrada de mahjong se separó de las entradas normales para que sea más fácil y limpio de desarrollar y entender.

<br>

<div id="code-11" class="collapsible-hide">Presiona para mostrar el código</div>

<div id="code-11-data" class="content-hide" markdown="1">
{% highlight cpp %}
// La única limitación es que si una tecla está asignada al puntero de otra tecla, ambas no
// pueden ser presionadas al mismo tiempo. Por ejemplo: 'A' está asignada a la tecla 'A', y 'B'
// está asignada a la tecla '1'. Ambas no pueden ser presionadas a la vez porque originalmente 'A' apunta a '1'.
void PollInputMulti(int ThreadNumber) {
  for (;;) {
    // +3 es el desplazamiento para las entradas de mahjong.
    if (InputMgr.GetState(ThreadNumber + 3)) {
      // Evitar que el hilo procese una tecla que ya está siendo procesada por otro.
      if (isPressed[ThreadNumber] == 0) {
        isPressed[ThreadNumber] = 1;
        INPUT Input = { 0 };
        Input.type = INPUT_KEYBOARD;
        Input.ki.wScan = MapVirtualKey(LOBYTE(VI_CODES[ThreadNumber]), 0);
        // Valor necesario para la liberación de las teclas apuntadas.
        int isPointer = 0xFF;
        // Chequear si la tecla presionada es una tecla puntero.
        for (int k = M_START; k < M_END; k++)
          if ((DIK_CODES[ThreadNumber] == iTable[k])) {
            isPointer = k;
            break;
          }
        if (isPointer != 0xFF)
          isPressed[isPointer] = 2;
        // Bucle del SendInput.
        while (InputMgr.GetState(ThreadNumber + 3)) {
          Input.ki.dwFlags = KEYEVENTF_SCANCODE;
          SendInput(1, &Input, sizeof(Input));
          Sleep(10); // Pausa necesaria para que la tecla siguiente sea reconocida.
          Input.ki.dwFlags = KEYEVENTF_KEYUP;
          SendInput(1, &Input, sizeof(Input));
        }
        // Esperar a que otro hilo procese y rechace el último SendInput,
        // en caso de que la tecla enviada apunte a otra tecla ya asignada.
        Sleep(50);
        if (isPointer != 0xFF)
          isPressed[isPointer] = 0;
        isPressed[ThreadNumber] = 0;
      }
    } Sleep(20); // Reducir el procesamiento del hilo.
  }
}
{% endhighlight %}
</div>

{: .center-text }
Versión multi-hilo del algoritmo de rastreo.

<br>

Para el rastreo de las entradas, creamos un *nuevo hilo* para *cada* botón. Al principio quería que la cantidad de hilos sea arbitraria, pero al final no estaba dando buenos resultados. Además, también se incluye un modo de un solo hilo, lo cual de hecho soluciona la inconsistencia con la que el programa maneja las señales de múltiples teclas a la vez.

<br>

# El toque final
Ahora que todas las funciones y mejoras principales, *planeadas o no*, están implementadas, todavía queda una cosa más por hacer: la *interfaz de usuario*. La UI original (**ttx_config**) era muy simple, hecha con `MFC Application Wizard`. Cumplía con su trabajo, pero copiaba el código del cargador principal, lo que significaría tener que pasar todo para allá, además de añadir soporte para mahjong.

En lugar de actualizar la UI vieja, decidí desarrollar una nueva desde cero con `.NET Windows Forms`. Bueno, *mas o menos*, porque ya tenía la mayor parte hecha de otro proyecto anterior muy similar, incluyendo todas las operaciones de la interfaz y la integración de controles a través de la `API de DirectInput`. En el momento que desarrollé todo esto llevó una cantidad considerable de tiempo, sobre todo teniendo en cuenta que nunca había trabajado con `DirectX` o APIs similares anteriormente, pero al mismo tiempo me ayudó mucho a comprender como funcionaba la implementación de entrada en ttx_monitor y xb_monitor.

<br>

![](/assets/images/posts/an-overlook-on-jvs-io-emulation-and-implementation/08.png){: .center-image }

{: .center-text }
También puse a trabajar un poco el aspecto de diseñador gráfico con nuevos logos e iconos.

<br>

# Probablemente esto no haya terminado
Mientras considero que *casi* todo está terminado, todavía queda ese juego de mahjong dando vueltas. Voy a ver si puedo hacerlo funcionar con los controles de depuración que, *creo yo*, todavía están ahí, solamente que deshabilitados. Si eso sucede, la implementación de mahjong actual *debería* funcionar, tal vez con algunas modificaciones.

Sin embargo, este título se comporta de manera *diferente* a THG5: THGMP es una colección de los primeros 4 títulos en la serie. Cada uno tiene su propio ejecutable en su propia carpeta, incluyendo el *test mode* (modo de pruebas) y el *menú especial* para seleccionarlos. Resulta que `game.exe` es el proceso principal que administra la **creación de procesos secundarios** y la **comunicación de JVS**, funcionando como una *tubería* hacia los procesos individuales de cada juego. Por este motivo, es muy *molesto* depurar el programa, así que no es tan sencillo como le sería normalmente. De todos modos le voy a dar una oportunidad.

Éste fue un largo proyecto que todavía no considero terminado, pero me quedo con las experiencias de haber *programado por primera vez en C*, haber implementado nuevas funcionalidades en un proyecto ajeno y simplemente aprender más sobre como funcionan estas máquinas arcade modernas.

<br>

# Referencias

[JVS - Arcade Otaku](https://wiki.arcadeotaku.com/w/JVS)

[JVS I/O - PCB Otaku Wiki](https://wiki.pcbotaku.com/wiki/JVS_I/O)

[JVS Protocol - OpenJVS](https://github.com/TheOnlyJoey/openjvs/wiki/Protocol)

[Taito Type X User Manual - TAITO](https://usermanual.wiki/Document/TaitoTypeXManualJapanese.2482189640/html)

[JAMMA Video Standard (The Third Edition) (JVS) - JAMMA](http://superusr.free.fr/arcade/JVS/JVST_VER3.pdf)

[JAMMA Video Standard (JVS) Third Edition - Alex Marshall](http://daifukkat.su/files/jvs_wip.pdf)

[PC Hardware in Arcades, an Analysis - Alex Marshall](http://daifukkat.su/blog/archives/2012/01/14/pc_hardware_in_arcades_an_analysis/)
