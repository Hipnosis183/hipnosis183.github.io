---
layout: patches
permalink: /patches/
title: Patches & Cracks
---

# Patches and Cracks

Here are some patches and cracks that I've done throught the years. These are for PC (DOS and Windows) video games and Android applications, going from very simple checks and bypasses, to more convoluted situations with deeper analysis being required.

All the information and research showcased here is built from the ground up. This means that no patches or cracks have been taken nor adapted from external sources. I clarify this because, while I've done that in some cases (and still do, sometimes there's no need to reinvent the wheel), those would provide no value to the contents of this page.

These are here because I don't think they are interesting enough cases to dedicate an article to each. That being said, here are, in alphabetical order, each with its patch and a short description/explanation on how it was reverse engineered:

<br>

## Litil Divil
### CD-ROM Release - DOS (1993)

<button id="patch-litildivil" class="collapsible">No-CD Patch</button>
<div id="patch-litildivil-data" class="content" markdown="1">

{: .center-text }
{% highlight php %}
'DIVIL.EXE'

@0xE672 -> 01
----------------
@0xE673 -> 90 90
-------------------
@0xE7BB -> 90 90 90
-------------------
@0xEC96 -> 90 90
{% endhighlight %}

<br>

After feeding the executable with the *"installation"* path as a parameter, the game still requires a CD to be present, but it doesn't care which. As such, in addition to the text *"MCDEX must be loaded"*, we are within a very simple bypass.

In fact, after hitting the breakpoint at `INT 2F 1500` there are multiple checks and jumps, and thus, multiple ways to crack. We can even just bypass the function call as a whole. Just for fun I listed a bunch, so pick the one you like the most.

</div>

<br>

## Raiden
### CD-ROM Release - DOS (1994)

<button id="patch-raiden" class="collapsible">Remove Copy Protection</button>
<div id="patch-raiden-data" class="content" markdown="1">

{: .center-text }
{% highlight php %}
'RAIDEN.EXE'

@0x4AF -> 90 90 90
{% endhighlight %}

<br>

A very straight forward word-in-manual check that happens at the beginning of execution.

<br>

{% highlight m68k %}
01ED:00A3       E8F7A8	CALL    FFFFA99D
01ED:00A6	E84EA9	CALL	FFFFA9F7
01ED:00A9	E81FAE	CALL	FFFFAECB
01ED:00AC	E8A793	CALL	FFFF9456
01ED:00AF	E861B2	CALL	FFFFB313
{% endhighlight %}

{: .center-text }
DOSBox Debugger disassembly extract.

<br>

Just by stepping over the initial functions, we can tell that the function call @`01ED:00AF` starts the check, so by `NOP`ing it we just bypass it completely.

The game already works without CD, but you'll be missing the great soundtrack.

</div>

<br>

## Spider-Man The Sinister Six
### Spanish Release - DOS (1996)

<button id="patch-spiderman" class="collapsible">No-CD Patch</button>
<div id="patch-spiderman-data" class="content" markdown="1">

{: .center-text }
{% highlight php %}
'SPIDER.EXE'

@0x68AD1 -> 00 00 00 00 00 00 00 00
@0x68ADD -> 00 00 00
{% endhighlight %}

<br>

This one is very simple, since the game doesn't use `MSCDEX`, we discard looking for a device check. Instead, the game is checking for the files being located at a specific path, `C:\SPIDER\`. The drive letter gets overwritten with the value in `SETUP.CFG`, but if we leave that empty, it defaults to `C:\` again. But to be able to run the game from any path, we simply empty the strings `\spider\` and `%c:` on the executable.

However, there's another problem. For some reason, the game deletes some of its own files, required to play the game. Whether this is intentional, as a security measure, or it's just a weird unexpected behaviour remains a mystery. To overcome this problem, setting the game folders and files as *read-only* prevents the issue.

</div>

<br>

## Time Gate Knight's Chase
### SVGA Re-Release - DOS (1995)

<button id="patch-timegate" class="collapsible">No-CD Patch</button>
<div id="patch-timegate-data" class="content" markdown="1">

{: .center-text }
{% highlight php %}
'KNIGHTS.EXE' (SVGA)

@0x8A7B8 -> 2E
@0x77F6C -> 90 90 90 90

'KNIGHTS.EXE' (VGA)

@0x8A7B8 -> 2E
@0x77C16 -> 90 90 90 90
{% endhighlight %}

<br>

The game doesn't check for the CD, but rather for the files under the folder `ANIM2D` on it. If there's no drive present (failing the installation check made with `MSCDEX`), then it defaults to the `A:` drive letter, searching for the folder under this path.

The path string is written in the final read memory location from 3 different parts: the drive letter, the directory and the file name (those 2 can be seen in the executable as strings).

The writting of the path in memory is done in 3 secuential parts of code, which despite being separated, share the same logic:

<br>

{% highlight m68k %}
0180:1C6020	31D2		XOR	    EDX, EDX
0180:1C6022	8D442428	LEA	    EAX, [ESP+0028]
0180:1C6026	268A13		MOV	    DL, ES:[EBX]
0180:1C6029	FF542444	CALL	    NEAR DWORD [ESP+0044]
0180:1C602D	43              INC	    EBX
{% endhighlight %}

{: .center-text }
DOSBox Debugger disassembly extract.

<br>

- `EDX`: Character to write
- `EBX`: Pointer to character address
- `CALL`: Write character on memory (`0000:2121F0`)

<br>

Due to this behaviour (thanks compiler?) is possible to modify each of these 3 parts independently. So we can `NOP` @`0180:1C6029` to skip the drive letter processing. Then, if we modify the directory string on the data section of the executable from `:\ANIM2D` to `.\ANIM2D`, we can successfully make the final path of the file relative.

</div>