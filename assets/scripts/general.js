$(() => {
  // Wait for everything to load before displaying.
  $(window).ready(() => {
    $('body').addClass('smooth');
    setTransitionTime(1);
  });

  // Open/close sidenav.
  $('div#menu-open').on('click', () => {
    $('#navbar-open').toggleClass('navbar-open');
    $('#navbar-overlay').toggleClass('navbar-open');
  });
  $('div#navbar-overlay').on('click', () => {
    $('#navbar-open').toggleClass('navbar-open');
    $('#navbar-overlay').toggleClass('navbar-open');
  });

  // Switch between light and dark theme.
  $('div#dark-mode').on('click', () => { switchTheme(); });
  // Check the local storage for theming.
  if (localStorage.getItem('theme') === 'dark') {
    if (!document.body.classList.contains('dark-mode')) {
      switchTheme();
    }
  }

  // Switch between english and spanish languages.
  $('div#language').on('click', () => { switchLanguage(); });

  // Set timer for short hovers and smooth transitions.
  const root = document.documentElement;
  const setTransitionTime = (timeout) => {
    if (!timeout) { root.style.setProperty('--time', '0.5s ease-in-out'); }
    else { setTimeout(() => { root.style.setProperty('--time', '0.2s'); }, 600); }
  }

  const switchTheme = () => {
    setTransitionTime(0);
    let theme = document.body.classList.toggle('dark-mode');
    // Store on the client's local storage for persistency.
    localStorage.setItem('theme', theme ? 'dark' : 'light');
    // Update dark mode button.
    updateTheme();
    setTransitionTime(1);
  }

  const switchLanguage = () => {
    let lang = localStorage.getItem('lang');
    // Store on the client's local storage for persistency.
    localStorage.setItem('lang', lang === 'en' ? 'es' : 'en');
    // Reload page for the changes to take effect.
    document.location.reload();
  }

  const updateTheme = () => {
    let theme = document.body.classList.contains('dark-mode');
    // Update dark mode button.
    $('#dark-icon-header').css('-webkit-mask-image', theme
      ? 'url(/assets/images/icons/icon-sunny.svg)'
      : 'url(/assets/images/icons/icon-moon.svg)');
    $('#dark-icon').css('-webkit-mask-image', theme
      ? 'url(/assets/images/icons/icon-sunny.svg)'
      : 'url(/assets/images/icons/icon-moon.svg)');
  }
  // Update dark mode button.
  updateTheme();
});