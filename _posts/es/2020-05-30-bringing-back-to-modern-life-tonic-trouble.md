---
layout: post
language: "es"
code: "bringing-back-to-modern-life-tonic-trouble"
title: Bringing back to modern life – Tonic Trouble
_title: Regresando a la vida moderna – Tonic Trouble
description: Develop a solution to breathe new life to an old title in modern times.
_description: Desarrollar una solución para darle vida nuevamente a un viejo título en tiempos modernos.
thumb: /assets/images/posts/bringing-back-to-modern-life-tonic-trouble/thumb.jpg
readtime: 16
---

# Introducción
Algunos títulos viejos suelen ser bastante problemáticos para hacerlos funcionar en sistemas modernos, y ~~Rayman 2~~ **Tonic Trouble** no es la excepción. Ya sea por el mismo programa o alguna de sus dependencias, siempre hay algo que les impide funcionar, y generalmente es trabajo de la comunidad (o simplemente gente interesada) regresarlo de la oscuridad hacia la vida tecnológica moderna.

<br>

# Antecedentes
Este es el caso del comúnmente olvidado (y siempre en la sombra de su proyecto hermano, Rayman 2) Tonic Trouble. Es importante mencionar que el lanzamiento de este título fue un poco especial, con dos versiones diferentes publicadas: una completa (**Retail**), y otra sin terminar (**Edición Especial**). Como Ubisoft jodió el lanzamiento en Europa, solo nos vamos a enfocar en la versión de lanzamiento intencionada, la Retail, aunque más adelante es posible que se aplique el mismo tratamiento a la Edición Especial, ya que parece que a mucha gente le gusta más esa.

A su vez, la versión Retail tuvo varios lanzamientos diferentes. Esto tiene que ver con las publicaciones en distintos países, donde cada uno cuenta con una versión diferente dependiendo de su fecha de lanzamiento. Aunque no se exactamente las diferencias entre ellas, puedo suponer que fueron arreglos menores y nada mayor. Si bien el plan es cubrir todas las versiones, necesitamos comenzar por algún lugar, así que vamos a enfocarnos el la última lanzada, la **Review English** (revisión inglesa), lanzada en Italia y España, *por supuesto*. Más adelante le haría justicia a su nombre y formaría parte de varios relanzamientos por toda Europa.

<br>

# Nuestro objetivo
Antes de comenzar, es necesario explicar cuál es nuestro objetivo. No hay ninguna ciencia en usar un **wrapper** y *presto*, el programa funciona perfectamente (bueno, no exactamente, ya veremos por qué). Sin embargo, este es un intento de facilitar y automatizar el proceso de instalación y configuración, principalmente para el usuario promedio que solo quiere jugar sin ningún problema. El objetivo es producir un programa *todo-en-uno* (TEU/AIO) que se encargue de, bueno, **todo** (un *cargador*, si se quiere), incluyendo lo más directo como el wrapper gráfico ya configurado, al igual que la parte más técnica, que va a ser explicada detalladamente y por lo tanto el eje principal del artículo.

El contenido va a incluir análisis e ingeniería inversa de código x86 simple y básico. Pero como principiante en todo esto, creo que puede ser de mayor interés para aquellos en una situación similar, o que creen que este tipo de cosas son muy complicadas. Una vez que comprendés el funcionamiento básico del lenguaje ensamblador y te familiarizás con las herramientas y el software necesarios, es bastante sencillo (aunque no siempre) y lógico de trabajar. Así que si algo (tal vez el artículo entero) parece estúpido o innecesario de explicar, mantené este aspecto en cuenta. Dicho esto, empecemos.

<br>

# Analizando la situación y preparando un entorno de trabajo
La versión Review English es bastante peculiar, ya que a diferencia de las otras, por algún motivo, tiene el ejecutable empaquetado. Entonces simplemente lo desempaquetamos, *¿verdad?*. Por supuesto que no, sino no estaríamos hablando de esto. Al analizar el ejecutable podemos ver claramente que está empaquetado, ya que el bloque desde la `PE Header` (cabecera) hasta la `Sections Table` (tabla de secciones) está llena de información corrupta:

<br>

![](/assets/images/posts/bringing-back-to-modern-life-tonic-trouble/00.png){: .center-image }

{: .center-text }
Como se ve (izquierda) y como se debería ver una sección normal (derecha).

<br>

Ahora que sabemos esto, vamos a desempaquetarlo:

