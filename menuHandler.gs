function showSidebar() {
  try {
    SheetService.openOrCreateSheet();
    const htmlOutput = HtmlService
      .createHtmlOutputFromFile('sidebarTemplate')
      .setTitle('Log Meal');
    SpreadsheetApp.getUi().showSidebar(htmlOutput);
  } catch (error) {
    Logger.log('showSidebar error: %s', error.stack);
    SpreadsheetApp.getUi().alert('Unable to open the Calorie Tracker sidebar. Please try again later.');
  }
}

/**
 * Opens the statistics modal dialog.
 * Fetches aggregated stats data and injects it into the modal template.
 * If no data is available, alerts the user instead of opening an empty dialog.
 */
function openStatsModal() {
  try {
    const stats = SheetService.getStatsData();
    if (!stats) {
      SpreadsheetApp.getUi().alert('No statistics data available to display.');
      return;
    }
    const daily = stats.daily;
    const weekly = stats.weekly;
    const hasDaily = Array.isArray(daily) && daily.length > 0;
    const hasWeekly = Array.isArray(weekly) && weekly.length > 0;
    if (!hasDaily && !hasWeekly) {
      SpreadsheetApp.getUi().alert('No statistics data available to display.');
      return;
    }
    const template = HtmlService.createTemplateFromFile('statsModalTemplate');
    template.data = stats;
    const htmlOutput = template
      .evaluate()
      .setWidth(600)
      .setHeight(500);
    SpreadsheetApp.getUi().showModalDialog(htmlOutput, 'Statistics');
  } catch (error) {
    Logger.log('openStatsModal error: %s', error.stack);
    SpreadsheetApp.getUi().alert('Unable to open the Statistics modal. Please try again later.');
  }
}