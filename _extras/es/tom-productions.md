---
layout: extra
language: "es"
code: "tom-productions"
title: "Tom Productions"
description: "Nicolausi & PC-Bakterien - DOS/Windows"
name: "Generador de Llaves"
thumb: /assets/images/posts/the-art-of-cracks-and-keygens-nicolausi/thumb.jpg
css: /assets/styles/extras/tom-productions.css
javascript: /assets/scripts/extras/tom-productions.js
---

<div id="keygenContainer">
    <div id="keygenData">
        <input id="keygenInput" placeholder="Nombre" />
        <br>
        <div onClick="showMenu()" class="select">
            <input id="keygenGame" disabled placeholder="Seleccionar Juego" />
        </div>
        <div id="keygenSelect" class="select-dialog">
            <div class="select-modal">
                <div onClick="selectGame(1)" class="select-option">Nicolausi</div>
                <div onClick="selectGame(2)" class="select-option">PC-Bakterien</div>
            </div>
        </div>
    </div>
    <div id="keygenResults">
        <button onClick="keyGenerate()">Generar Llave</button>
        <br>
        <input id="keygenOutput" disabled placeholder="Llave" />
    </div>
</div>

<br>

{: .center-text }
El nombre debe estar compuesto por al menos dos palabras. Elige un juego de la lista y generá la llave.

{: .center-text }
Podés leer las especificaciones de la implementación en su [artículo dedicado](/blog/the-art-of-cracks-and-keygens-nicolausi/) y [GitHub](https://github.com/Hipnosis183/NicolausiKey).