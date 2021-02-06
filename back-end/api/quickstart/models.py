from django.db import models
from django.contrib.auth.models import User
from django.utils.translation import gettext_lazy as _

SHORT_CHAR_LENGTH = 32
LONG_CHAR_LENGTH = 128

# Create your models here.
class Author(models.Model):
  # TODO: uncomment this when we want to use built in User model behaviour (probably for authorization)
  # user = models.OneToOneField(User,on_delete=models.CASCADE) 
  _id = models.CharField(max_length=LONG_CHAR_LENGTH, default='', unique=True)
  _type = 'author'
  displayName = models.CharField(max_length=SHORT_CHAR_LENGTH, default='')
  url = models.CharField(max_length=LONG_CHAR_LENGTH, default='', unique=True)
  github = models.CharField(max_length=LONG_CHAR_LENGTH, default='')


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
  visibility = models.CharField(max_length=SHORT_CHAR_LENGTH, choices=Visibility.choices, unique=True)
  unlisted = models.BooleanField()
  isPrivateToFriends = models.BooleanField()
  author = models.JSONField()
  contentType = models.CharField(max_length=LONG_CHAR_LENGTH, unique=True)
  content = models.TextField(blank=True)
  categories = models.TextField()
  published = models.TimeField()
  count = models.IntegerField()
  pageSize = models.IntegerField(default=50)
  commentLink = models.CharField(max_length=LONG_CHAR_LENGTH)
  comments = models.JSONField()
