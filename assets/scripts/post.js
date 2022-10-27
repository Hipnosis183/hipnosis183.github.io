$(() => {
  // Get all hidden collapsible buttons.
  let collapseHide = document.getElementsByClassName('collapsible-hide');
  for (let i = 0; i < collapseHide.length; i++) {
    // Attach a click listener to all buttons.
    $(collapseHide[i]).on('click', (e) => {
      // Select the box element and switch the visibility.
      let _content = document.getElementById(e.target.id);
      let content = document.getElementById(e.target.id + '-data');
      content.style.display = content.style.display === 'block' ? 'none' : 'block';
      // Toggle class to change the button color and text.
      content.classList.toggle('active');
      let lang = document.body.classList.contains('lang-es');
      _content.innerHTML = _content.classList.toggle('active')
        ? lang ? 'Presiona para ocultar el código' : 'Press to hide the code'
        : lang ? 'Presiona para mostrar el código' : 'Press to show the code';
      // This affects the element style, so it breaks its responsivity once pressed.
    });
  }
  // Get all shown collapsible buttons.
  let collapseShow = document.getElementsByClassName('collapsible-show');
  for (let i = 0; i < collapseShow.length; i++) {
    // Attach a click listener to all buttons.
    $(collapseShow[i]).on('click', (e) => {
      // Select the box element and switch the visibility.
      let _content = document.getElementById(e.target.id);
      let content = document.getElementById(e.target.id + '-data');
      content.style.display = content.style.display === 'block' ? 'none' : 'block';
      // Toggle class to change the button color and text.
      content.classList.toggle('active');
      _content.classList.toggle('active');
      // This affects the element style, so it breaks its responsivity once pressed.
    });
  }
});