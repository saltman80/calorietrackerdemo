function addCustomMenu() {
  var cfg = getConfig();
  var MENU_NAME = cfg.ui.menuName;
  var MENU_ITEMS = cfg.ui.menuItems;

  // Validate configuration
  if (typeof MENU_NAME !== 'string' || MENU_NAME.trim() === '') {
    throw new Error('MENU_NAME must be a non-empty string in config.gs');
  }
  if (!Array.isArray(MENU_ITEMS) || MENU_ITEMS.length < 2) {
    throw new Error('MENU_ITEMS must be an array with at least two items in config.gs');
  }
  // Build the custom menu
  var ui = SpreadsheetApp.getUi();
  ui.createMenu(MENU_NAME)
    .addItem(MENU_ITEMS[0], 'showSidebar')
    .addItem(MENU_ITEMS[1], 'openStatsModal')
    .addToUi();
}

function onOpen() {
  try {
    addCustomMenu();
  } catch (error) {
    // Delegate to centralized error handler
    if (typeof handleError === 'function') {
      handleError(error);
    } else if (typeof errorHandler !== 'undefined' && typeof errorHandler.handleError === 'function') {
      errorHandler.handleError(error);
    } else {
      console.error('Error initializing Calorie Tracker menu:', error);
    }
  }
}

function onInstall() {
  // onInstall should behave the same as onOpen
  onOpen();
}