import tmdb3

from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.views.generic.base import View

from movienight.mn.utils import serialize_movie


class MovieNightView(View):
    @csrf_exempt
    def dispatch(self, *args, **kwargs):
        return super(MovieNightView, self).dispatch(*args, **kwargs)

    def get(self, request):
        template, data = 'index.html', {}

        search = request.GET.get('search', '').strip()
        if search:
            template = 'search.html'
            res = tmdb3.searchMovie(request.GET['search'])
            data['movies'] = [serialize_movie(m) for m in res[:20]]

        return render(request, template, data)


class MovieNightMovie(View):
    @csrf_exempt
    def dispatch(self, *args, **kwargs):
        return super(MovieNightMovie, self).dispatch(*args, **kwargs)

    def get(self, request, movie_id):
        movie = tmdb3.Movie(movie_id)
        return render(
            request,
            'movie.html',
            {'movie': serialize_movie(movie, True)}
        )
