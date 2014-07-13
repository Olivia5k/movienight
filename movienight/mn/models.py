import tmdb3

from django.db import models
from django.contrib.auth.models import AbstractUser


class MovieGoer(AbstractUser):
    def picture(self):
        social = self.social_auth.get()
        uid = social.extra_data['id']
        return 'http://graph.facebook.com/{0}/picture'.format(uid)

    def large_picture(self):
        return '{0}?type=large'.format(self.picture())

    def next_movie(self):
        from movienight.mn.utils import serialize_movie

        item = self.movies.filter(watched=False)[0]
        movie = tmdb3.Movie(item.movie_id)
        return serialize_movie(movie)


class WatchlistMovie(models.Model):
    user = models.ForeignKey(MovieGoer, related_name='movies')
    movie_id = models.IntegerField()
    watched = models.BooleanField(default=False)
    order = models.IntegerField(default=0)
    date_created = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ('order', 'date_created')


class Season(models.Model):
    users = models.ManyToManyField(MovieGoer, related_name='seasons')
    done = models.ManyToManyField(WatchlistMovie, related_name='done_seasons')
    date_created = models.DateTimeField(auto_now_add=True)

    class Meta:
        get_latest_by = 'date_created'

    def __str__(self):
        count = self.users.count()
        remaining = count - self.done.count()

        return '{0} ({1} episodes, {2} remaining)'.format(
            self.index(),
            count,
            remaining
        )

    def index(self):
        return 'S{0:02}'.format(self.id)

    def upcoming(self):
        return self.users.exclude(id__in=[x.id for x in self.done.all()])
