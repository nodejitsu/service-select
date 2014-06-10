pipe.once('notifications:render', function notifications(pagelet) {
  'use strict';

  var container = $(pagelet.placeholders);

  //
  // Add support for adding new services
  //
  container.find('header select').selectize({
    create: true
  });
});

pipe.once('targets:render', function targets(pagelet) {

});
