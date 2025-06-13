/**
 * Returns the content of an HTML file for templating.
 * @param {string} filename Name of the file to include.
 * @return {string} Contents of the requested HTML file.
 */
function include(filename) {
  if (typeof filename !== 'string' || !filename) {
    throw new Error('Filename must be a non-empty string');
  }
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}
