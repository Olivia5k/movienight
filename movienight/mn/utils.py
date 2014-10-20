def serialize_movie(movie, full=False, booking=None):
    data = {
        'id': movie.id,
        'title': movie.title,
        'year': getattr(movie.releasedate, 'year', '?'),
        'poster': '/static/dogebutt.png',
        'large_poster': '/static/dogebutt.png',
        'description': movie.overview,
        'runtime': movie.runtime,
        'imdb': 'http://imdb.com/title/{0}'.format(movie.imdb),
        'tmdb': 'http://www.themoviedb.org/movie/{0}'.format(movie.id),
        'rating': movie.userrating,
        'booked': False,
        'watched': False,
    }

    if movie.poster:
        data['poster'] = movie.poster.geturl('w185')
        data['large_poster'] = movie.poster.geturl()

    if full:
        data['cast'] = [c for c in movie.cast[:10]]

    if booking is None:
        from movienight.mn.models import WatchlistMovie
        bs = WatchlistMovie.objects.filter(movie_id=movie.id)
        if bs.exists():
            booking = bs[0]

    if booking is not None:
        data['booked'] = True
        data['booked_by'] = booking.user
        data['watched'] = booking.watched

    return data
