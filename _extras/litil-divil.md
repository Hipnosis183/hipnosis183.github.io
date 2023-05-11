---
layout: extra
language: "en"
code: "litil-divil"
title: "Litil Divil"
description: "CD-ROM Release - DOS (1993)"
name: "No-CD Patch"
thumb: /assets/images/extras/litil-divil.jpg
---

<div id="litil-divil" class="collapsible-show">No-CD Patch</div>
<div id="litil-divil-data" class="content-show" markdown="1">
{% highlight lua %}
DIVIL.EXE > 0xE672  01
{% endhighlight %}
{% highlight lua %}
DIVIL.EXE > 0xE673  90 90
{% endhighlight %}
{% highlight lua %}
DIVIL.EXE > 0xE7BB  90 90 90
{% endhighlight %}
{% highlight lua %}
DIVIL.EXE > 0xEC96  90 90
{% endhighlight %}
</div>
<br>

After feeding the executable with the *'installation'* path as a parameter, the game still requires a CD to be present, but it doesn't care which. As such, in addition to the text *'MCDEX must be loaded'*, we are within a very simple bypass.

In fact, after hitting the breakpoint at `INT 2F 1500` there are multiple checks and jumps, and thus, multiple ways to crack. We can even just bypass the function call as a whole. Just for fun I listed a bunch, so pick the one you like the most.