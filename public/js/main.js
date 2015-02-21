/**
 * Copyright notice here
 */

(function(window, $) {
  'use strict';

  window.app = window.app || {};

  $(document).ready(function() {
    var $table = $('#metrics-table');

    $.getJSON('/metrics', function(data) {
      window.app.data = data;
      populateTable();
    })
    .fail(function() {
      $('body').append($('<div>').text('Something went wrong'));
    });

    $('#value-col').on('click', function() {
      var newMode = $table.data('mode') === 'max' ? 'min' : 'max';
      populateTable(newMode);
    });
  });

  function populateTable(mode) {
    mode = mode || 'max';

    var $table = $('#metrics-table');

    var metricsKeys = Object.keys(window.app.data[0]);

    var rows = [];
    metricsKeys.forEach(function(key) {
      // index of the site which data should be shown in columns
      var siteIndex;

      var valsToCompare = window.app.data.map(function(siteData) {
        return siteData[key][mode];
      });

      if (mode === 'max') {
        if (valsToCompare[0] > valsToCompare[1]) {
          siteIndex = 0;
        } else if (valsToCompare[0] < valsToCompare[1]) {
          siteIndex = 1;
        } else {
          // case of equality
          siteIndex = null;
        }
      } else {
        if (valsToCompare[0] < valsToCompare[1]) {
          siteIndex = 0;
        } else if (valsToCompare[0] > valsToCompare[1]) {
          siteIndex = 1;
        } else {
          // case of equality
          siteIndex = null;
        }
      }

      var dataRow = siteIndex !== null ?
        window.app.data[siteIndex][key] : window.app.data[0][key];

      rows.push({
        key: key,
        value: dataRow[mode],
        avg: dataRow.average,
        siteIndex: siteIndex
      });
    });

    var tblTpl = _.template($('#__tpl_table').html());

    $table.data('mode', mode).find('tbody').empty()
      .append(tblTpl({rows: rows}));

    $('#value-col').text('Value ' + mode.toUpperCase());
  }

})(window, jQuery);
