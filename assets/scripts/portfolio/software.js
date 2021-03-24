$(function () {
    // Load the software objects.
    var filePath = "/assets/software.json";
    // Create and send the request to open the objects file.
    var fileRequest = new XMLHttpRequest();
    fileRequest.open("GET", filePath, false);
    fileRequest.send();
    // Load the response if the request was successful.
    var softList = fileRequest.status == 200 ? JSON.parse(fileRequest.responseText) : null;

    $.each(softList.software, function (index, value) {
        // Create the item and elements for the list.
        var softItem = document.createElement("li");
        var softMask = document.createElement("div");
        var softCont = document.createElement("div");
        var softBack = document.createElement("div");
        var softInfo = document.createElement("div");
        var softImage = document.createElement("img");
        var softLink = document.createElement("a");
        var softTitle = document.createElement("p");
        var softAbout = document.createElement("p");
        // Elements for mobile screens.
        var softM = document.createElement("div");
        var softTitleM = document.createElement("p");
        var softAboutM = document.createElement("p");

        // Assign the classes.
        softItem.className = "soft-item";
        softMask.className = "soft-mask";
        softCont.className = "soft-mask soft-cont";
        softBack.className = "soft-back";
        softInfo.className = "soft-info";
        softImage.className = "soft-image";
        softLink.className = "soft-link";
        softTitle.className = "soft-title";
        softAbout.className = "soft-title soft-about";
        // Classes for mobile screens.
        softM.className = 'soft-m';
        softTitleM.className = "soft-title-m";
        softAboutM.className = "soft-title-m soft-about-m";

        // Set the software information.
        softTitle.innerHTML = value.name;
        softTitleM.innerHTML = value.name;
        softAbout.innerHTML = value.about;
        softAboutM.innerHTML = value.about;
        // Set the source for the thumbnail.
        softImage.src = value.img;
        // Set the external link for the software.
        softLink.href = value.link;

        // Append the item to the list.
        $(softCont).append(softBack).append($(softInfo).append(softTitle).append(softAbout));
        $(softM).append(softTitleM).append(softAboutM);
        $("#soft-list").append($(softItem).append(softCont).append($(softMask).append(softLink)).append(softImage).append(softM));
    });

    // Wait for the whole list to be loaded and ready.
    $("#soft-list").ready(function () {
        $("li").addClass("smooth-li");
    });

    // Manage hovering and clicking over items.
    $(document).on('mouseenter', 'div[class=soft-mask]', function (event) {
        $(event.target).prev().addClass('show-info');
    });
    $(document).on('mouseleave', 'div[class=soft-mask]', function (event) {
        $(event.target).prev().removeClass('show-info');
    });
    $(document).on('click', 'div[class=soft-mask]', function (event) {
        window.open($(event.target).find('a')[0].href);
        return false;
    });
    $(document).on('click', 'img[class=soft-image]', function (event) {
        window.open($(event.target).prev().find('a')[0].href);
        return false;
    });
});