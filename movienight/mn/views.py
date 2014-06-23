import tmdb3
import json

from django.http import HttpResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.views.generic.base import View


class MovieNightView(View):
    @csrf_exempt
    def dispatch(self, *args, **kwargs):
        return super(MovieNightView, self).dispatch(*args, **kwargs)

    def get(self, request):
        return render(request, 'index.html', {})

    @csrf_exempt
    def post(self, request):
        post = request.POST

        if 'search' in post:
            movies = []
            res = tmdb3.searchMovie(post['search'])

            for movie in res:
                data = {
                    'title': movie.title,
                }

                if movie.poster:
                    data['poster'] = movie.poster.geturl('w185')

                movies.append(data)

            ret = {
                'movies': movies
            }

        return HttpResponse(json.dumps(ret), content_type="application/json")
