$(function () {
    // Using DeviantArt API.
    // Load statically the links (at least for now).
    var filePath = "/assets/da-links.txt";
    // Create and send the request to open the links file.
    var fileRequest = new XMLHttpRequest();
    fileRequest.open("GET", filePath, false);
    fileRequest.send();
    // Load the response if the request was successful.
    var result = fileRequest.status == 200 ? fileRequest.responseText : null;
    var deviationsLinks = result.split("\n");

    // Define the deviation structure.
    function Deviation(title, pubdate, thumbnail_url, fullsize_url) {
        this.title = title;
        this.pubdate = pubdate;
        this.thumbnail_url = thumbnail_url;
        this.fullsize_url = fullsize_url;
    };

    // Create list of deviation objects.
    var deviationsList = [];
    $.each(deviationsLinks, function (index, value) {
        // Get the data from the oEmbed API provided by DeviantArt.
        var deviation = 'https://backend.deviantart.com/oembed?url=' + value + '&format=jsonp&callback=?';
        // Parse the data. Note that this is an asynchronous function.
        $.getJSON(deviation).then(function (data) {
            // Get the 400 pixels wide version of the thumbnails.
            var thumbnail_url = data.thumbnail_url.replace('w_300', 'w_400').replace('300w', '400w');
            // Create a deviation object and push it to the array.
            deviationsList.push(new Deviation(data.title, Date.parse(data.pubdate), thumbnail_url, data.fullsize_url));
            // Check if all the JSON requests have been processed before continuing.
            if (deviationsList.length == deviationsLinks.length) {
                // Sort the list by date (in Unix time).
                deviationsList.sort(function (a, b) { return b.pubdate - a.pubdate });
                loaded();
            }
        });
    });

    function loaded() {
        // Loop through each deviation.
        $.each(deviationsList, function (index, value) {
            // Create the item and elements for the list.
            var graphItem = document.createElement("li");
            var graphImage = document.createElement("img");
            var graphTitle = document.createElement("p");
            var graphDate = document.createElement("p");
            // Assign the classes.
            graphItem.className = "graph-item";
            graphImage.className = "graph-image";
            graphTitle.className = "graph-title";
            graphDate.className = "graph-title graph-date";
            // Set the source for the thumbnail.
            graphImage.src = value.thumbnail_url;

            // Format the Unix date.
            var pubDate = new Date(value.pubdate);
            options = { year: 'numeric', month: 'long', day: 'numeric' };
            var formatDate = new Intl.DateTimeFormat('en-US', options);
            // Set the formatted date.
            graphDate.innerHTML = "Published • " + formatDate.format(pubDate);
            // Set the deviation title.
            graphTitle.innerHTML = value.title;

            // Append the item to the list.
            $("#graph-list").append($(graphItem).append(graphImage).append(graphDate).append(graphTitle));
        })
    }
});