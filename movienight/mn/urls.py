from django.conf.urls import patterns
from movienight.mn.views import MovieNightView
from movienight.mn.views import MovieNightMovie

urlpatterns = patterns(
    '',
    (r'^$', MovieNightView.as_view()),
    (r'^movie/(?P<movie_id>\d+)', MovieNightMovie.as_view()),
)
