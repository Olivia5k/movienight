#!/usr/bin/env python
# coding: utf-8

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

    def has_next(self):
        return self.movies.filter(watched=False).exists()

    def next_movie(self):
        from movienight.mn.utils import serialize_movie

        item = self.movies.filter(watched=False)[0]
        movie = tmdb3.Movie(item.movie_id)
        return serialize_movie(movie)

    def name(self):
        if self.first_name in ('Daniel', 'Lowe'):
            return "OP"
        return self.first_name

    def get_movable_movies(self):
        from movienight.mn.utils import serialize_movie
        data = []

        for wm in self.movies.filter(watched=False):
            data.append(serialize_movie(tmdb3.Movie(wm.movie_id)))

        return data

    def get_past_movies(self):
        from movienight.mn.utils import serialize_movie
        data = []

        for wm in self.movies.filter(watched=True):
            data.append(serialize_movie(tmdb3.Movie(wm.movie_id)))

        return data


class Season(models.Model):
    users = models.ManyToManyField(MovieGoer, related_name='seasons')
    date_created = models.DateTimeField(auto_now_add=True)

    class Meta:
        get_latest_by = 'date_created'

    def __str__(self):
        count = self.users.count()
        remaining = count - self.movies.count()

        return '{0} ({1} episodes, {2} remaining)'.format(
            self.index(),
            count,
            remaining
        )

    def index(self, add=0):
        return 'S{0:02}'.format(self.id + add)

    def next_season(self):
        return self.index(add=1)

    def next(self):
        from movienight.mn.utils import serialize_movie
        movieset = self.movies.filter(watched=False)
        if not movieset.exists():
            return {
                'user': None,
                'movie': None
            }

        movie = movieset[0]
        return {
            'user': movie.user,
            'movie': serialize_movie(tmdb3.Movie(movie.movie_id))
        }

    def episode(self, add=1):
        return '{0}E{1:02}'.format(self.index(), len(self.past_movies()) + add)

    def next_episode(self):
        return self.episode(add=2)

    def upcoming_users(self):
        s = self.users.exclude(id__in=[x.user_id for x in self.movies.all()])
        return s.order_by('?')

    def past_movies(self):
        from movienight.mn.utils import serialize_movie
        data = []

        for wm in self.movies.filter(watched=True):
            data.append(serialize_movie(tmdb3.Movie(wm.movie_id)))

        return data

    def has_episodes_left(self):
        """
        Used to determine whether if we should show the "roll next" or "start
        next season" buttons.

        """
        watched = self.movies.filter(watched=False).count()
        users = self.users.all().count()
        return watched < users


class WatchlistMovie(models.Model):
    user = models.ForeignKey(MovieGoer, related_name='movies')
    season = models.ForeignKey(Season, null=True, blank=True,
                               related_name='movies')
    movie_id = models.IntegerField()
    watched = models.BooleanField(default=False)
    order = models.IntegerField(default=0)
    date_created = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ('user', 'watched', 'order', 'date_created')

    def __unicode__(self):
        return u'{1} - {0}'.format(self.movie()['title'], self.user.first_name)

    def movie(self):
        from movienight.mn.utils import serialize_movie
        return serialize_movie(tmdb3.Movie(self.movie_id))
