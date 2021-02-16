"""Tests for the /api/author/{AUTHOR_ID} endpoint.
Referenced https://realpython.com/test-driven-development-of-a-django-restful-api/"""
import json
from rest_framework import status
from django.test import TestCase, Client
from .models import Author
from .serializers import AuthorSerializer
import datetime
from .helpers_test import get_test_author_fields

client = Client()

class GetAuthorById(TestCase):
  """Tests for getting a single Author by their ID at endpoint /api/author/{AUTHOR_ID}/."""
  def setUp(self):
    self.john = Author.objects.create(**get_test_author_fields())

  def test_get_valid_author(self):
    response = client.get(f'/api/author/{self.john._id}/')
    author = Author.objects.get(_id=self.john._id)
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
      # TODO: Remove _id here once we figure out the _id field. It should be uneditable.
      '_id': 'testId',
      'displayName': 'new John Doe',
      'url': "newUrl",
      'github': "newGithub"
    }

  def test_update_author(self):
    response = client.post(
      f'/api/author/{self.john._id}/',
      data=json.dumps(self.payload),
      content_type='application/json'
    )
    self.assertEqual(response.status_code, status.HTTP_200_OK)

    # Compare each payload field with the updated Author object.
    serializer = AuthorSerializer(Author.objects.get(_id=self.john._id))
    for k in self.payload:
      self.assertEqual(serializer.data[k], self.payload[k])

    # Ensure other fields are unchanged
    self.assertEqual(serializer.data['_id'], self.john._id)
    self.assertEqual(serializer.data['_type'], self.john._type)

  def test_update_invalid_author(self):
    response = client.post(
      '/api/author/invalidId/',
      data=json.dumps(self.payload),
      content_type='application/json'
    )
    self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
    