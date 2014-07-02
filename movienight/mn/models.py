import json

from django.contrib.auth.models import AbstractUser


class MovieGoer(AbstractUser):
    def picture(self):
        social = self.social_auth.get()
        uid = social.extra_data['id']
        return 'http://graph.facebook.com/{0}/picture'.format(uid)

    def as_json(self):
        return json.dumps({
            'picture': self.picture(),
            'name': '{0} {1}'.format(self.first_name, self.last_name),
        })
