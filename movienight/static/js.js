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
  $('#currentmovies .config').each(function(idx) {
    $('.up, .down', this).each(function() {
      $(this).css('display', 'inline');
    });
    $('.count', this).text(idx + 1);
  });

  $('#currentmovies .config:first-child').each(function() {
    $('.up', this).css('display', 'none');
  });
  $('#currentmovies .config:last-child').each(function() {
    $('.down', this).css('display', 'none');
  });
}

function roulette(state, data) {
  console.log(state);

  // Set new states
  state.up = state.up && state.timeout > state.low;
  state.down = !state.up && state.stalls == 0 && state.timeout < state.high;
  state.spins++;

  // Shuffle the array
  if(state.spins % state.data.length === 0) {
    state.data = shuffle(state.data);
  }

  var data = state.data[state.spins % state.data.length];

  $('#chosen h1').text(data.title);
  $('#chosen img').attr('src', data.img).show();

  if(state.up) {
    state.timeout *= state.increment;
    return setTimeout(roulette, state.timeout, state);
  }

  if(state.stalls > 0) {
    state.stalls--;
    return setTimeout(roulette, state.timeout, state);
  }

  if(state.down) {
    state.timeout /= state.increment;
    return setTimeout(roulette, state.timeout, state);
  }

  // $('#chosen img').css('width', '500px');

  setTimeout(function() {
    $('#chosen h3').fadeIn(3000, function() {
      $(this).fadeOut(1500, function() {
        window.location.pathname = "/";
      });
    });
  }, 1500);

  console.log('sending!');
  $.ajax({
    url: '/roulette/',
    type: 'POST',
    data: {'id': data.id},
    dataType: 'json',
    success: function(data) {
      console.log('done!');
    }
  });
}

function collect_roulette_data() {
  var ret = [];
  $('#roulette link').each(function() {
    var t = $(this);
    ret.push({
      'id': t.attr('id'),
      'img': t.attr('href'),
      'title': t.attr('alt')
    })
  });
  return ret;
}

function shuffle(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array
}

$(document).ready(function() {
  if(window.location.hostname != 'movienight.ninjaloot.se') {
    $('html, body').css('background-color', '#3d2222');
    $('#bar-content h1, html head title').text('Dev Night!');
  }
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

  $('#currentmovies .config .up, #currentmovies .config .down').click(function() {
    var t = $(this),
        movie = t.parents('.config');

    if(t.hasClass('up')) {
      movie.prev().before(movie);
    } else {
      movie.next().after(movie);
    }

    set_configs();

    var ids = [];
    $('#currentmovies .config').each(function() { ids.push($(this).attr('id')) });
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

  $('#roulette .btn').click(function() {
    $(this).hide();

    roulette({
      'data': collect_roulette_data(),
      'spins': 0,
      'timeout': 1000,
      'low': 50,
      'high': 1500,
      'stalls': 100,
      // Test data for lulz!
      // 'timeout': 60,
      // 'low': 50,
      // 'high': 200,
      // 'stalls': 10,
      'increment': 0.9,
      'up': true,
      'down': true,
    });
  });
});
