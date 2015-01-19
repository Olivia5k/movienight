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

function set_movie(movie) {
  console.log('sending!');
  $.ajax({
    url: '/roulette/',
    type: 'POST',
    data: {'id': movie.id},
    dataType: 'json',
    success: function(data) {
      console.log('done!');
      setTimeout(function() {
        window.location.pathname = "/";
      }, 1500)
    }
  });
}

function roulette(state, data) {
  console.log(state);

  // Set new states
  state.up = state.up && state.timeout > state.low;
  state.down = !state.up && state.stalls == 0 && state.timeout < state.high;
  state.spins++;

  // Shuffle the array
  console.log(state.spins % state.data.length);
  if(state.spins % state.data.length === 0) {
    state.data = collect_roulette_data();
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

  setTimeout(function() {
    $('#chosen h3').fadeIn(360, function() {
      $(this).fadeOut(500, function() {
        set_movie(data);
      });
    });
  }, 1500);
}

function collect_roulette_data() {
  var ret = [];
  for(var id in USERS) {
    var e = USERS[id];
    var id = e[Math.floor(Math.random() * e.length)];
    var t = $('#movie-' + id);

    ret.push({
      'id': t.attr('id').replace('movie-', ''),
      'img': t.attr('href'),
      'title': t.attr('alt')
    })
  }

  return shuffle(ret);
}

function single_roulette(movie) {
  $('#chosen h1').text(movie.title);
  $('#chosen img').attr('src', movie.img).fadeIn(3500, function() {
    var h2 = $("<h2>").text('Winner by default! <3').hide();
    h2.insertAfter($('#chosen img')).slideDown(1000, function() {
      set_movie(movie);
    });
  });
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

function next_season() {
  // Lock the height of the season
  $('.season').height($('.season').height() + 10);

  $('.hero').slideUp({
    'duration': 2500,
    'easing': 'easeOutBounce',
    'complete': function() {
      return run_away();
    }
  });

  var retry = function() {
    if($('.moviethumb').length == 0) {
      return fade_season();
    }
    setTimeout(retry, 100);
  };
  setTimeout(retry, 100);
}

function reroulette() {
  $('#next_season').slideUp(2000, function() {
    var t = $(this);
    t.attr('href', '/roulette').text('Roll next movie').unbind('click');
    t.slideDown(2000, function() {
      $(this).animate({'background-color': '#705050'}, {
        'duration': 750,
        'complete': function() {
          console.log('done');
        }
      });
    });
  });
}

function redrop_current() {
  return reroulette();

  var hero = $('.hero');
  hero.find('a').remove();
  hero.append($('<img class="poster"/>').attr('src', '/static/dogebutt.png'));
  hero.append($('<h1 class="dark">').text('Nothing selected yet :('));
  hero.slideDown({
    'duration': 2500,
    'easing': 'easeOutBounce',
    'complete': reroulette,
  });
}

function load_next_season() {
  var loop = function(movies) {
    var s = $('.season');
    s.height('auto');
    if(movies.length == 0) {
      return redrop_current();
    }
    $(movies.pop()).css('margin-left', '1500px').appendTo(s).animate(
      {
        'margin-left': '0px',
      },
      {
        'duration': 1800,
        'easing': 'easeOutExpo',
      }
    );
    setTimeout(loop, 250, movies);
  };

  $.ajax({
    url: '/season/',
    type: 'POST',
    dataType: 'json',
    data: {'season': 'x'},
    success: loop
  });
}

function fade_season() {
  $('.season h1 span').fadeOut(1500, function() {
    // TODO
    $(this).text('S03').fadeIn(2000, function() {
      return load_next_season();
    });
  });
}

function run_away() {
  $('.admin').animate({'margin-top': '0px'}, {'duration': 400});

  var movies = $($('.moviethumb').get().reverse());
  movies.each(function() {
    var t = $(this);
    var offset = t.offset();
    t.css('position', 'absolute');
    t.offset(offset);
  })

  $('.season h3').fadeOut();

  // Reshuffle!
  var movies = $(shuffle(movies.get()));

  var x = 0
  movies.each(function() {
    var t = $(this);
    x++;
    setTimeout(
      function() {
        t.animate({'left': '1500px'}, {
          'duration': 1500,
          'easing': 'easeInExpo',
          'complete': function() {
            console.log('Done with ' + t.find('p').text());
            t.remove();
          },
        });
      }, x * 150)
  })
}

$(document).ready(function() {
  if(window.location.hostname != 'movienight.ninjaloot.se') {
    // $('html, body').css('background-color', '#3d2222');
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

  $('#next_season').click(next_season);

  $('#roulette .btn').click(function() {
    $(this).hide();

    var data = collect_roulette_data();

    if(data.length == 1) {
      return single_roulette(data[0]);
    }

    roulette({
      'data': data,
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
