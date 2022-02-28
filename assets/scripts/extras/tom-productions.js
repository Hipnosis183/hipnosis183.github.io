let globalSalt = 0x00000000
let nameInput = ""
let nameParsed = ""
let gameSelected = 0

const showMenu = () => {
    // Open game selection menu.
    let content = document.getElementById("keygenSelect")
    content.style.display = content.style.display === "block" ? "none" : "block"
}

const selectGame = (index) => {
    // Set global game index for the keygen.
    gameSelected = index
    // Change select display value.
    document.getElementById("keygenGame").value = index == 1 ? "Nicolausi" : "PC-Bakterien"
    // Close game selection menu.
    showMenu()
}

const keyGenerate = () => {
    // Get game parameters.
    const name = document.getElementById("keygenInput").value

    // Check if input mets conditions.
    if (!name || name.split(' ').length < 2 || !gameSelected) { return }

    // Set input name string.
    nameInput = name.toUpperCase()
    // Final key value to return.
    let keyCode = 0
    // Stores the result of the character being processed.
    let charSalt

    // Despite being calculated, their values are consistent.
    const mainSalt = gameSelected == 1 ? 0x03533335 : 0x00784326
    const localSalt = mainSalt >> 0x10 ^ mainSalt & 0xFFFF // 0x3066

    // Set global salt.
    setGlobalSalt(localSalt)

    // Parse the input string.
    while (nameInput.length != 0) {
        // Uppercase chars and remove spaces.
        nameFormat()

        // Reset global salt.
        setGlobalSalt(localSalt)

        // Set the first 4 bytes of the working string, needed for the hashing.
        let nameGlobal = nameParsed.padEnd(4, 0x00).toString(16)
        let nameGlobal32 = nameGlobal.slice(0, 4).toString(16)
        nameGlobal32 = nameConvert(nameGlobal32) & 0xFFFF0000

        while (nameParsed.length != 0) {
            // Set the lower 2 bytes of the working string, starting with the current character.
            let nameLocal = nameParsed.toString(16)
            let nameLocal16 = nameLocal.slice(0, 2).toString(16)
            nameLocal16 = nameConvert(nameLocal16) & 0xFFFFFFFF

            // Actual hashing.
            charSalt = returnGlobalSalt()
            charSalt = charSalt ^ (nameGlobal32 ^ nameLocal16)

            // Sum the result to the key.
            keyCode += parseInt(charSalt)

            // Remove char from parsed string.
            nameParsed = nameParsed.slice(1)
        }
    }

    // Return lower bytes of the final key code result.
    let result = keyCode & 0xFFFF | 0x2000
    document.getElementById("keygenOutput").value = result
}

const setGlobalSalt = (localSalt) => {
    // Set a 16-bit mask of the local salt.
    globalSalt = localSalt & 0xFFFF
}

const returnGlobalSalt = () => {
    // Hard-coded salt value.
    globalSalt = mulGlobalSalt(globalSalt, 0x15A4E35)
    globalSalt = (globalSalt & 0xFFFFFFFF) + 1
    // Return the higher 16-bits of the salt.
    return (globalSalt & 0xFFFFFFFF) >> 0x10 & 0x7FFF
}

const mulGlobalSalt = (a, b) => {
    let ah = (a >> 16) & 0xFFFF, al = a & 0xFFFF
    let bh = (b >> 16) & 0xFFFF, bl = b & 0xFFFF
    let high = ((ah * bl) + (al * bh)) & 0xFFFF
    return ((high << 16) >>> 0) + (al * bl)
}

const nameFormat = (localSalt) => {
    for (let letter of nameInput) {
        // Remove char from input string.
        nameInput = nameInput.slice(1)
        // Check if char is a space or number.
        if ((letter != ' ') && !(letter >= '0' && letter <= '9')) {
            // Add to the parsed string.
            nameParsed += letter
        }
        else { break }
    }
}

const nameConvert = (name) => {
    // Initialize hex output string.
    let nameGlobalArray = []
    for (let char of name) {
        // Convert each character into their hex value.
        nameGlobalArray.push(char.charCodeAt(0).toString(16))
    }
    return '0x' + nameGlobalArray.reverse().join('')
}