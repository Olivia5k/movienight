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
  handleMovieSearch: function(movie) {
    // this.setState({data: movies});
    console.log('searching...');
    $.ajax({
      url: '/search',
      type: 'POST',
      data: movie,
      success: function(data) {
        this.setState({data: data});
      }.bind(this)
    });
  },
  getInitialState: function() {
    return {data: []};
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
        <MovieList data={this.state.data} />
      </div>
    );
  }
});

var MovieList = React.createClass({
  render: function() {
    var movieNodes = this.props.data.map(function (movie, index) {
      return <Movie key={index} author={movie.author}>{movie.text}</Movie>;
    });
    return <div className="movieList">{movieNodes}</div>;
  }
});

var MovieSearchForm = React.createClass({
  handleSubmit: function(e) {
    e.preventDefault();
    var search = this.refs.search.getDOMNode().value.trim();
    console.log(search);
    this.props.onMovieSearch({title: search});
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
        <h2 className="movieTitle">{this.props.title}</h2>
        <img className="moviePoster" src="{this.props.poster.large}"/>
      </div>
    );
  }
});

React.renderComponent(
  <MovieNight />,
  document.getElementById('container')
);
