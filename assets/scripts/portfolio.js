$(() => {
    // Get and manage software categories.
    const getSoftCategory = (cat) => {
        // Manage request to open the software projects file.
        let request = new XMLHttpRequest()
        request.open('GET', '/assets/software.json', true)
        request.onload = () => {
            // Load the response if the request was successful.
            if (request.readyState == 4 && request.status == 200) {
                // Parse and store response object.
                let response = JSON.parse(request.responseText)

                // Manage projects list element.
                let portList = document.createElement('div')
                portList.className = 'port-list'
                $.each(response[cat], (i, val) => {
                    // Manage projects list image element.
                    let portImage = document.createElement('img')
                    portImage.src = '/assets/images/portfolio/' + response[cat][i].name + '/logo.png'
                    portImage.onclick = () => { getSoftProject(cat, i) }
                    $(portList).append(portImage)
                })
                $('.port-list').replaceWith(portList)
            }
        }
        request.send()
    }

    // Get and manage software projects.
    const getSoftProject = (cat, i) => {
        // Manage request to open the software projects file.
        let request = new XMLHttpRequest()
        request.open('GET', '/assets/software.json', true)
        request.onload = () => {
            // Load the response if the request was successful.
            if (request.readyState == 4 && request.status == 200) {
                // Parse and store response object.
                let response = JSON.parse(request.responseText)

                // Manage project title element.
                $('.port-name').text(response[cat][i].title)

                // Manage project tags elements.
                let portTags = document.createElement('div')
                portTags.className = 'port-tags'
                $.each(response[cat][i].tags, (index, val) => {
                    // Manage project tag element.
                    let portTag = document.createElement('code')
                    portTag.innerHTML = val
                    $(portTags).append(portTag)
                })
                $('.port-tags').replaceWith(portTags)

                // Manage project link element.
                $('.port-link').attr('href', response[cat][i].link)

                // Manage project description element.
                $('.port-description').html(response[cat][i].description)

                // Manage project images elements.
                let portImages = document.createElement('div')
                portImages.className = 'port-images'
                if (response[cat][i].images == 0) {
                    portImages.style.display = 'none'
                }
                for (let k = 0; k < response[cat][i].images; k++) {
                    // Manage project image element.
                    let portImage = document.createElement('img')
                    let portCont = document.createElement('div')
                    portImage.src = '/assets/images/portfolio/' + response[cat][i].name + '/' + k + '-thumb.jpg'
                    portImage.onclick = () => {
                        $('.port-image-full').attr('src', '/assets/images/portfolio/' + response[cat][i].name + '/' + k + '.jpg')
                        document.getElementById('port-image-full').classList.toggle('port-image-open')
                    }
                    $(portImages).append($(portCont).append(portImage))
                }
                $('.port-images').replaceWith(portImages)
            }
        }
        request.send()
    }

    // Manage software categories selection.
    const getSoftSelect = (event, mode) => {
        let value = mode ? event : event.data.cat
        getSoftCategory(value)
        getSoftProject(value, 0)
        // Manage category buttons selection.
        switch (value) {
            case '0':
                $('#port-button-web').addClass('port-button-selected')
                $('#port-button-other').removeClass('port-button-selected')
                break
            case '1':
                $('#port-button-web').removeClass('port-button-selected')
                $('#port-button-other').addClass('port-button-selected')
                break
        }
    }

    // Manage category buttons.
    $('#port-button-web').click({ cat: '0' }, getSoftSelect)
    $('#port-button-other').click({ cat: '1' }, getSoftSelect)

    // Manage full image display state.
    $('.port-overlay').click(() => {
        document.getElementById('port-image-full').classList.toggle('port-image-open')
    })

    // Set default category and project.
    getSoftSelect('0', true)
})