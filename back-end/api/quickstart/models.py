import uuid
from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

# Create your models here.
class Author(models.Model):
  # TODO: Null and blank for quicker testing purposes
  user = models.OneToOneField(User, on_delete=models.CASCADE, null=True, blank=True)
  id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
  type = 'author'
  displayName = models.TextField()  
  host = models.TextField()
  url = models.TextField()
  github = models.TextField()


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
  visibility = models.TextField(choices=Visibility.choices)
  unlisted = models.BooleanField()
  author = models.TextField(default='')
  contentType = models.TextField()
  content = models.TextField(blank=True)
  categories = models.JSONField()
  # cannot store time as IOS 8601 as per spec so when interacting will need parse (i.e using django.utils.dateparse)
  # TODO: defualt is broken maybe change to DateField
  published = models.DateTimeField(default=timezone.now, editable=False)
  commentLink = models.TextField(default='')

class Comment(models.Model):
  id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
  type = 'comment'
  postId = models.TextField()
  author = models.TextField()
  comment = models.TextField()
  contentType = models.TextField()
  published = models.DateTimeField(default=timezone.now, editable=False)


class Follow(models.Model):
  receiver = models.TextField()
  sender = models.TextField()
  approved = models.BooleanField()


class Like(models.Model):
  context = models.TextField()
  summary = models.TextField()
  type = 'like' 
  author = models.TextField()
  object = models.TextField()
  

class Inbox(models.Model):
  type = 'inbox'
  author = models.TextField(primary_key=True)
  items = models.JSONField(default=list)

