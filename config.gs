function getConfig() {
  var sheetConfig = {
    name: 'Calorie Tracker',
    headerRowIndex: 1,
    headers: [
      'Date',
      'Calories',
      'Meal Description',
      'Meal Type',
      'Water (oz)',
      'Weight (optional)'
    ]
  };
  var uiConfig = {
    menuName: 'Calorie Tracker',
    menuItems: [
      'Open Tracker',
      'View Statistics'
    ]
  };
  var themeConfig = {
    primaryColor: '#4CAF50',
    secondaryColor: '#FFF9C4',
    headerFontColor: '#000000',
    headerFontSize: 12
  };
  var chartsConfig = {
    caloriesChart: {
      type: 'LineChart',
      options: {
        title: 'Calories Over Time',
        width: 600,
        height: 400,
        hAxis: { title: 'Date' },
        vAxis: { title: 'Calories' },
        colors: ['#4CAF50'],
        legend: { position: 'none' }
      }
    },
    waterWeightChart: {
      type: 'ColumnChart',
      options: {
        title: 'Water and Weight Trends',
        width: 600,
        height: 400,
        hAxis: { title: 'Date' },
        vAxes: {
          0: { title: 'Water (oz)' },
          1: { title: 'Weight' }
        },
        series: {
          0: { targetAxisIndex: 0, color: '#2196F3' },
          1: { targetAxisIndex: 1, color: '#FF9800' }
        },
        legend: { position: 'bottom' }
      }
    }
  };
  return {
    // top?level constants for global consumers
    MEAL_TYPES: ['Breakfast', 'Lunch', 'Dinner', 'Snack'],
    SHEET_NAME: sheetConfig.name,
    HEADER_TITLES: sheetConfig.headers,
    COLOR_PRIMARY: themeConfig.primaryColor,
    COLOR_SECONDARY: themeConfig.secondaryColor,
    // nested config
    sheet: sheetConfig,
    ui: uiConfig,
    theme: themeConfig,
    charts: chartsConfig
  };
}