---
layout: extras
permalink: /extras/
title: Extras
---

# Cracks, Patches and Keygens

Here are some hacking projects that I've done throught the years. These range from PC (DOS and Windows) through Mobile (Android), going from simple checks and bypasses, to more convoluted situations requiring more complex analysis and reversing.

Most of the projects listed here don't have a dedicated article, since these are not interesting enough and there's not much to talk about to justify such a large and in-depth post.

<br>

<div class="post-grid">
  {% for extra in site.extras %}
  <div class="post-block">
    <span class="post-style" style="--url: url('{{ extra.thumb }}')"></span>
    <header class="post-header">
      <h1 class="post-title">
        <a class="post-link" href="">{{ extra.title }}</a>
      </h1>
      <div class="post-content">
        <div class="post-button">
          <code>{{ extra.name }}</code>
        </div>
        <p class="post-description">{{ extra.description }}</p>
      </div>
    </header>
    <a class="post-style" href="{{ extra.url }}"></a>
  </div>
  {% endfor %}
</div>