from django.conf.urls import url
from movienight.mn.views import MovieNightView
from movienight.mn.views import MovieNightMovie
from movienight.mn.views import MovieNightWatchlist
from movienight.mn.views import MovieNightUserView
from movienight.mn.views import logout

urlpatterns = (
    url(r'^$', MovieNightView.as_view()),
    url(r'^movie/(?P<movie_id>\d+)', MovieNightMovie.as_view(), name='movie'),
    url(r'^watchlist/(?P<movie_id>\d+)', MovieNightWatchlist.as_view()),
    url(r'^user/(?P<first_name>.+)', MovieNightUserView.as_view()),

    url(r'^logout/', logout),
)
