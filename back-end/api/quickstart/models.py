import uuid
from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

SHORT_CHAR_LENGTH = 32
LONG_CHAR_LENGTH = 128

# Create your models here.
class Author(models.Model):
  # TODO: Null and blank for quicker testing purposes
  user = models.OneToOneField(User, on_delete=models.CASCADE, null=True, blank=True)
  id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
  type = 'author'
  displayName = models.CharField(max_length=SHORT_CHAR_LENGTH)
  host = models.TextField()
  url = models.TextField()
  github = models.CharField(max_length=LONG_CHAR_LENGTH)


class Post(models.Model):

  class Visibility(models.TextChoices):
    PUBLIC = 'Public'
    FRIENDS = 'Friends'

  id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
  type = 'post'
  title = models.TextField()
  description = models.TextField()
  source = models.TextField(default='')
  origin = models.TextField(default='')
  visibility = models.CharField(max_length=SHORT_CHAR_LENGTH, choices=Visibility.choices)
  unlisted = models.BooleanField()
  author = models.TextField(default='')
  contentType = models.CharField(max_length=LONG_CHAR_LENGTH)
  content = models.TextField(blank=True)
  categories = models.JSONField()
  # cannot store time as IOS 8601 as per spec so when interacting will need parse (i.e using django.utils.dateparse)
  # TODO: defualt is broken maybe change to DateField
  published = models.DateTimeField(default=timezone.now, editable=False)
  commentLink = models.TextField(default='')

class Comment(models.Model):
  id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
  type = 'comment'
  postId = models.CharField(max_length=LONG_CHAR_LENGTH)
  author = models.CharField(max_length=LONG_CHAR_LENGTH)
  comment = models.TextField()
  contentType = models.CharField(max_length=LONG_CHAR_LENGTH)
  published = models.DateTimeField(default=timezone.now, editable=False)


class Follow(models.Model):
  receiver = models.CharField(max_length=LONG_CHAR_LENGTH)
  sender = models.CharField(max_length=LONG_CHAR_LENGTH)
  approved = models.BooleanField()


class Like(models.Model):
  context = models.CharField(max_length=LONG_CHAR_LENGTH)
  summary = models.CharField(max_length=LONG_CHAR_LENGTH)
  type = 'like' 
  author = models.CharField(max_length=LONG_CHAR_LENGTH)
  object = models.CharField(max_length=LONG_CHAR_LENGTH)
  

class Inbox(models.Model):
  type = 'inbox'
  author = models.CharField(primary_key=True, max_length=LONG_CHAR_LENGTH)
  items = models.JSONField(default=list)

