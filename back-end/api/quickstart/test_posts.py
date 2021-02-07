"""Tests for the /author/{AUTHOR_ID}/posts/{POST_ID}/ endpoint. 
Referenced https://realpython.com/test-driven-development-of-a-django-restful-api/"""
import json
from rest_framework import status
from django.test import TestCase, Client
from .models import Author, Post
from .serializers import AuthorSerializer, PostSerializer
import datetime

client = Client()

class GetPostById(TestCase):
  """Tests for getting a single Post by their ID at endpoint /author/{AUTHOR_ID}/posts/{POST_ID}/."""
  def setUp(self):
    self.post = Post.objects.create(
      _id='123',
      title='testpost',
      description='i am a test post',
      source='source post id',
      origin='origin post id',
      visibility='Public',
      unlisted=True,
      isPrivateToFriends=True,
      author='authorId',
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
    response = client.get(f'/author/{self.post.author}/posts/{self.post._id}/')
    post = Post.objects.get(_id=self.post._id)
    serializer = PostSerializer(post)
    self.assertEqual(response.data, serializer.data)
    self.assertEqual(response.status_code, status.HTTP_200_OK)

  def test_get_invalid_post(self):
    response = client.get(f'/author/{self.post.author}/posts/invalidId/')
    self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class UpdatePostById(TestCase):
  """Tests for updating a single Post by PUT'ing to endpoint /author/{AUTHOR_ID}/posts/{POST_ID}/."""
  def setUp(self):
    self.post = Post.objects.create(
      _id='123',
      title='testpost',
      description='i am a test post',
      source='source post id',
      origin='origin post id',
      visibility='Public',
      unlisted=True,
      isPrivateToFriends=True,
      author='authorId',
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
      # TODO: Remove author here once we figure fields out. It should be uneditable.
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

  def test_update_post(self):
    response = client.post(
      f'/author/{self.post.author}/posts/{self.post._id}/',
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
    response = client.post(
      f'/author/{self.post.author}/posts/invalidId/',
      data=json.dumps(self.payload),
      content_type='application/json'
    )
    self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class CreatePostById(TestCase):
  """Tests for updating a single Post by PUT'ing to endpoint /author/{AUTHOR_ID}/posts/{POST_ID}/."""
  def setUp(self):
    self.payload = {
      '_id': '123',
      '_type': 'post',
      'title': 'testpost',
      'description': 'i am a test post',
      'source': 'source post id',
      'origin': 'origin post id',
      'visibility': 'Public',
      'unlisted': True,
      'isPrivateToFriends': True,
      'author': 'authorId',
      'contentType': 'text/plain',
      'content': 'Hello, I am a test post',
      'categories': '["Testing"]',
      'published': '03:25:53.827044',
      'count': 5,
      'pageSize': 20,
      'commentLink': 'link to comments',
      'comments': '{ "text": "nice test" }'
    }

  def test_create_post(self):
    response = client.put(
      f'/author/{self.payload["author"]}/posts/{self.payload["_id"]}/',
      data=json.dumps(self.payload),
      content_type='application/json'
    )
    self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    # TODO: Add more test logic if we ever to override the creation functionality ourselves.