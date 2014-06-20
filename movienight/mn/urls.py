from django.conf.urls import patterns
from movienight.mn.views import mnView

urlpatterns = patterns(
    '',
    (r'^$', mnView.as_view()),
)
