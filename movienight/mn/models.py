#!/usr/bin/env python
# coding: utf-8

import tmdb3

from django.db import models
from django.contrib.auth.models import AbstractUser

from movienight.mn.utils import serialize_movie


class House(models.Model):
    name = models.CharField(max_length=100)
    image = models.CharField(max_length=100)
    person = models.CharField(max_length=100)
    user = models.OneToOneField('MovieGoer')
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ('order',)

    def __unicode__(self):
        return u'{0} of House {1} ({2})'.format(self.person, self.name,
                                                self.user.first_name)

    def position(self):
        return 5 + 100 * (self.order - 1)


class Title(models.Model):
    title = models.CharField(max_length=100)
    user = models.ForeignKey('MovieGoer')

    class Meta:
        ordering = ('user', 'title')

    def __unicode__(self):
        return u'{0} - {1}'.format(self.user.first_name, self.title)


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
        movie = self.movies.filter(watched=False)[0]
        return movie.serialize()

    def name(self):
        if self.first_name in ('Daniel', 'Lowe'):
            return "OP"
        return self.first_name

    def get_movable_movies(self):
        return (m.serialize() for m in self.movies.filter(watched=False))

    def get_past_movies(self):
        return (m.serialize() for m in self.movies.filter(watched=True))

    def get_upcoming_movies(self):
        # TODO: Make the UI handle more than 7
        return (m.serialize() for m in self.movies.filter(watched=False)[:7])

    def get_weighted_random(self):
        """
        Gets a weighted random list of movie ids that this user has booked.

        1st order: 30%
        2nd order: 20%
        3rd order: 10%

        The last 40% are repetitions of all the ids, meaning that the list will
        percentually include all of them but favor the three first ones.

        """

        ret = []
        movies = [m for m in self.movies.filter(watched=False)]

        if len(movies) == 0:
            return ret

        pre = movies[:3]
        pre.reverse()

        for x, movie in enumerate(pre, start=1):
            ret += [movie.movie_id] * 10 * x

        ids = [m.movie_id for m in movies]
        while len(ret) + len(ids) <= 100:
            ret += ids

        print(len(ret), ret)
        return ret


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
        movieset = self.movies.filter(watched=False)
        if not movieset.exists():
            return {
                'user': None,
                'movie': None
            }

        movie = movieset[0]
        return {
            'user': movie.user,
            'movie': movie.serialize(),
        }

    def episode(self, add=1):
        return '{0}E{1:02}'.format(
            self.index(), self.movies.filter(watched=True).count() + add
        )

    def next_episode(self):
        return self.episode(add=2)

    def upcoming_users(self):
        s = self.users.exclude(id__in=[x.user_id for x in self.movies.all()])
        return s.order_by('?')

    def past_movies(self):
        return (m.serialize() for m in self.movies.filter(watched=True))

    def has_episodes_left(self):
        """
        Used to determine whether if we should show the "roll next" or "start
        next season" buttons.

        """
        watched = self.movies.filter(watched=True).count()
        users = self.users.all().count()
        return watched + 1 < users


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
        return self.serialize()

    def serialize(self):
        movie = tmdb3.Movie(self.movie_id)
        return serialize_movie(movie, booking=self)