<br>

![](/assets/images/posts/bringing-back-to-modern-life-tonic-trouble/01.png){: .center-image }

{: .center-text }
Carajo.

<br>

Genial, no sabemos con qué fue empaquetado. Y me dirás, *'bueno, tampoco es para tanto'*, pero el problema es que sea lo que sea que estén usando para desempaquetar, no funciona en nada más nuevo que `Windows XP`, provocando que el programa se cuelgue durante el proceso de desempaquetamiento en sistemas modernos. Además, esto no nos permitiría descompilar y analizar estáticamente el programa.

La única solución que se me ocurre a estas alturas es a la *fuerza bruta*, **volcando la memoria**. Después de horas depurando e investigando (tengamos en cuenta que soy un principiante cuando hablamos de retroingeniería, ni que hablar de saber sobre el formato PE y reconstruir un ejecutable) en una máquina con `Windows XP` **real** (no máquinas virtuales, ya que las GPUs virtuales no cumplen con los requerimientos del programa), me rendí. Si bien los datos estaban ahí, quedaban importaciones sin reconstruir, dejando el ejecutable obsoleto, y no tengo la experiencia suficiente como para arreglarlo manualmente.

Para mi suerte, la comunidad que mencioné al comienzo vino al rescate. En la **Rayman Pirate-Community** (es un juego de palabras de Rayman 2, no tiene que ver con piratería), el usuario **RibShark** ya lo había conseguido, compartiendo el ejecutable desempaquetado. Como comenté anteriormente, esto fue hecho manualmente, así que una mención especial por haberlo conseguido.

Ahora que ya tenemos el ejecutable desprotegido, y la ayuda temporal de un wrapper de video, estamos listos para comenzar el trabajo.

<br>

# Mejorando el ejecutable
Con todo listo y corriendo, ya podemos empezar a añadir nuevas funcionalidades desde un punto de vista más técnico, ya que si bien el juego ya funciona *tal y como está*, aún tiene algunas complicaciones. Primero el programa necesita algunos archivos para comenzar, los cuales son generados por el programa de configuración incluído, el cual a su vez necesita más archivos creados durante la instalación desde el CD.

Tenemos que tener en cuenta que este juego es del año 1999, y por aquel entonces un **MONTÓN** de software usaba la carpeta `Windows` para guardar la mayoría de su configuración y demás información. Este caso no es una excepción, y el programa almacena la configuración en `Windows/UbiSoft` (¿te acordás cuando su nombre se *EscribíaAsí*?). Una de nuestras tareas es cambiar eso, y que se use la carpeta de raíz en su lugar. Esto va a permitir que el programa sea completamente portable, además de evitar tener que instalarlo de manera tradicional. Adicionalmente, se implementarán otras mejoras de *calidad de vida*, como eliminar el sistema de registros y redirigir algunos directorios, haciendo así la necesidad del CD obsoleta.

Para el apartado de gráficos se va a incluír un wrapper (el increíble **dgVoodoo**), para poder aumentar la resolución a la pantalla. Además, se añadirá un parche de panalla panorámica. Todo esto va a ser implementado de forma dinámica, así nada tiene que ser configurado manualmente, solo es cuestión de activar o desactivar cada opción.

Ahora que tenemos una idea de lo que queremos hacer y como va a funcionar todo, ya podemos comenzar con la parte entretenida.

<br>

# Ensuciándonos las manos
Bien, ahora este paso va a requerir un poco de descompilación y depuración. No es necesario tener las dos, pero me gusta poder ver las cosas desde ambas perspectivas. Aún así, siempre me encuentro usando más la descompilación para analizar el código estáticamente, y editores hexadecimales para probar los parches. Sé que no es la manera más conveniente, pero me siento cómodo trabajando así, además de que son cosas dentro de todo sencillas.

Para esta tarea vamos a ir completamente con software libre, usando **Ghidra** para descompilar y **x64dbg** (en realidad **x32dbg**) para depurar. Software adicional incluye un editor hexadecimal (**HxD**) y **Process Monitor**, fundamental para nuestro éxito.

Lo más lógico en probar primero es ver si podemos modificar los valores que queremos directamente desde el archivo binario con el editor hexadecimal, almacenados como cadenas de texto. Pero parece que solo es posible cambiar nombres de archivos, no directorios. Esto nos permite cambiar ciertas cosas, como los registros y otros archivos, pero no las rutas de la configuración.

