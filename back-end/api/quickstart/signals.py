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
    hex_uuid = str(uuid.uuid4().hex)
    url = str(request.build_absolute_uri('/')) + "author/" + hex_uuid
    author = Author.objects.create(user=user, url=url, displayName=user.username, github=user.username)
    Inbox.objects.create(author=author.id)