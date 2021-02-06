from rest_framework import status
from django.test import TestCase, Client
from .models import Author, Post
from .serializers import AuthorSerializer, PostSerializer
import datetime

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


class GetPostById(TestCase):

  def setUp(self):
    self.john = Author.objects.create(
      _id='testId',
      displayName='John Doe',
      url="testUrl",
      github="testGithub"
    )

    self.post = Post.objects.create(
      _id='123',
      title='testpost',
      description='i am a test post',
      source='source post id',
      origin='origin post id',
      visibility='Public',
      unlisted='True',
      isPrivateToFriends='True',
      author=AuthorSerializer(self.john).data,
      contentType = 'text/plain',
      content='Hello, I am a test post',
      categories='["Testing"]',
      published=datetime.datetime.now(),
      count='5',
      pageSize=20,
      commentLink='link to comments',
      comments='{ "text": "nice test" }'
    )

  def test_get_valid_post(self):
    response = client.get(f'/posts/{self.post._id}/')
    post = Post.objects.get(_id=self.post._id)
    serializer = PostSerializer(post)
    self.assertEqual(response.data, serializer.data)
    self.assertEqual(response.status_code, status.HTTP_200_OK)

  def test_get_invalid_post(self):
    response = client.get('/posts/invalidId/')
    self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