Ahora empezamos directamente analizando el ejecutable con Ghidra. Estamos intentando redirigir las operaciones de archivos en la carpeta `Windows` (hablando de la configuración, en este caso el archivo `UbiSoft/Ubi.ini`) hacia la carpeta de raíz del programa, así que una de las cosas que me vienen a la cabeza es buscar por llamadas a la función `GetWindowsDirectoryA`, y encontrar una manera de cambiarlo a `GetCurrentDirectoryA`. Después de una búsqueda rápida se encontraron 4 resultados, todos con una estructura similar:

<br>

![](/assets/images/posts/bringing-back-to-modern-life-tonic-trouble/02.png){: .center-image }

<br>

Podemos ver la cadena de texto `UbiSoft/Ubi.ini`, también presente en el archivo binario. Esto significa que encontramos lo que buscábamos, repitiéndose en las cuatro llamadas, todas al comienzo de sus respectivas funciones. Ahora tenemos que ver que hacemos con esto.

Al principio, fracasando en el intento, probé en cambiarlas a llamadas de `GetCurrentDirectoryA`. Por la lógica de la función, *debería* haber funcionado, pero resulta que las computadoras son mas inteligentes que yo. La cadena se cortaba por algún motivo, comprobado con x32dbg y Process Monitor. Después de más intentos inútiles, me dí cuenta de algo **muy** importante.

¿Te acordás cuando al principio mencioné a **Rayman 2** como un *proyecto hermano*? Resulta que Rayman 2 usa el mismo motor base que Tonic Trouble, aunque mucho más pulido. La mejor parte es que se comporta *exactamente* igual que Tonic Trouble en cuestión de manejo de archivos, lo que significa que también almacena sus datos en la carpeta `Windows`. Esto no sería muy relevante si Rayman 2 no fuera un juego popular, pero ese no es el caso. En 2011, Ubisoft relanzó Rayman 2 en **GOG**, con unos cuantos arreglos en el camino para que funcione apropiadamente en sistemas modernos al momento. Uno de esos arreglos es lo que nos reúne el día de hoy, redirigir los archivos de la carpeta `Windows` hacia la carpeta raíz.

Con esta información, ahora vamos a hacer el mismo proceso con estos dos ejecutables, el original de Rayman 2 sin parchear, y el ya parcheado de GOG. Como el arreglo ya esta parcheado, podemos asumir que no vamos a encontrar resultados para `GetWindowsDirectoryA`. Ahora es cuando el original entra en juego: buscamos la función ahí y después buscamos su *dirección* en el ejecutable parcheado. Cuando buscamos la función podemos ver algo familiar:

<br>

![](/assets/images/posts/bringing-back-to-modern-life-tonic-trouble/03.png){: .center-image }

{: .center-text }
¿Podés encontrar la diferencia?

<br>

Hablando en serio, es literalmente el mismo código. Ahora cuando buscamos la dirección en el ejecutable parcheado, la función se ve así:

<br>

![](/assets/images/posts/bringing-back-to-modern-life-tonic-trouble/04.png){: .center-image }

{: .center-text }
Unos buenos NOPs.

<br>

Resulta que dejando la cadena de texto *vacía* es la clave. El programa busca los archivos en el directorio raíz, así que no hay necesidad de usar `GetCurrentDirectoryA`. Se ajustan algunos valores para que los registros y el stack no se jodan y todo siga en funcionamiento.

Bien, ahora vamos a probar *algo estúpido* (estoy empezando a ver un patrón). Vamos a reemplazar las funciones en el ejecutable de Tonic Trouble con el bloque de instrucciones con `MOV` y `NOPs`:

<br>

![](/assets/images/posts/bringing-back-to-modern-life-tonic-trouble/05.png){: .center-image }

{: .center-text }
¡Sorpresa!

<br>

Al final no era una muy mala idea. Como muestra Process Monitor, el archivo está siendo leído correctamente desde el directorio raíz, y ahora todo funciona correctamente. Además, pasa lo mismo con el programa de configuración, el cual comparte el mismo código. Parchear este archivo también es importante.

Con esto terminamos esta primera parte, así que ahora podemos avanzar a la segunda funcionalidad a implementar, el parche de pantalla panorámica.

<br>

