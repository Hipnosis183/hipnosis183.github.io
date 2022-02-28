---
layout: extra
title: "Tom Productions"
description: "Nicolausi & PC-Bakterien - DOS/Windows"
name: "Key Generator"
thumb: /assets/images/posts/the-art-of-cracks-and-keygens-nicolausi/thumb.jpg
css: /assets/styles/extras/tom-productions.css
javascript: /assets/scripts/extras/tom-productions.js
---

<div id="keygenContainer">
    <div id="keygenData">
        <input id="keygenInput" placeholder="Name Input" />
        <br>
        <div onClick="showMenu()" class="select">
            <input id="keygenGame" disabled placeholder="Game Select" />
        </div>
        <div id="keygenSelect" class="select-dialog">
            <div class="select-modal">
                <div onClick="selectGame(1)" class="select-option">Nicolausi</div>
                <div onClick="selectGame(2)" class="select-option">PC-Bakterien</div>
            </div>
        </div>
    </div>
    <div id="keygenResults">
        <button onClick="keyGenerate()">Generate Key</button>
        <br>
        <input id="keygenOutput" disabled placeholder="Key" />
    </div>
</div>

<br>

{: .center-text }
The name needs to be at least two words long. Select a game from the list and generate the key.

{: .center-text }
You can read the specifics of the implementation on its [dedicated article](/blog/the-art-of-cracks-and-keygens-nicolausi/) and [GitHub](https://github.com/Hipnosis183/NicolausiKey).