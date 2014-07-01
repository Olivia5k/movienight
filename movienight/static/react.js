/** @jsx React.DOM */

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