# Expandamos esa vista hermosa
Esta funcionalidad es bastante sencilla de implementar, ya que sigue una técnica muy común y conocida en hackeo de videojuegos. Para explicarlo de manera simple, el programa muestra la imagen en pantalla en una resolución definida, y determina el rango visual dentro del límite de esa resolución con un valor de *campo de visión* (*field-of-view* o *FOV*). Existen una serie de valores hexadecimales que se pueden encontrar en el ejecutable, que al modificarlos, podemos cambiar la configuración del programa.

En este caso, vamos a modificar la opción de resolución, con un valor *entero* de `800x600` (si bien `640x480` sería el ideal ya que es el valor por defecto, el programa se cuelga si este valor es modificado), y el FOV con un valor *de punto flotante* `1`. Recordemos que siempre trabajamos en *hexadecimal*, así que estos valores deben ser convertidos respectivamente.

Antes de cualquier modificación veamos como funciona el proceso. Primero cambiamos los valores de la resolución. Con esto obtenemos una salida de *imagen vertical* (`Ver-`) correcta, pero en consecuencia, la horizontal se estira (dependiendo del juego se puede estirar o ajustar adecuadamente). Ahí es cuando el campo de visión entra en juego. Después de someter la resolución a unos cálculos matemáticos, obtenemos un valor de FOV e *imagen horizontal* (`Hor+`) correctos, para así conseguir una relación de aspecto e imagen de salida correctas.

Este proceso es muy sencillo, solamente encontramos las direcciones de estos valores formateados y los modificamos:

<br>

- `800` (int/2 bytes) (`0x320`, `20 03` formateado) @`0x11235`
- `600` (int/2 bytes) (`0x258`, `58 02` formateado) @`0x1123B`
- `1` (float/4 bytes) (`0x3F800000`, `00 00 80 3F` formateado) @`0xD0B50`

<br>

![](/assets/images/posts/bringing-back-to-modern-life-tonic-trouble/06.png){: .center-image }

<br>

Cambiar los valores de la resolución es bastante directo, pero el FOV es un poco más complejo:

<br>

<div id="code-0" class="collapsible-hide">Presiona para mostrar el código</div>

<div id="code-0-data" class="content-hide" markdown="1">
{% highlight cs %}
double FovHorizontal = Math.Round((2 * Math.Atan(((double)ScreenWidth / ScreenHeight) / ((double)4 / 3) * Math.Tan((double)1 / 2 * (Math.PI / 180)))) * (180 / Math.PI) * Math.Pow(10, 2)) / Math.Pow(10, 2);

double FovVertical = Math.Round((2 * Math.Atan(Math.Tan((FovHorizontal * (Math.PI / 180)) / 2) * ((double)ScreenHeight / ScreenWidth))) * (180 / Math.PI) * Math.Pow(10, 2)) / Math.Pow(10, 2);
{% endhighlight %}
</div>

{: .center-text }
Implementación en C#.

<br>

Primero calculamos el FOV horizontal, y con eso, el FOV vertical. Esto nos da un valor decimal, el cual convertimos a hexadecimal. Para entenderlo más fácil, mirémoslo como una *regla de tres*: si `1.33` (4/3) es `1` (FOV), entonces ¿qué FOV va a tener `1.78` (16/9)?. Obviamente estamos simplificando, y no usamos esto porque una fórmula puede no funcionar para todos los casos.

Cabe aclarar que mucha gente suele usar valores generales, y si bien cubren la mayoría de los escenarios, no siempre es preciso hacerlo, ya que puede mostrar la imagen incorrectamente si se usa una relación de aspecto poco común. Además, queremos ser lo más dinámico posible.

<br>

# Listo para un poco de código
Ahora que tenemos los temas del manejo de archivos y la pantalla panorámica resueltos, es momento de comenzar a trabajar en el programa que va a reflejar toda la investigación y mejoras que hicimos hasta ahora.

El programa va a ser una aplicación de `Windows Form` muy sencilla, con una ventana principal y otra de opciones. Voy a usar `.NET Framework 3.5` para maximizar la compatibilidad entre sistemas, o al menos conseguir que el programa corra en máquinas con `Windows XP`, ya que va a tener mejoras que inclusive estos viejos sistemas pueden aprovechar.

Las partes más interesantes puede que sean el empaquetado de los archivos y los parches, así que me voy a centrar solo en eso.

El primero es simple, con 3 archivos binarios empaquetados: uno para las *opciones de la aplicación* (`App.bin`), otro con los *ejecutables del juego* (`Data.bin`), y el último con los *archivos del wrapper de video* (`Video.bin`), sabiendo el punto de comienzo y longitud de cada archivo para extraerlos durante la ejecución dependiendo de las opciones seleccionadas:

