var config = getConfig();

var SheetService = {
  openOrCreateSheet: function() {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var name = config.sheet.name;
    var headerTitles = config.sheet.headers;
    var sheet = ss.getSheetByName(name);
    var shouldConfigure = false;
    if (!sheet) {
      sheet = ss.insertSheet(name);
      shouldConfigure = true;
    } else {
      var existing = sheet.getRange(1, 1, 1, headerTitles.length).getValues()[0];
      var headerValid = headerTitles.every(function(title, i) {
        return existing[i] === title;
      });
      if (!headerValid) {
        shouldConfigure = true;
      }
    }
    if (shouldConfigure) {
      // Clear header row content and formatting
      sheet.getRange(1, 1, 1, headerTitles.length).clearContent().clearFormat();
      // Write headers
      sheet.getRange(1, 1, 1, headerTitles.length).setValues([headerTitles]);
      sheet.setFrozenRows(1);
      var headerRange = sheet.getRange(1, 1, 1, headerTitles.length);
      headerRange
        .setBackground(config.theme.primaryColor)
        .setFontWeight('bold')
        .setFontColor('#ffffff');
      // Remove existing bandings
      sheet.getBandings().forEach(function(b) { b.remove(); });
      // Apply alternating banding: header, then secondary and white
      var banding = sheet.applyRowBanding(SpreadsheetApp.BandingTheme.LIGHT_GREY);
      banding.setHeaderRowColor(config.theme.primaryColor)
             .setFirstRowColor(config.theme.secondaryColor)
             .setSecondRowColor('#ffffff');
    }
    return sheet;
  },

  saveMealEntry: function(data) {
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid input: data object expected');
    }
    var calories = Number(data.calories);
    if (isNaN(calories) || calories <= 0) {
      throw new Error('Invalid input: calories must be a positive number');
    }
    var description = String(data.description || '').trim();
    if (!description) {
      throw new Error('Invalid input: description is required');
    }
    var type = String(data.type || '').toLowerCase();
    var allowedTypes = config.ui.mealTypes || ['breakfast','snack','lunch','dinner'];
    if (allowedTypes.indexOf(type) === -1) {
      throw new Error('Invalid input: type must be one of ' + allowedTypes.join(', '));
    }
    var water = Number(data.water);
    if (isNaN(water) || water < 0) {
      throw new Error('Invalid input: water must be a non-negative number');
    }
    var weight = null;
    if (data.weight != null && data.weight !== '') {
      weight = Number(data.weight);
      if (isNaN(weight) || weight <= 0) {
        throw new Error('Invalid input: weight must be a positive number');
      }
    }
    var sheet = this.openOrCreateSheet();
    sheet.appendRow([new Date(), calories, description, type, water, weight]);
  },

  getStatsData: function() {
    var sheet = this.openOrCreateSheet();
    var values = sheet.getDataRange().getValues();
    if (values.length < 2) {
      return { daily: [], weekly: [] };
    }
    var rows = values.slice(1);
    var dailyMap = {};
    rows.forEach(function(r) {
      var ts = r[0];
      if (!ts || !(ts instanceof Date)) return;
      var y = ts.getFullYear();
      var m = ('0' + (ts.getMonth() + 1)).slice(-2);
      var d = ('0' + ts.getDate()).slice(-2);
      var key = y + '-' + m + '-' + d;
      if (!dailyMap[key]) {
        dailyMap[key] = { calories: 0, water: 0, weights: [] };
      }
      dailyMap[key].calories += Number(r[1]) || 0;
      dailyMap[key].water += Number(r[4]) || 0;
      if (r[5] != null && r[5] !== '') {
        var w = Number(r[5]);
        if (!isNaN(w)) dailyMap[key].weights.push(w);
      }
    });
    var daily = Object.keys(dailyMap).sort().map(function(date) {
      var obj = dailyMap[date];
      var avgWeight = obj.weights.length
        ? obj.weights.reduce(function(a, b) { return a + b; }, 0) / obj.weights.length
        : null;
      return {
        date: date,
        calories: obj.calories,
        water: obj.water,
        weight: avgWeight
      };
    });

    var weeklyMap = {};
    daily.forEach(function(e) {
      var d = new Date(e.date);
      var dayOfWeek = d.getDay();
      var diff = (dayOfWeek + 6) % 7; // Monday=0
      var monday = new Date(d);
      monday.setDate(d.getDate() - diff);
      var y = monday.getFullYear();
      var m = ('0' + (monday.getMonth() + 1)).slice(-2);
      var dd = ('0' + monday.getDate()).slice(-2);
      var wk = y + '-' + m + '-' + dd;
      if (!weeklyMap[wk]) {
        weeklyMap[wk] = { calories: 0, water: 0, weights: [] };
      }
      weeklyMap[wk].calories += e.calories;
      weeklyMap[wk].water += e.water;
      if (e.weight != null) {
        weeklyMap[wk].weights.push(e.weight);
      }
    });
    var weekly = Object.keys(weeklyMap).sort().map(function(weekStart) {
      var obj = weeklyMap[weekStart];
      var avgWeight = obj.weights.length
        ? obj.weights.reduce(function(a, b) { return a + b; }, 0) / obj.weights.length
        : null;
      return {
        weekStart: weekStart,
        calories: obj.calories,
        water: obj.water,
        weight: avgWeight
      };
    });

    return { daily: daily, weekly: weekly };
  }
};
function saveMealEntry(data) {
  SheetService.saveMealEntry(data);
}

function getStatsData() {
  return SheetService.getStatsData();
}
