import json
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


class UpdateAuthorById(TestCase):
  """Tests for updating a single Author by POSTing to endpoint /author/_id/.
  Referenced https://realpython.com/test-driven-development-of-a-django-restful-api/
  """
  def setUp(self):
    self.john = Author.objects.create(
      _id='testId', 
      displayName='John Doe',
      url="testUrl",
      github="testGithub"
    )

    self.payload = {
      # TODO: Remove _id here once we figure out the _id field. It should be uneditable.
      '_id': 'newId',
      'displayName': 'new John Doe',
      'url': "newUrl",
      'github': "newGithub"
    }

  def test_update_author(self):
    response = client.put(
      f'/authors/{self.john._id}/',
      data=json.dumps(self.payload),
      content_type='application/json'
    )
    self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)


class GetPostById(TestCase):

  def setUp(self):
    self.post = Post.objects.create(
      _id='123',
      title='testpost',
      description='i am a test post',
      source='source post id',
      origin='origin post id',
      visibility='Public',
      unlisted='True',
      isPrivateToFriends='True',
      author='testId',
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

