$(function () {
    // Wait for everything to load before displaying.
    $(window).ready(function () {
        $("body").addClass("smooth");
        setTransitionTime(1);
    });

    // Open/close sidenav.
    $("div#menu-open").click(function () {
        $("#navbar-open").toggleClass('navbar-open');
        $("#navbar-overlay").toggleClass('navbar-open');
    });
    $("div#navbar-overlay").click(function () {
        $("#navbar-open").toggleClass('navbar-open');
        $("#navbar-overlay").toggleClass('navbar-open');
    });

    // Switch between light and dark theme.
    $("div#dark-mode").click(function () {
        switchTheme();
    });
    // Check the local storage for theming.
    if (localStorage.getItem("theme") === "dark") {
        if (!document.body.classList.contains('dark-mode')) {
            switchTheme();
        }
    }

    // Set timer for short hovers and smooth transitions.
    const root = document.documentElement;
    function setTransitionTime(timeout) {
        if (!timeout) {
            root.style.setProperty('--time', '0.5s ease-in-out');
        } else {
            setTimeout(function () {
                root.style.setProperty('--time', '0.2s');
            }, 600);
        }
    }

    function switchTheme() {
        setTransitionTime(0);
        var themeSwitch = document.body.classList.toggle('dark-mode');
        // Store on the client's local storage for persistency.
        localStorage.setItem("theme", themeSwitch ? "dark" : "light");
        // Update dark mode button.
        updateTheme();
        setTransitionTime(1);
    }

    function updateTheme() {
        var themeSwitch = document.body.classList.contains('dark-mode');
        // Update dark mode button.
        $("#dark-icon-header").css("-webkit-mask-image", themeSwitch
            ? "url(/assets/images/icons/icon-sunny.svg)"
            : "url(/assets/images/icons/icon-moon.svg)");
        $("#dark-icon").css("-webkit-mask-image", themeSwitch
            ? "url(/assets/images/icons/icon-sunny.svg)"
            : "url(/assets/images/icons/icon-moon.svg)");
        $("#dark-text").text(themeSwitch ? "Light Mode" : "Dark Mode");
    }
    // Update dark mode button.
    updateTheme();
});