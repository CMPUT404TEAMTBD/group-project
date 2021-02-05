from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Author(models.Model):
  user = models.OneToOneField(User,on_delete=models.CASCADE)
  userType = 'Author'
  displayName = models.CharField(max_length=50)
  github = models.CharField(max_length=50)
  