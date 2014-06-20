/** @jsx React.DOM */

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
        <MovieForm onMovieSubmit={this.handleMovieSubmit} />
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
    var author = this.refs.author.getDOMNode().value.trim();
    var text = this.refs.text.getDOMNode().value.trim();
    this.props.onMovieSubmit({author: author, text: text});
    this.refs.author.getDOMNode().value = '';
    this.refs.text.getDOMNode().value = '';
    return false;
  },
  render: function() {
    return (
      <form className="movieForm" onSubmit={this.handleSubmit}>
        <input type="text" placeholder="Your name" ref="author" />
        <input type="text" placeholder="Say something..." ref="text" />
        <input type="submit" value="Post" />
      </form>
    );
  }
});

React.renderComponent(
  <MovieBox url="/movies.json" pollInterval={200000} />,
  document.getElementById('main')
);
