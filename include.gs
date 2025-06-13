function include(filename) {
  if (typeof filename !== 'string' || filename.trim() === '') {
    throw new Error('Filename must be a non-empty string');
  }
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

