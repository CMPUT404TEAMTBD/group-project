from rest_framework import status
from rest_framework.test import APIClient, force_authenticate
from django.contrib.auth.models import User
from django.test import TestCase
from quickstart.models import Author
from quickstart.serializers import AuthorSerializer
from quickstart.tests.helper_test import get_test_author_fields

client = APIClient()

class GetAuthorById(TestCase):
  """Tests for getting all Authors at endpoint /api/authors/."""

  def setUp(self):
    client.force_authenticate(User.objects.create(username='john', password='doe'))

  def test_get_authors(self):
    for i in range(3):
      Author.objects.create(**get_test_author_fields())

    response = client.get(f'/api/authors/')
    authors = Author.objects.all()
    serializer = AuthorSerializer(authors, many=True)

    self.assertEqual(response.status_code, status.HTTP_200_OK)
    self.assertEqual(response.data, serializer.data)

  def test_get_authors_empty(self):
    response = client.get(f'/api/authors/')

    self.assertEqual(response.status_code, status.HTTP_200_OK)
    self.assertEqual(len(response.data), 0)