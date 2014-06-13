/**
 * Create a new auto complete.
 *
 * @param {Pagelet} pagelet
 * @api private
 */
function autocomplete(pagelet) {
  'use strict';

  var container = $(pagelet.placeholders);

  //
  // Add support for adding new services
  //
  container.find('header select').selectize({
    create: false,
    onItemAdd: function added(item) {
      var target = pagelet.pipe.get('target')
        , data;

      pagelet.data.services.some(function some(service) {
        if (item === service.name) data = service;
        return !!data;
      });

      target.render(data);
      $(target.placeholders).show();
    }
  });
}

pipe.on('notifications:render', autocomplete)
    .on('targets:render', autocomplete);
