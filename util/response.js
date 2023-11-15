function success(status, message, data) {
  return {
    status: status,
    message: message,
    data: data,
  };
}

function fail(status, message) {
  return {
    status: status,
    message: message,
  };
}

module.exports = { success, fail };
