from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Author(models.Model):
  # TODO: uncomment this when we want to use built in User model behaviour (probably for authorization)
  # user = models.OneToOneField(User,on_delete=models.CASCADE) 
  _id = models.CharField(max_length=128, default='', unique=True)
  _type = 'author'
  displayName = models.CharField(max_length=32, default='')
  url = models.CharField(max_length=128, default='', unique=True)
  github = models.CharField(max_length=128, default='')
  