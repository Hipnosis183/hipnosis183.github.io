$(() => {
    // Global definitions.
    const api = 'https://backend.deviantart.com/rss.xml?q=gallery%3Ahipnosis183%2F67799208'
    const offset = 60
    let response = []
    let deviations = []

    // Get and manage the design category.
    const getDesignCategory = (url, reset) => {
        // Reset deviations variables.
        if (reset) {
            response = []
            deviations = []
        }
        // Manage request to DeviantArt RSS API.
        let request = new XMLHttpRequest()
        request.open('GET', url, true)
        request.onload = () => {
            // Load the response if the request was successful.
            if (request.readyState == 4 && request.status == 200) {
                // Store local request response.
                let res = $(request.responseXML.documentElement).find('item')
                // Store global request response.
                $.each(res, (i, val) => { response.push(val) })
                // Fetch more results (recurse) if the limit is reached.
                if (res.length == offset) {
                    getDesignCategory(api + '&offset=' + offset)
                } else {
                    // Create the deviation objects.
                    $.each(response, (i, val) => {
                        // Format deviation date.
                        let date = new Date($(val).find('pubDate').text());
                        let options = { year: 'numeric', month: 'long', day: 'numeric' };
                        let formatted = new Intl.DateTimeFormat('en-US', options);
                        // Build deviantion object.
                        let deviation = {
                            title: $(val).find('title').text(),
                            link: $(val).find('link').text(),
                            date: "Published • " + formatted.format(date),
                            image: $(val).find('media\\:content').attr('url'),
                            thumb: $($(val).find('media\\:thumbnail')[1]).attr('url')
                        }
                        // Add deviation to list.
                        deviations.push(deviation)
                    })

                    // Create the HTML elements for the deviations.
                    // Manage deviations grid element.
                    let portGrid = document.createElement('div')
                    portGrid.className = 'port-grid'

                    // Manage deviations grid element for mobile.
                    let portGridMobile = document.createElement('div')
                    portGridMobile.className = 'port-grid-mobile'

                    $.each(deviations, (i, val) => {
                        // Manage deviation container element.
                        let portContainer = document.createElement('div')
                        portContainer.className = 'port-design-container'

                        // Manage deviation container element for mobile.
                        let portContainerMobile = document.createElement('div')
                        portContainerMobile.className = 'port-design-container'

                        // Manage deviation information element.
                        let portInfo = document.createElement('div')
                        portInfo.className = 'port-design-info'

                        // Manage deviation overlay element.
                        let portOverlay = document.createElement('div')
                        portOverlay.className = 'port-design-overlay'

                        // Manage deviation content element.
                        let portContent = document.createElement('div')
                        portContent.className = 'port-design-content'

                        // Manage deviation date element.
                        let portDate = document.createElement('p')
                        portDate.className = 'port-design-date'
                        portDate.innerHTML = val.date

                        // Manage deviation title element.
                        let portTitle = document.createElement('p')
                        portTitle.className = 'port-design-title'
                        portTitle.innerHTML = val.title

                        // Manage deviation buttons elements.
                        let portButtons = document.createElement('div')
                        portButtons.className = 'port-design-buttons'

                        // Manage deviation link button element.
                        let portButtonLink = document.createElement('a')
                        portButtonLink.className = 'port-design-button'
                        portButtonLink.href = val.link
                        portButtonLink.rel = 'noopener noreferrer'
                        portButtonLink.target = '_blank'
                        let portIcon = document.createElement('div')
                        portIcon.className = 'port-design-icon'
                        $(portButtonLink).append(portIcon)

                        // Manage deviation full size button element.
                        let portButtonFull = document.createElement('div')
                        portButtonFull.className = 'port-design-button'
                        portButtonFull.innerHTML = 'View Full Size'
                        portButtonFull.onclick = () => {
                            $('.port-image-full').attr('src', val.image)
                            document.getElementById('port-image-full').classList.toggle('port-image-open')
                        }
                        $(portButtons).append(portButtonLink).append(portButtonFull)
                        $(portContent).append($(portDate).clone()).append($(portTitle).clone()).append(portButtons)
                        $(portInfo).append(portOverlay).append(portContent)

                        // Manage deviation image element.
                        let portImage = document.createElement('img')
                        portImage.onclick = () => { window.open(val.link) }
                        portImage.src = val.thumb
                        $(portContainer).append(portInfo).append(portImage.cloneNode())
                        $(portContainerMobile).append(portImage).append(portDate).append(portTitle)
                        $(portGrid).append(portContainer)
                        $(portGridMobile).append(portContainerMobile)
                    })
                    // Manage design content element.
                    let portDesign = document.createElement('div')
                    portDesign.className = 'port-design'
                    $(portDesign).append(portGrid)
                    $('.port-design').replaceWith(portDesign)

                    // Manage design content element for mobile.
                    let portDesignMobile = document.createElement('div')
                    portDesignMobile.className = 'port-design-mobile'
                    $(portDesignMobile).append(portGridMobile)
                    $('.port-design-mobile').replaceWith(portDesignMobile)
                }
            }
        }
        request.send()
    }

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

                // Manage projects container element for mobile.
                let portContent = document.createElement('div')
                portContent.className = 'port-content-mobile'
                $.each(response[cat], async (i, val) => {
                    // Timeout because JavaScript is bullshit.
                    await new Promise(r => setTimeout(r, 100));
                    // Manage projects list image element.
                    let portImageLite = document.createElement('img')
                    portImageLite.className = 'logo-lite'
                    portImageLite.src = '/assets/images/portfolio/' + response[cat][i].name + (response[cat][i].dark ? '/logo-lite.svg' : '/logo.svg')
                    portImageLite.onclick = () => {
                        let portBlock = document.getElementsByClassName('port-block')[0]
                        portBlock.classList.toggle('port-block-open')
                        setTimeout(() => {
                            getSoftProject(cat, i)
                            setTimeout(() => { portBlock.classList.toggle('port-block-open') }, 100)
                        }, 200)
                    }
                    let portImageDark = document.createElement('img')
                    portImageDark.className = 'logo-dark'
                    portImageDark.src = '/assets/images/portfolio/' + response[cat][i].name + (response[cat][i].dark ? '/logo-dark.svg' : '/logo.svg')
                    portImageDark.onclick = () => {
                        let portBlock = document.getElementsByClassName('port-block')[0]
                        portBlock.classList.toggle('port-block-open')
                        setTimeout(() => {
                            getSoftProject(cat, i)
                            setTimeout(() => { portBlock.classList.toggle('port-block-open') }, 100)
                        }, 200)
                    }

                    // Manage project header element for mobile.
                    let portHeader = document.createElement('div')
                    portHeader.className = 'port-header-mobile'
                    $(portHeader).append(portImageLite.cloneNode())
                    $(portHeader).append(portImageDark.cloneNode())
                    $(portList).append(portImageLite)
                    $(portList).append(portImageDark)

                    // Manage project body element for mobile.
                    let portBody = document.createElement('div')
                    portBody.className = 'port-body-mobile'

                    // Manage project title element for mobile.
                    let portTitle = document.createElement('div')
                    portTitle.className = 'port-name-mobile'
                    portTitle.innerHTML = response[cat][i].title
                    $(portBody).append(portTitle)

                    // Manage project tags element for mobile.
                    let portTags = document.createElement('div')
                    portTags.className = 'port-tags-mobile'
                    $.each(response[cat][i].tags, (index, val) => {
                        // Manage project tag element for mobile.
                        let portTag = document.createElement('code')
                        portTag.innerHTML = val
                        $(portTags).append(portTag)
                    })
                    $(portBody).append(portTags)

                    // Manage project link element for mobile.
                    let portLink = document.createElement('a')
                    portLink.className = 'port-link-mobile'
                    portLink.href = response[cat][i].link
                    portLink.innerHTML = '<p>Visit on GitHub</p><div class="port-icon"></div>'
                    $(portBody).append(portLink)

                    // Manage project description element for mobile.
                    let portDescription = document.createElement('div')
                    portDescription.className = 'port-description-mobile'
                    portDescription.innerHTML = response[cat][i].description
                    $(portBody).append(portDescription)
                    $(portContent).append(portHeader).append(portBody)
                })
                $('.port-list').replaceWith(portList)
                $('.port-content-mobile').replaceWith(portContent)
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
                    portImage.src = '/assets/images/portfolio/' + response[cat][i].name + '/' + k + '-thumb.png'
                    portImage.onclick = () => {
                        $('.port-image-full').attr('src', '/assets/images/portfolio/' + response[cat][i].name + '/' + k + '.png')
                        document.getElementById('port-image-full').classList.toggle('port-image-open')
                    }
                    $(portImages).append($(portCont).append(portImage))
                }
                $('.port-images').replaceWith(portImages)
            }
        }
        request.send()
    }

    // Manage category buttons selection.
    const setPortButtons = (value) => {
        switch (value) {
            case '0':
                $('#port-button-web').addClass('port-button-selected')
                $('#port-button-other').removeClass('port-button-selected')
                $('#port-button-design').removeClass('port-button-selected')
                break
            case '1':
                $('#port-button-web').removeClass('port-button-selected')
                $('#port-button-other').addClass('port-button-selected')
                $('#port-button-design').removeClass('port-button-selected')
                break
            case '2':
                $('#port-button-web').removeClass('port-button-selected')
                $('#port-button-other').removeClass('port-button-selected')
                $('#port-button-design').addClass('port-button-selected')
                break
        }
        switch (value) {
            case '0':
            case '1':
                $('.port-content').css('display', 'flex')
                $('.port-content-mobile').css('display', 'flex')
                $('.port-design').css('display', 'none')
                $('.port-design-mobile').css('display', 'none')
                $('.port-list').css('display', 'block')
                break
            case '2':
                $('.port-content').css('display', 'none')
                $('.port-content-mobile').css('display', 'none')
                $('.port-design').css('display', 'block')
                $('.port-design-mobile').css('display', 'block')
                $('.port-list').css('display', 'none')
                break
        }
    }

    // Manage categories selection.
    const getCategorySelect = (event, mode) => {
        let value = mode ? event : event.data.cat
        let portContents = document.getElementsByClassName('port-contents')[0]
        let portContentsMobile = document.getElementsByClassName('port-contents-mobile')[0]
        portContents.classList.toggle('port-contents-open')
        portContentsMobile.classList.toggle('port-contents-open')
        setTimeout(() => {
            if (value != '2') {
                getSoftCategory(value)
                getSoftProject(value, 0)
                setPortButtons(value)
            } else {
                getDesignCategory(api, true)
                setPortButtons(value)
            }
            setTimeout(() => {
                portContents.classList.toggle('port-contents-open')
                portContentsMobile.classList.toggle('port-contents-open')
            }, 100)
        }, 200)
    }

    // Manage category buttons.
    $('#port-button-web').click({ cat: '0' }, getCategorySelect)
    $('#port-button-other').click({ cat: '1' }, getCategorySelect)
    $('#port-button-design').click({ cat: '2' }, getCategorySelect)

    // Manage full image display state.
    $('.port-overlay').click(() => {
        document.getElementById('port-image-full').classList.toggle('port-image-open')
    })

    // Set default category and project.
    getCategorySelect('0', true)
})