<br>

<div id="code-1" class="collapsible-hide">Presiona para mostrar el código</div>

<div id="code-1-data" class="content-hide" markdown="1">
{% highlight cs %}
// Preparar la configuración del programa.
public static void InitialSetup() {
  SettingsName = Path.GetFileNameWithoutExtension(Default.GetType().Assembly.Location)+ ".bin";
  if (!File.Exists(SettingsName))
    Launcher.ExtractFileFromResources("TTLauncher.Files.App.bin", SettingsName, 0, 16);
  SettingsLoaded = File.ReadAllBytes(SettingsName);
}

private static void UnpackFiles() {
  ExtractFileFromResources("TTLauncher.Files.Data.bin", "TonicTrouble.exe", 16, 967168);
  ExtractFileFromResources("TTLauncher.Files.Data.bin", "SetupTT.exe", 967200, 95744);
  UnpackedFiles.Add("TonicTrouble.exe");
  UnpackedFiles.Add("SetupTT.exe");
}
{% endhighlight %}
</div>

<br>

Después tenemos los parches, en forma de *arrays de bytes* (`byte[]`):

<br>

<div id="code-2" class="collapsible-hide">Presiona para mostrar el código</div>

<div id="code-2-data" class="content-hide" markdown="1">
{% highlight cs %}
private static byte[] VideosPath = new byte[] {
  0x56, 0x69, 0x64, 0x65, 0x6F, 0x73, 0x00, 0x00
};
private static byte[] ConfigurationFile = new byte[] {
  0x2E, 0x69, 0x6E, 0x69, 0x00, 0x00,
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00
};
private static byte[] ConfigurationPath1 = new byte[] {
  0x66, 0xC7, 0x00, 0x2E, 0x00, 0x90,
  0x90, 0x90, 0x90, 0x90, 0x90, 0x90
};
private static byte[] ConfigurationPath2 = new byte[] {
  0x8D, 0x84, 0x24, 0x00, 0x01, 0x00, 0x00, 0x53,
  0x56, 0x57, 0x66, 0xC7, 0x00, 0x2E, 0x00, 0x90,
  0x90, 0x90, 0x90, 0x90, 0x90, 0x90, 0xBF, 0x80,
  0x83, 0x4D, 0x00, 0x83, 0xC9, 0xFF, 0x33, 0xC0
};
{% endhighlight %}
</div>

<br>

Y algunas funciones para aplicarlos:

<br>

<div id="code-3" class="collapsible-hide">Presiona para mostrar el código</div>

<div id="code-3-data" class="content-hide" markdown="1">
{% highlight cs %}
public static void PatcherPortable(string FileNameInput) {
  BinaryWriter BinWrite = new BinaryWriter(File.Open(FileNameInput, FileMode.Open, FileAccess.ReadWrite));
  BinWrite.BaseStream.Position = 0xD5ACC;
  BinWrite.Write(VideosPath);
  BinWrite.BaseStream.Position = 0xD5B84;
  BinWrite.Write(ConfigurationFile);
  BinWrite.BaseStream.Position = 0xFDD0;
  BinWrite.Write(ConfigurationPath1);
  BinWrite.BaseStream.Position = 0x12D4D;
  BinWrite.Write(ConfigurationPath1);
  BinWrite.BaseStream.Position = 0x41AA6;
  BinWrite.Write(ConfigurationPath2);
  BinWrite.Close();
}

public static void PatcherSetup(string FileNameInput) {
  BinaryWriter BinWrite = new BinaryWriter(File.Open(FileNameInput, FileMode.Open, FileAccess.ReadWrite));
  BinWrite.BaseStream.Position = 0x62E8;
  BinWrite.Write(ConfigurationFile);
  BinWrite.BaseStream.Position = 0x42D;
  BinWrite.Write(ConfigurationPath1);
  BinWrite.BaseStream.Position = 0x5C0;
  BinWrite.Write(ConfigurationPath1);
  BinWrite.Close();
}
{% endhighlight %}
</div>

<br>

También un *blanqueador*, ya que necesitamos llenar algunas partes con bytes vacíos:

<br>

<div id="code-4" class="collapsible-hide">Presiona para mostrar el código</div>

