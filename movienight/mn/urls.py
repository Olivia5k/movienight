from django.conf.urls import patterns
from movienight.mn.views import MovieNightView

urlpatterns = patterns(
    '',
    (r'^$', MovieNightView.as_view()),
)
