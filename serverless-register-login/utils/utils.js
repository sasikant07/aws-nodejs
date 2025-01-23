const buildResponse = (statusCode, body) => {
    return {
      statusCode: statusCode,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      body: body,
    };
  };
  
  export default buildResponse;