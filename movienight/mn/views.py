import json

from django.http import HttpResponse
from django.shortcuts import render
from django.template.loader import render_to_string
from django.views.decorators.csrf import csrf_exempt
from django.views.generic.base import View

from movienight.mn.models import Player
from movienight.mn.models import Item


class MovieNightView(View):
    def get(self, request):
        context = {
            'players': Player.objects.all(),
        }

        return render(request, 'index.html', context)

    @csrf_exempt
    def dispatch(self, *args, **kwargs):
        return super(MovieNightView, self).dispatch(*args, **kwargs)

    @csrf_exempt
    def post(self, request):
        post = request.POST
        player = Player.get(post.get('player'))

        if 'create' in post:
            item, created = Item.objects.get_or_create(
                player=player,
                target=post.get('create')
            )

            ret = {
                'html': render_to_string('item.html', {'item': item}),
                'count': Item.objects.filter(player=player).count(),
                'created': created,
            }

        elif 'delete' in post:
            iid = int(post.get('delete').split('-')[1])
            item = Item.objects.get(id=iid)
            item.delete()

            ret = {
                'killed_in_fire': True,
                'count': Item.objects.filter(player=player).count()
            }

        else:
            ret = {'wat': True}

        return HttpResponse(json.dumps(ret))
