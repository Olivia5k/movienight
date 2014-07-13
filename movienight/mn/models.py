import json

from django.db import models
from django.contrib.auth.models import AbstractUser


class MovieGoer(AbstractUser):
    def picture(self):
        social = self.social_auth.get()
        uid = social.extra_data['id']
        return 'http://graph.facebook.com/{0}/picture'.format(uid)

    def large_picture(self):
        return '{0}?type=large'.format(self.picture())

    def as_json(self):
        return json.dumps({
            'picture': self.picture(),
            'name': '{0} {1}'.format(self.first_name, self.last_name),
        })


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
    done = models.ManyToManyField(MovieGoer, related_name='done_seasons')
    date_created = models.DateTimeField(auto_now_add=True)
