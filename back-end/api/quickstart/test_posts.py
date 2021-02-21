"""Tests for the /api/author/{AUTHOR_ID}/posts/{POST_ID}/ endpoint.
Referenced https://realpython.com/test-driven-development-of-a-django-restful-api/"""
import json
from rest_framework import status
from django.test import TestCase, Client
from .models import Author, Post
from .serializers import AuthorSerializer, PostSerializer
from .helper_test import get_test_post_fields

client = Client()

class GetPostById(TestCase):
  """Tests for getting a single Post by their ID at endpoint /api/author/{AUTHOR_ID}/posts/{POST_ID}/."""
  def setUp(self):
    self.post = Post.objects.create(
      **get_test_post_fields()
    )

  def test_get_valid_post(self):
    response = client.get(f'/api/author/{self.post.author}/posts/{self.post.id}/')
    post = Post.objects.get(id=self.post.id)
    serializer = PostSerializer(post)
    self.assertEqual(response.data, serializer.data)
    self.assertEqual(response.status_code, status.HTTP_200_OK)

  def test_get_invalid_post(self):
    response = client.get(f'/api/author/{self.post.author}/posts/invalidId/')
    self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class UpdatePostById(TestCase):
  """Tests for updating a single Post by POST'ing to endpoint /author/{AUTHOR_ID}/posts/{POST_ID}/."""
  def setUp(self):
    self.post = Post.objects.create(**get_test_post_fields())

    self.payload = get_test_post_fields()

  def test_update_post(self):
    response = client.post(
      f'/api/author/{self.post.author}/posts/{self.post.id}/',
      data=json.dumps(self.payload),
      content_type='application/json'
    )
    self.assertEqual(response.status_code, status.HTTP_200_OK)

    # Compare each payload field with the updated Post object.
    serializer = PostSerializer(Post.objects.get(id=self.post.id))
    for k in self.payload:
      self.assertEqual(serializer.data[k], self.payload[k])

    # Ensure other fields are unchanged
    self.assertEqual(serializer.data['id'], self.post.id)
    self.assertEqual(serializer.data['type'], self.post.type)

  def test_update_invalid_post(self):
    response = client.post(
      f'/api/author/{self.post.author}/posts/invalidId/',
      data=json.dumps(self.payload),
      content_type='application/json'
    )
    self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

  
class DeletePostById(TestCase):
  """Tests for deleting a single Post by their ID at endpoint /author/{AUTHOR_ID}/posts/{POST_ID}/."""
  def setUp(self):
    self.post = Post.objects.create(**get_test_post_fields())

  def test_delete_valid_post(self):
    response = client.delete(f'/api/author/{self.post.author}/posts/{self.post.id}/')
    self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

  def test_delete_invalid_post(self):
    response = client.delete(f'/api/author/{self.post.author}/posts/invalidId/')
    self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class CreatePostById(TestCase):
  """Tests for creating a single Post by PUT'ing to endpoint /author/{AUTHOR_ID}/posts/{POST_ID}/."""
  def setUp(self):
    self.payload = get_test_post_fields()

  def test_create_post(self):
    response = client.put(
      f'/api/author/{self.payload["author"]}/posts/{self.payload["id"]}/',
      data=json.dumps(self.payload),
      content_type='application/json'
    )
    self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    # TODO: Add more test logic if we ever to override the creation functionality ourselves.
