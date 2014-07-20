from movienight.mn.models import WatchlistMovie


def serialize_movie(movie, full=False):
    data = {
        'id': movie.id,
        'title': movie.title,
        'year': movie.releasedate.year,
        'poster': '/static/dogebutt.png',
        'large_poster': '/static/dogebutt.png',
        'description': movie.overview,
        'runtime': movie.runtime,
        'imdb': 'http://imdb.com/title/{0}'.format(movie.imdb),
        'rating': movie.userrating,
        'booked': False,
    }

    if movie.poster:
        data['poster'] = movie.poster.geturl('w185')
        data['large_poster'] = movie.poster.geturl()

    if full:
        data['cast'] = [c for c in movie.cast[:10]]

    booking = WatchlistMovie.objects.filter(movie_id=movie.id)
    if booking.exists():
        data['booked'] = True
        data['booked_by'] = booking[0].user

    return data
