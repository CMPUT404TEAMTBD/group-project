import json
from rest_framework import status
from django.test import TestCase, Client
from quickstart.models import Author
from quickstart.serializers import AuthorSerializer
from quickstart.tests.helper_test import get_test_author_fields
from django.contrib.auth.models import User

client = Client()

class GetAuthorByUsername(TestCase):
  """Tests for getting a single Author by their User object's username (NOT displayName) at endpoint /api/authuser/{AUTHOR_USERNAME}/."""
  def setUp(self):
    self.user = User.objects.create(username='john')
    self.john = Author.objects.create(user=self.user, **get_test_author_fields())
  
  def test_get_valid_username(self):
    response = client.get(f'/api/auth-user/{self.john.user.username}/')
    serializer = AuthorSerializer(self.john)
    self.assertEqual(response.data, serializer.data)
    self.assertEqual(response.status_code, status.HTTP_200_OK)

  def test_get_invalid_username(self):
    response = client.get('/api/auth-user/invalidUsername/')
    self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)