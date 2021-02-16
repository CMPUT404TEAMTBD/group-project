import uuid

from allauth.account.signals import user_signed_up
from django.dispatch import receiver
from .models import Author

# This will auto-create an author when needed
@receiver(user_signed_up)
def after_user_signed_up(request, user, **kwargs):
    #TODO: Make this url a uuid
    url = user.id
    author = Author.objects.create(user=user,_id=url,url=url,displayName=user.username,github=user.username)