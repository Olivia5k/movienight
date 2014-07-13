import os

from movienight import settings


def serialize_movie(movie, cast=False):
    data = {
        'id': movie.id,
        'title': movie.title,
        'poster': '/static/dogebutt.png',
        'description': movie.overview,
        'runtime': movie.runtime,
        'imdb': 'http://imdb.com/title/{0}'.format(movie.imdb),
        'rating': movie.userrating,
    }

    if movie.poster:
        data['poster'] = movie.poster.geturl('w185')

    if cast:
        data['cast'] = [c for c in movie.cast[:10]]

    return data


def js_template(template):
    filename = os.path.join(settings.PROJECT_PATH, 'mn', 'templates', template)
    with open(filename) as f:
        return f.read()
