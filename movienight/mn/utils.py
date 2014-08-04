from movienight.mn.models import WatchlistMovie


def serialize_movie(movie, full=False, json=False):
    data = {
        'id': movie.id,
        'title': movie.title,
        'year': getattr(movie.releasedate, 'year', '?'),
        'poster': '/static/dogebutt.png',
        'large_poster': '/static/dogebutt.png',
        'description': movie.overview,
        'runtime': movie.runtime,
        'imdb': 'http://imdb.com/title/{0}'.format(movie.imdb),
        'rating': movie.userrating,
        'booked': False,
        'watched': False,
    }

    if movie.poster:
        data['poster'] = movie.poster.geturl('w185')
        data['large_poster'] = movie.poster.geturl()

    if full:
        data['cast'] = [c for c in movie.cast[:10]]

    booking = WatchlistMovie.objects.filter(movie_id=movie.id)
    if booking.exists() and not json:
        book = booking[0]
        data['booked'] = True
        data['booked_by'] = book.user
        data['watched'] = book.watched

    return data
