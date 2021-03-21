"""
signals.py hooks into specific events that we care about.
In our case, we create a corresponding Author object after a user registers successfully.
"""
import uuid

from allauth.account.signals import user_signed_up
from django.dispatch import receiver
from .models import Author, Inbox

# This will auto-create an author when needed
@receiver(user_signed_up)
def after_user_signed_up(request, user, **kwargs):
    """
    After a user has signed up, an author is automatically
    created with the appropriate id containing a UUID
    Get absolute URI: https://stackoverflow.com/a/10119243
    """
    author = Author.objects.create(user=user, displayName=user.username, github=user.username)
    author.host = str(request.build_absolute_uri('/'))
    author.url = f'{author.host}api/author/{author.id}/'
    
    author.save()

    Inbox.objects.create(author=author.id)