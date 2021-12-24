$(function () {
    // Wait for everything to load before displaying.
    $(window).ready(function () {
        $("body").addClass("smooth");
    });

    // Open/close sidenav.
    $("div#menu-open").click(function () {
        $("#navbar-open").toggleClass('navbar-open')
        $("#navbar-overlay").toggleClass('navbar-open')
    });
    $("div#navbar-overlay").click(function () {
        $("#navbar-open").toggleClass('navbar-open')
        $("#navbar-overlay").toggleClass('navbar-open')
    });

    // Switch between light and dark theme.
    $("div#dark-mode").click(function () {
        switchTheme();
    });
    // Check the local storage for theming.
    if (localStorage.getItem("theme") === "dark") {
        switchTheme();
    }

    function switchTheme() {
        var themeSwitch = document.body.classList.toggle('dark-mode');
        // Store on the client's local storage for persistency.
        localStorage.setItem("theme", themeSwitch ? "dark" : "light");
        // Update dark mode button.
        $("#dark-icon").css("-webkit-mask-image", themeSwitch
            ? "url(/assets/images/icons/icon-sunny.svg)"
            : "url(/assets/images/icons/icon-moon.svg)")
        $("#dark-text").text(themeSwitch ? "Light Mode" : "Dark Mode")
    }
});