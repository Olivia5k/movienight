from django.contrib import admin
from movienight.mn import models


admin.site.register(models.MovieGoer)
admin.site.register(models.Season)
admin.site.register(models.WatchlistMovie)
admin.site.register(models.House)
admin.site.register(models.Title)
