from rest_framework import status
from django.test import TestCase, Client
from .models import Author 
from .serializers import AuthorSerializer

client = Client()

class GetAuthorById(TestCase):
  """Tests for getting a single Author by their ID at endpoint /author/_id/.
  Referenced https://realpython.com/test-driven-development-of-a-django-restful-api/
  """
  def setUp(self):
    self.john = Author.objects.create(
      _id='testId', 
      displayName='John Doe',
      url="testUrl",
      github="testGithub"
    )

  def test_get_valid_author(self):
    response = client.get(f'/authors/{self.john._id}/')
    author = Author.objects.get(_id=self.john._id)
    serializer = AuthorSerializer(author)
    self.assertEqual(response.data, serializer.data)
    self.assertEqual(response.status_code, status.HTTP_200_OK)
    
  def test_get_invalid_author(self):
    response = client.get('/authors/invalidId/')
    self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
