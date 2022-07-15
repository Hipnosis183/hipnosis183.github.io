$(() => {
  // Get all hidden collapsible buttons.
  let collapseHide = document.getElementsByClassName('collapsible-hide');
  for (let i = 0; i < collapseHide.length; i++) {
    // Attach a click listener to all buttons.
    collapseHide[i].addEventListener('click', () => {
      // Select the box element and switch the visibility.
      let content = document.getElementById(this.id + '-data');
      content.style.display = content.style.display === 'block' ? 'none' : 'block';
      // Toggle class to change the button color and text.
      content.classList.toggle('active');
      this.innerHTML = this.classList.toggle('active') ? 'Press to hide the code' : 'Press to show the code';
      // This affects the element style, so it breaks its responsivity once pressed.
    });
  }
  // Get all shown collapsible buttons.
  let collapseShow = document.getElementsByClassName('collapsible-show');
  for (let i = 0; i < collapseShow.length; i++) {
    // Attach a click listener to all buttons.
    collapseShow[i].addEventListener('click', () => {
      // Select the box element and switch the visibility.
      let content = document.getElementById(this.id + '-data');
      content.style.display = content.style.display === 'block' ? 'none' : 'block';
      // Toggle class to change the button color and text.
      content.classList.toggle('active');
      this.classList.toggle('active');
      // This affects the element style, so it breaks its responsivity once pressed.
    });
  }
});