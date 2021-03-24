"""
models.py contain all of our Django models, which we return in our API endpoints.
They were modelled after the objects defined in the project requirements spec.
https://github.com/CMPUT404W21T02/CMPUT404-project-socialdistribution/blob/master/project.org
"""
import uuid
from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

# Represents a user on our site, that can make posts, friends, and like and comment on other posts.
class Author(models.Model):
  # User being null and blank allows Author to be created without a User object in tests.
  user = models.OneToOneField(User, on_delete=models.CASCADE, null=True, blank=True)
  id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
  type = 'author'
  displayName = models.TextField()  
  host = models.TextField()
  url = models.TextField()
  github = models.TextField()

# Posts are used to share information (text, images, or markdown) to other Authors.
class Post(models.Model):

  # Sorting post by newest first taken from: https://stackoverflow.com/a/6686363
  class Meta:
        ordering = ['-published']

  class Visibility(models.TextChoices):
    PUBLIC = 'Public'
    FRIENDS = 'Friends'

  id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
  author = models.ForeignKey(Author, on_delete=models.CASCADE)
  type = 'post'
  title = models.TextField()
  description = models.TextField()
  source = models.TextField(default='')
  origin = models.TextField(default='')
  visibility = models.TextField(choices=Visibility.choices)
  unlisted = models.BooleanField()
  contentType = models.TextField()
  content = models.TextField(blank=True)
  categories = models.JSONField()
  published = models.DateTimeField(default=timezone.now, editable=False)
  commentLink = models.TextField(default='')

# An Author can communicate with other Authors by commenting on posts. 
class Comment(models.Model):
  id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
  type = 'comment'
  postId = models.TextField()
  author = models.TextField()
  comment = models.TextField()
  contentType = models.TextField()
  published = models.DateTimeField(default=timezone.now, editable=False)

# Author A can send a Follow request to Author B when they want to
# be constantly informed on whatever Author B is posting.
class Follow(models.Model):
  receiver = models.ForeignKey(Author, on_delete=models.CASCADE)
  sender = models.JSONField()

# Author A (sender) sent a Follow request to Author B (possibly on 
# a different server). 
class Following(models.Model):
  receiver = models.JSONField()
  sender = models.ForeignKey(Author, on_delete=models.CASCADE)

# Represents a Like on a post or comment.
class Like(models.Model):
  type = 'like' 
  author = models.JSONField()
  object = models.TextField()
  
# Every Author has an Inbox, which is where they receive notifications about recent activity
# on their own posts, or posts of Authors they're following.
class Inbox(models.Model):
  type = 'inbox'
  author = models.ForeignKey(Author, on_delete=models.CASCADE)
  items = models.JSONField(default=list)

# All other nodes that our server is connected to. This model holds the Basic Auth 
# credentials that our client needs to send when making requests to other servers.
class Node(models.Model):
  host = models.TextField(primary_key=True) # e.g., coolbears.ca
  username = models.TextField() # username of a User model on the other server
  password = models.TextField() # password of that User model on the other server