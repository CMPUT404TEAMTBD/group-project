"""Tests for the /api/author/{AUTHOR_ID} endpoint.
Referenced https://realpython.com/test-driven-development-of-a-django-restful-api/"""
import json
from rest_framework import status
from django.test import TestCase, Client
from quickstart.models import Author
from quickstart.serializers import AuthorSerializer
from quickstart.tests.helper_test import get_test_author_fields

client = Client()

class GetAuthorById(TestCase):
  """Tests for getting a single Author by their ID at endpoint /api/author/{AUTHOR_ID}/."""
  def setUp(self):
    self.john = Author.objects.create(**get_test_author_fields())

  def test_get_valid_author(self):
    response = client.get(f'/api/author/{self.john.id}/')
    author = Author.objects.get(id=self.john.id)
    serializer = AuthorSerializer(author)
    self.assertEqual(response.data, serializer.data)
    self.assertEqual(response.status_code, status.HTTP_200_OK)
    
  def test_get_invalid_author(self):
    response = client.get('/author/invalidId/')
    self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class UpdateAuthorById(TestCase):
  """Tests for updating a single Author by POST'ing to endpoint /api/author/{AUTHOR_ID}/."""
  def setUp(self):
    self.john = Author.objects.create(**get_test_author_fields())

    self.payload = {
      'displayName': 'new John Doe',
      'github': "newGithub"
    }

  def test_update_author(self):
    response = client.post(
      f'/api/author/{self.john.id}/',
      data=json.dumps(self.payload),
      content_type='application/json'
    )
    self.assertEqual(response.status_code, status.HTTP_200_OK)

    # Compare each payload field with the updated Author object.
    serializer = AuthorSerializer(Author.objects.get(id=self.john.id))
    for k in self.payload:
      self.assertEqual(serializer.data[k], self.payload[k])

    # Ensure other fields are unchanged
    self.assertEqual(serializer.data['id'], str(self.john.id))
    self.assertEqual(serializer.data['type'], self.john.type)

  def test_update_invalid_author(self):
    response = client.post(
      '/api/author/invalidId/',
      data=json.dumps(self.payload),
      content_type='application/json'
    )
    self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
    