$(function () {
    // Get all collapsible buttons.
    var collapse = document.getElementsByClassName("collapsible");
    
    for (var i = 0; i < collapse.length; i++) {
        // Attach a click listener to all buttons.
        collapse[i].addEventListener("click", function () {
            // Select the box element and switch the visibility.
            var content = document.getElementById(this.id + "-data");
            content.style.display = content.style.display === "block" ? "none" : "block";
            // Toggle class to change the button color and text.
            content.classList.toggle("active");
            this.innerHTML = this.classList.toggle("active") ? "Press to hide the code" : "Press to show the code";
            // This affects the element style, so it breaks its responsivity once pressed.
        });
    }
});