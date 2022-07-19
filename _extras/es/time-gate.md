---
layout: extra
language: "es"
code: "time-gate"
title: "Time Gate Knight's Chase"
description: "Relanzamiento SVGA - DOS (1995)"
name: "Parche No-CD"
thumb: /assets/images/extras/time-gate.jpg
---

<div id="time-gate" class="collapsible-show">Parche No-CD</div>
<div id="time-gate-data" class="content-show" markdown="1">
{% highlight php %}
'KNIGHTS.EXE' (SVGA)   |  'KNIGHTS.EXE' (VGA)
                       |
@0x8A7B8  2E           |  @0x8A7B8  2E
@0x77F6C  90 90 90 90  |  @0x77C16  90 90 90 90
{% endhighlight %}
</div>
<br>

El programa no chequea la presencia del CD, sino los archivos que tiene dentro del directorio `ANIM2D`. Si no hay ningún dispositivo presente (fallando el chequeo de instalación realizado con `MSCDEX`), entonces lo busca en la unidad con la letra `A:`.

La cadena de texto con la ruta se escribe en memoria en tres partes diferentes: la letra de unidad, el directorio y el nombre del archivo (los dos últimos se encuentran en el ejecutable como texto).

La escritura de la ruta en memoria se produce en tres partes consecuentes de código, separadas, pero compartiendo la misma lógica:

<br>

{% highlight none %}
0180:1C6020     31D2            XOR         EDX, EDX
0180:1C6022     8D442428        LEA         EAX, [ESP+0028]
0180:1C6026     268A13          MOV         DL, ES:[EBX]
0180:1C6029     FF542444        CALL        NEAR DWORD [ESP+0044]
0180:1C602D     43              INC         EBX
{% endhighlight %}

{: .center-text }
Extracto del código desensamblado con el depurador de DOSBox.

<br>

- `EDX`: Caracter a escribir
- `EBX`: Puntero a la dirección del caracter
- `CALL`: Escribe el caracter en memoria (`0000:2121F0`)

<br>

Por este comportamiento, es posible modificar cada una de estas tres partes de forma separada. Por lo tanto, podemos poner un `NOP` en @`0180:1C6029` para saltar el procesamiento de la letra de la unidad. Entonces, si modificamos el texto con la ruta del directorio en la sección de datos en el ejecutable de `:\ANIM2D` a `.\ANIM2D`, podemos hacer que la ruta final sea relativa.