function handleError(error) {
  // Validate input
  if (error === undefined || error === null) {
    var missingErrMsg = 'handleError invoked without an error object';
    Logger.log(missingErrMsg);
    throw new Error(missingErrMsg);
  }
  // Determine message
  var message;
  try {
    if (typeof error === 'string') {
      message = error;
    } else if (error.message && typeof error.message === 'string') {
      message = error.message;
    } else {
      message = String(error);
    }
  } catch (e) {
    message = 'An unexpected error occurred.';
    Logger.log('Error while extracting message from error object: ' + (e.stack || String(e)));
  }
  // Log full error details
  Logger.log('Server error: ' + message);
  if (error.stack) {
    Logger.log('Stack trace: ' + error.stack);
  }
  console.error(message, error);
  // Return payload for client-side alert
  return {
    type: 'error',
    message: message
  };
}