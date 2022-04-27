const startASCIICodeLetterUpperCase = 65;
const numberOfLettersUpperCase = 25;
const maxSizeLetters = 10;

function generateRandomlyWord() {
    const size = Math.random() * (maxSizeLetters + 1);
    const charCodes = [];
    for (let i = 0; i < size; i++) {
        const charCode = Math.round(Math.random() * (numberOfLettersUpperCase + 1)) + startASCIICodeLetterUpperCase;
        charCodes.push(charCode);
    }
    return String.fromCharCode(...charCodes);
}

module.exports = { generateRandomlyWord }