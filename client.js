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
  var select = container.find('header select').selectize({
    create: false,          // Do not allow creation of new values.
    maxOptions: 15,         // Maximum items in the dropdown.
    onItemAdd: function added(item) {
      var data;

      pagelet.data.services.some(function some(service) {
        if (item === service.name) data = service;
        return !!data;
      });

      target.render(data);
      $(target.placeholders).show();
    }
  })[0];

  //
  // Hide form fields when canceled.
  //
  container.on('click', 'button[name="cancel"]', function click() {
    if (select) {
      select.selectize.clear();       // Reset the auto select/dropdown.
    }

    target.render('');                // Nuke the HTML
    $(target.placeholders).hide();    // Hide the parent element.
  });
}

pipe.on('notifications:target:render', function (pagelet) {
  'use strict';

  var notifications = pagelet.pipe.get('notifications');

  //
  // We're not extended with an autocomplete, bail out.
  //
  if (!('autocomplete' in notifications)) return;

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
