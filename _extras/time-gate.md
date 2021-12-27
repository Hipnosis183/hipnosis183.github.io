---
layout: extra
title: "Time Gate Knight's Chase"
description: "SVGA Re-Release - DOS (1995)"
name: "No-CD Patch"
thumb: /assets/images/extras/time-gate.jpg
---

<div id="time-gate" class="collapsible-show">No-CD Patch</div>
<div id="time-gate-data" class="content-show" markdown="1">
{% highlight php %}
'KNIGHTS.EXE' (SVGA)   |  'KNIGHTS.EXE' (VGA)
                       |
@0x8A7B8  2E           |  @0x8A7B8  2E
@0x77F6C  90 90 90 90  |  @0x77C16  90 90 90 90
{% endhighlight %}
</div>
<br>

The game doesn't check for the CD, but rather for the files under the folder `ANIM2D` on it. If there's no drive present (failing the installation check made with `MSCDEX`), then it defaults to the `A:` drive letter, searching for the folder under this path.

The path string is written in the final read memory location from 3 different parts: the drive letter, the directory and the file name (those 2 can be seen in the executable as strings).

The writting of the path in memory is done in 3 secuential parts of code, which despite being separated, share the same logic:

<br>

{% highlight none %}
0180:1C6020     31D2            XOR         EDX, EDX
0180:1C6022     8D442428        LEA         EAX, [ESP+0028]
0180:1C6026     268A13          MOV         DL, ES:[EBX]
0180:1C6029     FF542444        CALL        NEAR DWORD [ESP+0044]
0180:1C602D     43              INC         EBX
{% endhighlight %}

{: .center-text }
DOSBox Debugger disassembly extract.

<br>

- `EDX`: Character to write
- `EBX`: Pointer to character address
- `CALL`: Write character on memory (`0000:2121F0`)

<br>

Due to this behaviour (thanks compiler?) is possible to modify each of these 3 parts independently. So we can `NOP` @`0180:1C6029` to skip the drive letter processing. Then, if we modify the directory string on the data section of the executable from `:\ANIM2D` to `.\ANIM2D`, we can successfully make the final path of the file relative.