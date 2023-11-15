function success(status, message, data) {
  return {
    success: true,
    status: status,
    message: message,
    data: data,
  };
}

function fail(status, message) {
  return {
    success: false,
    status: status,
    message: message,
  };
}

module.exports = { success, fail };
