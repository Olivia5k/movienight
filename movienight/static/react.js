/** @jsx React.DOM */

var MovieBox = React.createClass({
  loadMoviesFromServer: function() {
    $.ajax({
      url: this.props.url,
      success: function(data) {
        this.setState({data: data});
      }.bind(this)
    });
  },
  handleMovieSubmit: function(movie) {
    var movies = this.state.data;
    movies.push(movie);
    this.setState({data: movies});
    $.ajax({
      url: this.props.url,
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
    this.loadMoviesFromServer();
    setInterval(this.loadMoviesFromServer, this.props.pollInterval);
  },
  render: function() {
    return (
      <div className="movieBox">
        <h1>Movies</h1>
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

var MovieForm = React.createClass({
  handleSubmit: function() {
    var search = this.refs.search.getDOMNode().value.trim();
    this.props.onMovieSubmit({author: author, text: text});
    this.refs.author.getDOMNode().value = '';
    this.refs.text.getDOMNode().value = '';
    return false;
  },
  render: function() {
    return (
      <form className="movieForm" onSubmit={this.handleSubmit}>
        <h1>Movie Night!</h1>
        <input type="text" ref="search" name="search" value="" placeholder="Search..." />
      </form>
    );
  }
});

var Movie = React.createClass({
  render: function() {
    var rawMarkup = "hehehehehe"
    return (
      <div className="movie">
        <h2 className="movieAuthor">{this.props.author}</h2>
        <span dangerouslySetInnerHTML={{__html: rawMarkup}} />
      </div>
    );
  }
});

React.renderComponent(
  <MovieForm />,
  document.getElementById('bar-content')
);

// React.renderComponent(
//   <MovieBox url="/movies.json" pollInterval={200000} />,
//   document.getElementById('main')
// );
