/** @jsx React.DOM */

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

var MovieNight = React.createClass({
  loadMoviesFromServer: function() {
    $.ajax({
      url: this.props.url,
      success: function(data) {
        this.setState({data: data});
      }.bind(this)
    });
  },
  handleMovieSearch: function(search) {
    console.log('searching...');
    this.setState({movies: []});
    var target = document.getElementById('main');
    var spinner = new Spinner(SPINNER_OPTS).spin(target);

    $.ajax({
      url: '/',
      type: 'POST',
      data: {search: search},
      dataType: 'json',
      success: function(data) {
        spinner.stop();
        console.log(data.movies);
        this.setState({movies: data.movies});
      }.bind(this)
    });
  },
  getInitialState: function() {
    return {movies: []};
  },
  componentWillMount: function() {
    // this.loadMoviesFromServer();
    console.log('not polling...');
    // setInterval(this.loadMoviesFromServer, this.props.pollInterval);
  },
  render: function() {
    return (
      <div className="movieNight">
        <div id="bar">
          <MovieSearchForm onMovieSearch={this.handleMovieSearch} />
        </div>
        <div id="main">
          <MovieList movies={this.state.movies} />
          <MovieGoer state={this.state} />
        </div>
      </div>
    );
  }
});

var MovieNav = React.createClass({
  render: function() {
    if(window.auth) {
      return (
        <a href={"/user/" + window.user.name} className="movieNav">
          <img src={window.user.picture} />
          <p>{user.name}</p>
        </a>
      );
    } else {
      return (
        <div className="movieNav">
          <a className="facebook-btn" href="/login/facebook/">Facebook Sign In</a>
        </div>
      );
    }
  }
});

var MovieList = React.createClass({
  render: function() {
    var movieNodes = this.props.movies.map(function (movie, index) {
      return <Movie key={index} movie={movie}/>;
    });
    return <div className="movieList">{movieNodes}</div>;
  }
});

var MovieSearchForm = React.createClass({
  handleSubmit: function(e) {
    e.preventDefault();
    var search = this.refs.search.getDOMNode().value.trim();
    console.log(search);
    this.props.onMovieSearch(search);
    return false;
  },
  render: function() {
    return (
      <form id="bar-content" className="movieForm" onSubmit={this.handleSubmit}>
        <a href="/">
          <h1>Movie Night!</h1>
        </a>
        <input type="text" ref="search" name="search" placeholder="Search..." />
        <MovieNav />
      </form>
    );
  }
});

var Movie = React.createClass({
  render: function() {
    return (
      <a href={"/movie/" + this.props.movie.id} className="movie">
        <img src={this.props.movie.poster}/>
        <p>{this.props.movie.title}</p>
      </a>
    );
  }
});

var MovieGoer = React.createClass({
  componentWillMount: function() {
    console.log('willmount');
  },
  render: function() {
    return (
      <div className="movieGoer">
        <p>{this.props.name}</p>
      </div>
    );
  }
});

var MovieEntry = React.createClass({
  componentWillMount: function() {
    console.log('grabbing movie' + this.props.id);

    $.ajax({
      url: '/movie/' + this.props.id,
      type: 'GET',
      dataType: 'json',
      success: function(data) {
        console.log(data);
        this.setState(data);
      }.bind(this)
    });
  },
  render: function() {
    return (
      <div className="movieEntry">
        <h1>{this.props.name}</h1>
        <img src={this.props.poster} />
      </div>
    );
  }
});

var modules = {
  'user': MovieGoer,
  'movie': MovieEntry,
};

React.renderComponent(
  <MovieNight />,
  document.getElementById('container')
);

// This is a poor man's routing. For any code below this that you read, I am
// very very sorry, Canadian style.
window.onpopstate = function(e) {
  console.log(e.state);

  if(e.state.module === 'user') {
    React.renderComponent(
      <MovieGoer name={new Date().getTime()} />,
      document.getElementById('main')
    );
  }

  if(e.state.module === 'movie') {
    React.renderComponent(
      <MovieEntry id={e.state.data} />,
      document.getElementById('main')
    );
  }

  return false;
}

$(document.body).on('click', 'a', function(e) {
  var href = $(this).attr("href");
  var split = href.split('/');
  var state = {
    module: split[1],
    data: split[2]
  };

  e.preventDefault();

  history.pushState(state, '', '#'+href);
  window.onpopstate({state: state});
  return false;
});
