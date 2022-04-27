const { generateRandomlyWord } = require('./word-generator/word-generator');

module.exports.handler = async function handler(event) {
    const word = generateRandomlyWord();
    console.log("The generated word was: " + word);
    try {
        return {
            statusCode: 200,
            body: generateRandomlyWord()
        };
    } catch (err) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: err.message }),
        };
    }
}
