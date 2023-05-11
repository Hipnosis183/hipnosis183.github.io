---
layout: extra
language: "es"
code: "litil-divil"
title: "Litil Divil"
description: "Versión CD-ROM - DOS (1993)"
name: "Parche No-CD"
thumb: /assets/images/extras/litil-divil.jpg
---

<div id="litil-divil" class="collapsible-show">Parche No-CD</div>
<div id="litil-divil-data" class="content-show" markdown="1">
{% highlight php %}
'DIVIL.EXE'  |  'DIVIL.EXE'     |  'DIVIL.EXE'        |  'DIVIL.EXE'
             |                  |                     |
@0xE672  01  |  @0xE673  90 90  |  @0xE7BB  90 90 90  |  @0xEC96  90 90
{% endhighlight %}
</div>
<br>

Después de darle la ruta de *'instalación'* como parámetro al ejecutable, el programa aún necesita una unidad de CD presente, aunque no importa cual. Por lo tanto, en adición al texto *'MCDEX debe ser cargado'*, estamos frente a un salto muy sencillo.

De hecho, después de dar con el breakpoint en `INT 2F 1500`, hay varios chequeos y saltos, y por lo tanto, múltiples formas de craquear. Por diversión listé varias soluciones, así que elige la que más te guste.