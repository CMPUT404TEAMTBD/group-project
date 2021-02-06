from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

SHORT_CHAR_LENGTH = 32
LONG_CHAR_LENGTH = 128

# Create your models here.
class Author(models.Model):
  # TODO: uncomment this when we want to use built in User model behaviour (probably for authorization)
  # user = models.OneToOneField(User,on_delete=models.CASCADE) 
  _id = models.CharField(max_length=LONG_CHAR_LENGTH, unique=True)
  _type = 'author'
  displayName = models.CharField(max_length=SHORT_CHAR_LENGTH)
  url = models.CharField(max_length=LONG_CHAR_LENGTH, unique=True)
  github = models.CharField(max_length=LONG_CHAR_LENGTH)


class Post(models.Model):

  class Visibility(models.TextChoices):
    PUBLIC = 'P'
    FRIENDS = 'F'

  _id = models.CharField(max_length=LONG_CHAR_LENGTH, unique=True)
  _type = 'post'
  title = models.CharField(max_length=LONG_CHAR_LENGTH, unique=True)
  description = models.TextField()
  source = models.CharField(max_length=LONG_CHAR_LENGTH, unique=True)
  origin = models.CharField(max_length=LONG_CHAR_LENGTH, unique=True)
  visibility = models.CharField(max_length=SHORT_CHAR_LENGTH, choices=Visibility.choices)
  unlisted = models.BooleanField()
  isPrivateToFriends = models.BooleanField()
  author = models.CharField(max_length=LONG_CHAR_LENGTH, unique=True)
  contentType = models.CharField(max_length=LONG_CHAR_LENGTH)
  content = models.TextField(blank=True)
  categories = models.JSONField()
  # cannot store time as IOS 8601 as per spec so when interacting will need parse (i.e using django.utils.dateparse)
  published = models.TimeField(default=timezone.now)
  count = models.IntegerField()
  pageSize = models.IntegerField(default=50)
  commentLink = models.CharField(max_length=LONG_CHAR_LENGTH)
  # list of urls
  comments = models.JSONField()
