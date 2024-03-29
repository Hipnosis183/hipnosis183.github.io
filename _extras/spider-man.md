---
layout: extra
language: "en"
code: "spider-man"
title: "Spider-Man The Sinister Six"
description: "Spanish Release - DOS (1996)"
name: "No-CD Patch"
thumb: /assets/images/extras/spider-man.jpg
---

<div id="spider-man" class="collapsible-show">No-CD Patch</div>
<div id="spider-man-data" class="content-show" markdown="1">
{% highlight lua %}
SPIDER.EXE > 0x68AD1  00 00 00 00 00 00 00 00
           > 0x68ADD  00 00 00
{% endhighlight %}
</div>
<br>

This one is very simple, since the game doesn't use `MSCDEX`, we discard looking for a device check. Instead, the game is checking for the files being located at a specific path, `C:\SPIDER\`. The drive letter gets overwritten with the value in `SETUP.CFG`, but if we leave that empty, it defaults to `C:\` again. But to be able to run the game from any path, we simply empty the strings `\spider\` and `%c:` on the executable.

However, there's another problem. For some reason, the game deletes some of its own files, required to play the game. Whether this is intentional, as a security measure, or it's just a weird unexpected behaviour remains a mystery. To overcome this problem, setting the game folders and files as *read-only* prevents the issue.