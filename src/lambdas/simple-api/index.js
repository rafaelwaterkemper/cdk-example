module.exports.handler = async function handler(event) {
  try {
    return {
      statusCode: 200,
      body: "Hello world from AWS"
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: err.message }),
    };
  }
}