<div id="code-4-data" class="content-hide" markdown="1">
{% highlight cs %}
public static void PatcherBlanker(string FileNameInput, int Offset, int Lenght) {
  BinaryWriter BinWrite = new BinaryWriter(File.Open(FileNameInput, FileMode.Open, FileAccess.ReadWrite));
  BinWrite.BaseStream.Position = Offset;
  for (int i = 0; i < Lenght; i++) {
    BinWrite.Write((byte)0x00);
  } BinWrite.Close();
}
{% endhighlight %}
</div>

<br>

Y de nuevo, dependiendo de las opciones, estos van a ser llamados así:

<br>

<div id="code-5" class="collapsible-hide">Presiona para mostrar el código</div>

<div id="code-5-data" class="content-hide" markdown="1">
{% highlight cs %}
// Parchear el ejecutable.
Patches.PatcherPortable("TonicTrouble.exe");
// Parchear el configurador.
Patches.PatcherSetup("SetupTT.exe");
{% endhighlight %}

<br>

{% highlight cs %}
// Aplicar algunos parches iniciales, sin importar la configuración.
private static void InitialPatching() {
  Patches.PatcherBlanker("TonicTrouble.exe", 0xD28A8, 11);
  Patches.PatcherBlanker("TonicTrouble.exe", 0xD28EC, 9);
  Patches.PatcherBlanker("SetupTT.exe", 0x69C4, 9);
}
{% endhighlight %}
</div>

<br>

Finalmente, ejecutamos el programa. Importante el uso del parámetro `-cd-rom:`, el cual va a activarse si el *modo portable* está seleccionado, y le indica al juego la ubicación del CD. Si lo dejamos vacío entonces va a usar el directorio actual:

<br>

<div id="code-6" class="collapsible-hide">Presiona para mostrar el código</div>

<div id="code-6-data" class="content-hide" markdown="1">
{% highlight cs %}
private static void RunGame() {
  Process TonicTrouble = new Process();
  TonicTrouble.StartInfo.FileName = "TonicTrouble.exe";
  if (SettingsLoaded[2] == 0x01)
    TonicTrouble.StartInfo.Arguments = "-cdrom:";
  TonicTrouble.Start();
  CheckGame();
}

private static void CheckGame() {
  System.Threading.Thread.Sleep(1000);
  Process[] CurrentProcess = Process.GetProcessesByName("TonicTrouble");
  foreach (Process Process in CurrentProcess)
    if (Process.ProcessName == "TonicTrouble")
      Process.WaitForExit();
}
{% endhighlight %}
</div>

<br>

# Si la vida te da tónicos, hace… ehh…
Al final, la aplicación quedo así:

<br>

![](/assets/images/posts/bringing-back-to-modern-life-tonic-trouble/07.png){: .center-image }

<br>

Hay que tener en consideración que esto es *temporal* e *incompleto*. El texto de versión es solo de muestra; el plan es soportar otras versiones por igual, pero eso probablemente requiera hacer todo de nuevo. Muy emocionante.

<br>

**Actualización 06/07/20:** Bueno, no fue tan malo como pensé, y fue una buena oportunidad para hacer algo de limpieza y pulido.

<br>

# Terminando lo empezado
Como era de esperar, fue necesario refactorizar, ya que ahora tenemos **dos** partes diferentes que van a utilizar el mismo código, separadas en las versiones *protegidas/empaquetadas* y las versiones *desprotegidas/desempaquetadas*. Ya hablamos de las primeras antes, pero ahora tenemos que ajustar todo para que funcionen las otras.

Para determinar esto, primero necesitamos una forma de identifica la versión del ejecutable, para lo que me tomé el trabajo de buscar todos los lanzamientos disponibles, y para mi sorpresa, muchos de ellos usan los mismos ejecutables, e inclusive los mismos archivos de datos. En el código, solamente calculamos el *hash* (elegí el algoritmo `SHA-256`) y lo comparamos con una lista:

<br>

<div id="code-7" class="collapsible-hide">Presiona para mostrar el código</div>

<div id="code-7-data" class="content-hide" markdown="1">
{% highlight cs %}
private static string CalculateCheckSum(string FileName) {
  using (Stream Executable = File.OpenRead(FileName)) {
    byte[] CheckSum = SHA256.Create().ComputeHash(Executable);
    string Formatted = BitConverter.ToString(CheckSum).Replace("-", String.Empty);
    return Formatted; // Después chequeamos por el texto en la lista.
  }
}

