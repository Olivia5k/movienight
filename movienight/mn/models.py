from django.db import models
from django.contrib.auth.models import AbstractUser


class MovieGoer(AbstractUser):
    pass


class Player(models.Model):
    name = models.CharField(max_length=30)
    color = models.CharField(max_length=30)

    def __str__(self):
        return self.name

    def cls(self):
        return 'player-{0}-color'.format(self.id)

    @staticmethod
    def get(s):
        return Player.objects.get(id=int(s.split('-')[1]))


class Item(models.Model):
    target = models.CharField(max_length=255)
    player = models.ForeignKey(Player, related_name="items")

    class Meta:
        ordering = ['-id']

    def __str__(self):
        return "{0}'s {1}".format(self.player.name, self.target)
