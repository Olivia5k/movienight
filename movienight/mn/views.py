import tmdb3

from django.shortcuts import render
from django.shortcuts import redirect
from django.views.generic.base import View
from django.contrib.auth import logout as auth_logout

from movienight.mn.utils import serialize_movie
from movienight.mn.models import WatchlistMovie
from movienight.mn.models import Season


class MovieNightView(View):
    def get(self, request):
        data = {}

        search = request.GET.get('search', '').strip()
        if search:
            template = 'search.html'
            res = tmdb3.searchMovie(request.GET['search'])
            data['movies'] = [serialize_movie(m) for m in res[:20]]

        else:
            template = 'start.html'
            season = Season.objects.latest()
            next = season.next()

            data['season'] = season
            data['next'] = next
            data['booked_by'] = next['user']

        return render(request, template, data)


class MovieNightMovie(View):
    def get(self, request, movie_id):
        movie = tmdb3.Movie(movie_id)
        return render(
            request,
            'movie.html',
            {'movie': serialize_movie(movie, True)}
        )


class MovieNightWatchlist(View):
    def get(self, request, movie_id):
        item, created = WatchlistMovie.objects.get_or_create(
            user=request.user,
            movie_id=movie_id,
        )

        if not created:
            item.delete()

        return redirect('movie', movie_id=movie_id)


def logout(request):
    auth_logout(request)
    return redirect('/')
