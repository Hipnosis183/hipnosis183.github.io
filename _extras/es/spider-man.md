---
layout: extra
language: "es"
code: "spider-man"
title: "Spider-Man The Sinister Six"
description: "Versión Española - DOS (1996)"
name: "Parche No-CD"
thumb: /assets/images/extras/spider-man.jpg
---

<div id="spider-man" class="collapsible-show">Parche No-CD</div>
<div id="spider-man-data" class="content-show" markdown="1">
{% highlight php %}
'SPIDER.EXE'

@0x68AD1  00 00 00 00 00 00 00 00
@0x68ADD  00 00 00
{% endhighlight %}
</div>
<br>

Este parche es muy sencillo, ya que el programa no usa `MSCDEX`, por lo que descartamos buscar por un chequeo de dispositivos. En cambio, el programa busca los archivos localizados en el directorio `C:\SPIDER\`. La letra de unidad es sobreescrita con el valor en `SETUP.CFG`, pero si lo dejamos vacío, el valor predetermina a `C:\`. Entonces, para que el programa se ejecute desde cualquier directorio, simplemente vaciamos las cadenas de texto `\spider\` y `%c:` del ejecutable.

Sin embargo, todavía hay un problema. Por algún motivo, el programa elimina algunos de los archivos necesarios para ejecutarse correctamente. Independientemente de si es intencional o no, como medida de seguridad o un efecto secundario inesperado, sigue siendo un misterio. Para evitar este problema, hay que cambiar los permisos/propiedades de los directorios y archivos a solo lectura.