import json
from rest_framework import status
from django.test import TestCase, Client
from .models import Author, Post
from .serializers import AuthorSerializer, PostSerializer
import datetime

client = Client()


class GetAuthorById(TestCase):
  """Tests for getting a single Author by their ID at endpoint /authors/_id/.
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
  """Tests for updating a single Author by PUT'ing to endpoint /authors/_id/.
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
      '_id': 'testId',
      'displayName': 'new John Doe',
      'url': "newUrl",
      'github': "newGithub"
    }

  # TODO: update object tests most likely will be changed to use POST instead.
  def test_update_author(self):
    response = client.put(
      f'/authors/{self.john._id}/',
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
    response = client.put(
      '/authors/invalidId/',
      data=json.dumps(self.payload),
      content_type='application/json'
    )
    self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
    

class GetPostById(TestCase):
  """Tests for getting a single Post by their ID at endpoint /posts/_id/."""
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
      count=5,
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


class UpdatePostById(TestCase):
  """Tests for updating a single Post by PUT'ing to endpoint /posts/_id/."""
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
      count=5,
      pageSize=20,
      commentLink='link to comments',
      comments='{ "text": "nice test" }'
    )

    self.payload = {
      # TODO: Remove _id here once we figure out the _id field. It should be uneditable.
      '_id': '123', 
      'title': 'newpost', 
      'description': 'i am a new post', 
      'source': 'new source post id', 
      'origin': 'new origin post id', 
      'visibility': 'Friends', 
      'unlisted': False, 
      'isPrivateToFriends': False, 
      'author': 'newId', 
      'contentType': 'text/plain', 
      'content': 'Hello, I am a new post', 
      'categories': '["New Testing"]', 
      'published': '22:11:27.254321', 
      'count': 10, 
      'pageSize': 40, 
      'commentLink': 'new link to comments', 
      'comments': '{ "text": "nice new test" }'
    }

  # TODO: update object tests most likely will be changed to use POST instead.
  def test_update_post(self):
    response = client.put(
      f'/posts/{self.post._id}/',
      data=json.dumps(self.payload),
      content_type='application/json'
    )
    self.assertEqual(response.status_code, status.HTTP_200_OK)

    # Compare each payload field with the updated Post object.
    serializer = PostSerializer(Post.objects.get(_id=self.post._id))
    for k in self.payload:
      self.assertEqual(serializer.data[k], self.payload[k])

    # Ensure other fields are unchanged
    self.assertEqual(serializer.data['_id'], self.post._id)
    self.assertEqual(serializer.data['_type'], self.post._type)

  def test_update_invalid_post(self):
    response = client.put(
      '/posts/invalidId/',
      data=json.dumps(self.payload),
      content_type='application/json'
    )
    self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)