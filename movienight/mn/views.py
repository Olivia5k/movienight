import tmdb3

from django.shortcuts import render
from django.shortcuts import redirect
from django.views.generic.base import View
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import logout as auth_logout

from movienight.mn.utils import serialize_movie
from movienight.mn.models import WatchlistMovie
from movienight.mn.models import Season
from movienight.mn.models import MovieGoer


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


class MovieNightUserView(View):
    @csrf_exempt
    def dispatch(self, *args, **kwargs):
        return super(MovieNightUserView, self).dispatch(*args, **kwargs)

    def get(self, request, first_name):
        user = MovieGoer.objects.get(first_name=first_name)

        return render(
            request,
            'user.html',
            {'user': user}
        )

    def post(self, request, first_name):
        user = MovieGoer.objects.get(first_name=first_name)
        ids = [int(x) for x in request.POST.get('ids').split(',')]

        for x, mid in enumerate(ids):
            movie = user.movies.get(movie_id=mid)
            movie.order = x
            movie.save()

        from django.http.response import HttpResponse
        return HttpResponse(request, '"done"')


def logout(request):
    auth_logout(request)
    return redirect('/')
