var SPINNER_OPTS = {
  lines: 11, // The number of lines to draw
  length: 31, // The length of each line
  width: 8, // The line thickness
  radius: 32, // The radius of the inner circle
  corners: 1, // Corner roundness (0..1)
  rotate: 0, // The rotation offset
  direction: 1, // 1: clockwise, -1: counterclockwise
  color: '#dbdbdb', // #rgb or #rrggbb or array of colors
  speed: 1, // Rounds per second
  trail: 23, // Afterglow percentage
  shadow: true, // Whether to render a shadow
  hwaccel: false, // Whether to use hardware acceleration
  className: 'spinner', // The CSS class to assign to the spinner
  zIndex: 2e9, // The z-index (defaults to 2000000000)
  top: '50%', // Top position relative to parent
  left: '50%' // Left position relative to parent
};


function set_configs() {
  $('.config').each(function(idx) {
    $('.up, .down', this).each(function() {
      $(this).css('display', 'inline');
    });
    $('.count', this).text(idx + 1);
  });

  $('.config:first-child').each(function() {
    $('.up', this).css('display', 'none');
  });
  $('.config:last-child').each(function() {
    $('.down', this).css('display', 'none');
  });
}

$(document).ready(function() {
  $('.movie .cast img').hover(
    function() {
      var t = $('#cast-ticker');
      if(!t.attr('orig')) {
        t.attr('orig', t.text());
      }
      t.removeClass('unused').text($(this).attr('alt'));
    },
    function() {
      var t = $('#cast-ticker');
      t.addClass('unused').text(t.attr('orig'));
    }
  );

  $('.config .up, .config .down').click(function() {
    var t = $(this),
        movie = t.parents('.config');

    if(t.hasClass('up')) {
      movie.prev().before(movie);
    } else {
      movie.next().after(movie);
    }

    set_configs();

    var ids = [];
    $('.config').each(function() { ids.push($(this).attr('id')) });
    console.log(ids)

    $.ajax({
      url: window.location.pathname,
      type: 'POST',
      dataType: 'json',
      data: {'ids': ids.join(',')},
      success: function(data) {
        console.log(data);
      }
    });
  });

  set_configs()
});