public static List<string> VersionCheckSum = new List<string> {
  // REVIEW ENGLISH : TT221099-PC - SPANISH - PROTECTED
  "17457C330D11621474A50B2852618D7DF53468C24899176CB2AFC951B51518FB",
  // REVIEW ENGLISH : TT221099-PC - ITALIAN - PROTECTED
  "C379FFADD35C738C0041CEB9916CCA31C35C6EC096B1B3F257F2C66000F0BBFA",
  // RETAIL MASTER V5 : TT181099-PC - FRENCH - UNPROTECTED
  "6AD8506714FC86856369FFE834BB22792AEBCD0FF4FAB780E03AA0ADB47643B3",
  // RETAIL MASTER GERMAN V3: TT221099-PC - GERMAN - PROTECTED
  "EA4BE88CEB9BB7C438BEE7F97767CF12C0F9439707A2CDAEE362FFA01C88FDA6",
  // RETAIL MASTER V3 : TT131099-PC - BRAZILIAN|CHINESE|EUROPE|USA - PROTECTED
  "37631F2FE37C07DD4CCDE32C0981685E152AC016920BEB01CCC0E8FC0E53DC57"
};
{% endhighlight %}
</div>

<br>

Ahora sabemos exactamente todo lo que tenemos que soportar. Después de una simple prueba, la aplicación ya funciona con todas las versiones protegidas, así que nos podemos ovidar de ellas (por ahora), pero aún no lo hace con la versión desprotegida francesa. Solo para ésta tenemos que cambiar la mayoría de las estructuras y funciones, ya que los parches no son los mismos.

Después de estos cambios los parches se ven así:

<br>

<div id="code-8" class="collapsible-hide">Presiona para mostrar el código</div>

<div id="code-8-data" class="content-hide" markdown="1">
{% highlight cs %}
private static byte[] VideosPath = new byte[] {
  0x56, 0x69, 0x64, 0x65, 0x6F, 0x73, 0x00, 0x00
};
private static byte[] ConfigurationFile = new byte[] {
  0x2E, 0x69, 0x6E, 0x69, 0x00, 0x00,
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00
};
private static byte[] ConfigurationPathProtected1 = new byte[] {
  0x66, 0xC7, 0x00, 0x2E, 0x00, 0x90,
  0x90, 0x90, 0x90, 0x90, 0x90, 0x90
};
private static byte[] ConfigurationPathProtected2 = new byte[] {
  0x8D, 0x84, 0x24, 0x00, 0x01, 0x00, 0x00, 0x53,
  0x56, 0x57, 0x66, 0xC7, 0x00, 0x2E, 0x00, 0x90,
  0x90, 0x90, 0x90, 0x90, 0x90, 0x90, 0xBF, 0x80,
  0x83, 0x4D, 0x00, 0x83, 0xC9, 0xFF, 0x33, 0xC0
};
private static byte[] ConfigurationPathUnProtected1 = new byte[] {
  0x90, 0x90, 0x90, 0x90, 0x90, 0x8D,
  0x85, 0xFC, 0xFD, 0xFF, 0xFF, 0x66,
  0xC7, 0x00, 0x2E, 0x00, 0x90, 0x90
};
private static byte[] ConfigurationPathUnProtected2 = new byte[] {
  0x8D, 0x84, 0x24, 0x00, 0x01, 0x00, 0x00, 0x53,
  0x56, 0x57, 0x66, 0xC7, 0x00, 0x2E, 0x00, 0x90,
  0x90, 0x90, 0x90, 0x90, 0x90, 0x90, 0xBF, 0x80,
  0x73, 0x4D, 0x00, 0x83, 0xC9, 0xFF, 0x33, 0xC0
};
{% endhighlight %}
</div>

<br>

Y las funciones ahora admiten direcciones como parámetros:

<br>

<div id="code-9" class="collapsible-hide">Presiona para mostrar el código</div>

<div id="code-9-data" class="content-hide" markdown="1">
{% highlight cs %}
public static void PatcherPortable(string FileNameInput, int Address1, int Address2, int Address3, int Address4, int Address5) {
  byte[] ConfigurationPath = SetConfiguration(2);
  BinaryWriter BinWrite = new BinaryWriter(File.Open(FileNameInput, FileMode.Open, FileAccess.ReadWrite));
  BinWrite.BaseStream.Position = Address1;
  BinWrite.Write(VideosPath);
  BinWrite.BaseStream.Position = Address2;
  BinWrite.Write(ConfigurationFile);
  BinWrite.BaseStream.Position = Address3;
  BinWrite.Write(ConfigurationPathProtected1);
  BinWrite.BaseStream.Position = Address4;
  BinWrite.Write(ConfigurationPathProtected1);
  BinWrite.BaseStream.Position = Address5;
  BinWrite.Write(ConfigurationPath);
  BinWrite.Close();
}

