/**
 * Copyright notice here
 */

(function(window, $) {
  'use strict';

  window.app = window.app || {};

  $(document).ready(function() {
    $.getJSON('/metrics', function(data) {
      window.app.data = data;
      populateTable();
    })
    .fail(function() {
      $('body').append($('<div>').text('Something went wrong'));
    });
  });

  function populateTable() {
    var rowTpl = _.template($('#__tpl_table_row').html());
  }

})(window, jQuery);
