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
        <MovieSearchForm onMovieSearch={this.handleMovieSearch} />
        <div id="main">
          <MovieList movies={this.state.movies} />
        </div>
      </div>
    );
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
      <div id="bar">
        <form id="bar-content" className="movieForm" onSubmit={this.handleSubmit}>
          <h1>Movie Night!</h1>
          <input type="text" ref="search" name="search" placeholder="Search..." />
        </form>
      </div>
    );
  }
});

var Movie = React.createClass({
  render: function() {
    return (
      <div className="movie">
        <img src={this.props.movie.poster}/>
        <p>{this.props.movie.title}</p>
      </div>
    );
  }
});

React.renderComponent(
  <MovieNight />,
  document.getElementById('container')
);
