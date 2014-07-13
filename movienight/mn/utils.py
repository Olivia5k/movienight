def serialize_movie(movie):
    data = {
        'id': movie.id,
        'title': movie.title,
    }

    if movie.poster:
        data['poster'] = movie.poster.geturl('w185')
    else:
        data['poster'] = '/static/dogebutt.png'

    return data
