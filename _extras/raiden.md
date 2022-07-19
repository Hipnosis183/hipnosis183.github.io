---
layout: extra
language: "en"
code: "raiden"
title: "Raiden"
description: "CD-ROM Release - DOS (1994)"
name: "Remove Copy Protection"
thumb: /assets/images/extras/raiden.jpg
---

<div id="raiden" class="collapsible-show">Remove Copy Protection</div>
<div id="raiden-data" class="content-show" markdown="1">
{% highlight php %}
'RAIDEN.EXE'

@0x4AF  90 90 90
{% endhighlight %}
</div>
<br>

A very straight forward word-in-manual check that happens at the beginning of execution.

<br>

{% highlight none %}
01ED:00A3       E8F7A8  CALL    FFFFA99D
01ED:00A6       E84EA9  CALL    FFFFA9F7
01ED:00A9       E81FAE  CALL    FFFFAECB
01ED:00AC       E8A793  CALL    FFFF9456
01ED:00AF       E861B2  CALL    FFFFB313
{% endhighlight %}

{: .center-text }
DOSBox Debugger disassembly extract.

<br>

Just by stepping over the initial functions, we can tell that the function call @`01ED:00AF` starts the check, so by `NOP`ing it we just bypass it completely.

The game already works without CD, but you'll be missing the great soundtrack.