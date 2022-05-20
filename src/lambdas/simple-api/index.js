module.exports.handler = async function handler(event) {
  try {
    return {
      statusCode: 200,
      body: "Changing the response"
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: err.message }),
    };
  }
}