// Aplicar el parche indicado dependiendo del nivel de protección.
private static byte[] SetConfiguration(int Configuration) {
  if (Launcher.IsProtected())
    if (Configuration == 1)
      return ConfigurationPathProtected1;
    else
      return ConfigurationPathProtected2;
  else
    if (Configuration == 1)
      return ConfigurationPathUnProtected1;
    else
      return ConfigurationPathUnProtected2;
}
{% endhighlight %}
</div>

<br>

Éstas se llaman así:

<br>

<div id="code-10" class="collapsible-hide">Presiona para mostrar el código</div>

<div id="code-10-data" class="content-hide" markdown="1">
{% highlight cs %}
// Parchear los ejecutables del juego y configuración.
private static void PatchExecutables() {
  // Para versiones desprotegidas.
  if (SettingsLoaded[0] == 0x02) {
    Patches.PatcherPortable(ExeGame, 0xD56CC, 0xD5784, 0xFCF0, 0x12C5D, 0x40EF6);
    Patches.PatcherSetup(ExeSetup, 0x70E8, 0x439, 0x5D9);
  }
  // Para versiones protegidas.
  else {
    Patches.PatcherPortable(ExeGame, 0xD5ACC, 0xD5B84, 0xFDD0, 0x12D4D, 0x41AA6);
    Patches.PatcherSetup(ExeSetup, 0x62E8, 0x42D, 0x5C0);
  }
}
{% endhighlight %}
</div>

<br>

Ahora con esto todo funciona correctamente. La versión del programa es detectada y los parches correspondientes son aplicados. Pero aún no terminamos, ya que al hacer todo esto me dí cuenta de un detalle que me pasé por alto.

El *video de introducción* es algo especial. Si no es detectado simplemente no se reproduce, y el juego continúa normalmente. Para eso tenemos el parche de video, pero no es suficiente. Cada versión tiene un idioma diferente, y existe una carpeta nombrada después de éste (**Inlés**, **Francés**, **Alemán**, **Italiano** y **Español**, todos en inglés). Si la carpeta no tiene el nombre correcto, la introducción (y algunos sonidos) tampoco se reproducirán. Fue un error bastante estúpido, porque probé el parche de video con la versión inglesa y todo funcionó bien (`English` es el valor por defecto), pero como después me cambié a la versión italiana no me dí cuenta de que el video no se reproducía. Después de analizar el ejecutable, todas las versiones apuntan al mismo directorio `English`, pero al cambiarlo no pasa nada, así que la configuración tiene que estar en otro lado. Resulta que me estaba faltando la entrada `Language` en el archivo `Ubi.ini`, que sobrescribe el directorio de origen con el especificado, por lo que sí era importante de incluír (hay muchas opciones inútiles en el archivo `Ubi.ini`, así que no incluyo las que no sean necesarias).

<br>

<div id="code-11" class="collapsible-hide">Presiona para mostrar el código</div>

<div id="code-11-data" class="content-hide" markdown="1">
{% highlight cs %}
if (!File.Exists("Ubi.ini"))
  using (StreamWriter Stream = File.CreateText("Ubi.ini")) {
    Stream.WriteLine("[TONICT]");
    // Necesario para los ejecutables del juego y configuración.
    Stream.WriteLine("Directory=");
    // Necesario para reproducir el video de introducción y algunos sonidos.
    Stream.WriteLine("Language=" + CheckSum.VersionLanguage[SettingsLoaded[0]]);
  }

public static List<string> VersionLanguage = new List<string> {
  "Spanish",
  "Italian",
  "French",
  "German",
  "English"
};
{% endhighlight %}
</div>

<br>

Y ahora, esta vez enserio, ya terminamos con todo. Todas las funcionalidades fueron probadas con todas las versiones, y todo se vé y funciona muy bien.

<br>

![](/assets/images/posts/bringing-back-to-modern-life-tonic-trouble/08.png){: .center-image }

<br>

Después de todo esto voy a reconsiderar la idea de soportar la ***Edición Especial***...
