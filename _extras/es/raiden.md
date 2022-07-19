---
layout: extra
language: "es"
code: "raiden"
title: "Raiden"
description: "Versión CD-ROM - DOS (1994)"
name: "Protección Anti-copias Removida"
thumb: /assets/images/extras/raiden.jpg
---

<div id="raiden" class="collapsible-show">Protección Anti-copias Removida</div>
<div id="raiden-data" class="content-show" markdown="1">
{% highlight php %}
'RAIDEN.EXE'

@0x4AF  90 90 90
{% endhighlight %}
</div>
<br>

Un chequeo de manual muy simple que tiene lugar al inicio de la ejecución.

<br>

{% highlight none %}
01ED:00A3       E8F7A8  CALL    FFFFA99D
01ED:00A6       E84EA9  CALL    FFFFA9F7
01ED:00A9       E81FAE  CALL    FFFFAECB
01ED:00AC       E8A793  CALL    FFFF9456
01ED:00AF       E861B2  CALL    FFFFB313
{% endhighlight %}

{: .center-text }
Extracto del código desensamblado con el depurador de DOSBox.

<br>

Con solo pasar sobre las primeras funciones, podemos decir que la llamada en @`01ED:00AF` comienza el chequeo, así que con `NOP`earlo lo saltamos completamente.

El juego ya funciona sin CD, pero te estarías perdiendo de un buen soundtrack.