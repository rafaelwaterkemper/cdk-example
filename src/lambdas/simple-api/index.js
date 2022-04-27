module.exports.handler = async function handler(event) {
  try {
    return {
      statusCode: 200,
      body: event.requestContext.domainName,
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: err.message }),
    };
  }
}
