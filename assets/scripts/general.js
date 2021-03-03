$(function () {
    // Wait for everything to load before displaying.
    $(window).ready(function () {
        $("body").addClass("smooth");
    });

    // Switch between light and dark theme.
    $("button.theme-switch").click(function () {
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
        $(".material-icons").text(themeSwitch ? "wb_sunny" : "mode_night");
    }
});