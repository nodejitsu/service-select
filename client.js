/**
 * Create a new auto complete.
 *
 * @param {Pagelet} pagelet
 * @api private
 */
function autocomplete(pagelet) {
  'use strict';

  var container = $(pagelet.placeholders)
    , target = pagelet.pagelet('target');

  //
  // Add support for adding new services
  //
  container.find('header select').selectize({
    create: false,
    onItemAdd: function added(item) {
      var data;

      pagelet.data.services.some(function some(service) {
        if (item === service.name) data = service;
        return !!data;
      });

      target.render(data);
      $(target.placeholders).show();
    }
  });

  //
  // Hide form fields when canceled.
  //
  container.on('click', 'button[name="cancel"]', function click() {
    target.render('');
    $(target.placeholders).hide();
  });
}

pipe.on('notifications:target:render', function (pagelet) {
  'use strict';

  var notifications = pagelet.pipe.get('notifications');

  $('input[name="package"]', pagelet.placeholders).selectize({
    valueField: 'name',
    labelField: 'name',
    searchField: 'name',
    maxOptions: 5,          // Maximum items in the dropdown.
    openOnFocus: false,     // Open dropdown on focus.
    createOnBlur: true,     // Blur input, create item.
    maxItems: 1,            // Only allow one module.
    create: true,
    load: function load(query, callback) {
      if (!query.length) return callback();

      notifications.autocomplete(query, function autocomplete(err, results) {
        if (err) return callback();
        callback(results);
      });
    },
    render: {
      option_create: function create(data, escape) {
        return '';
      }
    }
  });
});

pipe.on('notifications:render', autocomplete)
    .on('targets:render', autocomplete);
