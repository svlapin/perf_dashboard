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

    $table.find('tbody').empty();

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

      rows.push({
        key: key,
        value: siteIndex !== null ?
          window.app.data[siteIndex][key][mode] : null,
        avg: siteIndex !== null ?
          window.app.data[siteIndex][key].average : null
      });
    });

    var tblTpl = _.template($('#__tpl_table').html());

    $('#metrics-table').data('mode', mode).find('tbody')
      .append(tblTpl({rows: rows}));
  }

})(window, jQuery);
