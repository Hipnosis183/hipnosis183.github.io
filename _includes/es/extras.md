# Otros Proyectos

Algunos proyectos de hacking que he hecho durante los años. Estos incluyen software para PC (DOS y Windows) y plataformas móviles (Android), yendo de chequeos y saltos simples, a situaciones más complejas que requieren un análisis y reversing más profundo.

La mayoría de los proyectos listados no tienen un artículo dedicado, ya que no son lo suficientemente interesantes o no hay mucho para hablar, al menos no de forma que justifique una redacción en profundidad.

<br>

<div class="post-grid">
  {% assign extras = site.extras | where: "language", "es" %}
  {% for extra in extras %}
  <div class="post-block">
    <a class="post-style" href="{{ extra.url | relative_url }}">
      <div class="post-image"
        style="background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.8)), url('{{ extra.thumb }}')">
      </div>
    </a>
    <header class="post-header" style="pointer-events: none;">
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
  </div>
  {% endfor %}
</div>