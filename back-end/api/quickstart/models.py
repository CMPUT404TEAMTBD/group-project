import uuid
from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

SHORT_CHAR_LENGTH = 32
LONG_CHAR_LENGTH = 128

# Create your models here.
class Author(models.Model):
  # TODO: Null and blank for quicker testing purposes
  user = models.OneToOneField(User,on_delete=models.CASCADE,null=True, blank=True)
  _id = models.CharField(primary_key=True, max_length=LONG_CHAR_LENGTH)
  _type = 'author'
  displayName = models.CharField(max_length=SHORT_CHAR_LENGTH)
  url = models.CharField(max_length=LONG_CHAR_LENGTH, unique=True)
  github = models.CharField(max_length=LONG_CHAR_LENGTH)


class Post(models.Model):

  class Visibility(models.TextChoices):
    PUBLIC = 'Public'
    FRIENDS = 'Friends'

  _id = models.CharField(max_length=LONG_CHAR_LENGTH, unique=True, default=None)
  _type = 'post'
  title = models.CharField(max_length=LONG_CHAR_LENGTH, unique=True)
  description = models.TextField()
  source = models.CharField(max_length=LONG_CHAR_LENGTH, unique=True)
  origin = models.CharField(max_length=LONG_CHAR_LENGTH, unique=True)
  visibility = models.CharField(max_length=SHORT_CHAR_LENGTH, choices=Visibility.choices)
  unlisted = models.BooleanField()
  author = models.CharField(max_length=LONG_CHAR_LENGTH)
  contentType = models.CharField(max_length=LONG_CHAR_LENGTH)
  content = models.TextField(blank=True)
  categories = models.JSONField()
  # cannot store time as IOS 8601 as per spec so when interacting will need parse (i.e using django.utils.dateparse)
  published = models.TimeField(default=timezone.now)
  count = models.IntegerField()
  pageSize = models.IntegerField(default=50)
  commentLink = models.CharField(max_length=LONG_CHAR_LENGTH)
  # TODO: remove
  # list of urls
  comments = models.JSONField()

  def save(self, *args, **kwargs):
    # Overriding save()
    # https://stackoverflow.com/a/62588993
    if not self._id:
        self._id = str(uuid.uuid4().hex)
    # assuming self.author is the authenticated user's corresponding author id
    self._id = f"{self.author}/posts/{self._id}"
    super().save(*args, **kwargs)


class Comment(models.Model):
  _id = models.CharField(max_length=LONG_CHAR_LENGTH, unique=True)
  _type = 'comment'
  postId = models.CharField(max_length=LONG_CHAR_LENGTH)
  author = models.CharField(max_length=LONG_CHAR_LENGTH)
  comment = models.TextField()
  contentType = models.CharField(max_length=LONG_CHAR_LENGTH)
  published = models.TimeField(default=timezone.now)

  def save(self, *args, **kwargs):
    cuuid = str(uuid.uuid4().hex)
    # TODO: change this if postId is not the full url to the post
    self._id = f"{self.postId}/comments/{cuuid}"
    super().save(*args, **kwargs)


class Follow(models.Model):
  receiver = models.CharField(max_length=LONG_CHAR_LENGTH)
  sender = models.CharField(max_length=LONG_CHAR_LENGTH)
  approved = models.BooleanField()


class Like(models.Model):
  context = models.CharField(max_length=LONG_CHAR_LENGTH)
  summary = models.CharField(max_length=LONG_CHAR_LENGTH)
  _type = "like" 
  author = models.CharField(max_length=LONG_CHAR_LENGTH)
  _object = models.CharField(max_length=LONG_CHAR_LENGTH)
  

class Inbox(models.Model):
  _type = "like"
  author = models.CharField(primary_key=True, max_length=LONG_CHAR_LENGTH)
  items = models.JSONField(default=list)

