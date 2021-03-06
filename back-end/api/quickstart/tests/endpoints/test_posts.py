"""Tests for the /api/author/{AUTHOR_ID}/posts/{POST_ID}/ endpoint.
Referenced https://realpython.com/test-driven-development-of-a-django-restful-api/"""
import json
import uuid
from rest_framework import status
from rest_framework.test import APIClient, force_authenticate
from django.contrib.auth.models import User
from django.test import TestCase
from quickstart.models import Author, Post
from quickstart.serializers import AuthorSerializer, PostSerializer
from quickstart.tests.helper_test import get_test_author_fields, get_test_post_fields, get_test_partial_post_fields

client = APIClient()

class GetPostById(TestCase):
  """Tests for getting a single Post by their ID at endpoint /api/author/{AUTHOR_ID}/posts/{POST_ID}/."""
  def setUp(self):
    client.force_authenticate(User.objects.create(username='john', password='doe'))
    self.author = Author.objects.create(**get_test_author_fields())
    self.post = Post.objects.create(**get_test_post_fields(), author=self.author)

  def test_get_valid_post(self):
    response = client.get(f'/api/author/{self.author.id}/posts/{self.post.id}/')
    post = Post.objects.get(id=self.post.id)
    serializer = PostSerializer(post)
    self.assertEqual(response.data, serializer.data)
    self.assertEqual(response.status_code, status.HTTP_200_OK)

  def test_get_invalid_post(self):
    response = client.get(f'/api/author/{self.author.id}/posts/invalidId/')
    self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class UpdatePostById(TestCase):
  """Tests for updating a single Post by POST'ing to endpoint /author/{AUTHOR_ID}/posts/{POST_ID}/."""
  def setUp(self):
    client.force_authenticate(User.objects.create(username='john', password='doe'))
    self.author = Author.objects.create(**get_test_author_fields())
    self.post = Post.objects.create(**get_test_post_fields(), author=self.author)

    self.payload = get_test_partial_post_fields()

  def test_update_post(self):
    response = client.post(
      f'/api/author/{self.author.id}/posts/{self.post.id}/',
      data=json.dumps(self.payload),
      content_type='application/json'
    )
    self.assertEqual(response.status_code, status.HTTP_200_OK)

    # Compare each payload field with the updated Post object.
    serializer = PostSerializer(Post.objects.get(id=self.post.id))
    for k in self.payload:
      self.assertEqual(serializer.data[k], self.payload[k])

    # Ensure other fields are unchanged
    self.assertEqual(serializer.data['id'], str(self.post.id))
    self.assertEqual(serializer.data['type'], self.post.type)

  def test_partial_update_post(self):
    partial_payload = { 'description': 'new description'}
    response = client.post(
      f'/api/author/{self.author.id}/posts/{self.post.id}/',
      data=json.dumps(partial_payload),
      content_type='application/json'
    )
    self.assertEqual(response.status_code, status.HTTP_200_OK)

  def test_update_invalid_post(self):
    response = client.post(
      f'/api/author/{self.author.id}/posts/invalidId/',
      data=json.dumps(self.payload),
      content_type='application/json'
    )
    self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

  
class DeletePostById(TestCase):
  """Tests for deleting a single Post by their ID at endpoint /author/{AUTHOR_ID}/posts/{POST_ID}/."""
  def setUp(self):
    client.force_authenticate(User.objects.create(username='john', password='doe'))
    self.author = Author.objects.create(**get_test_author_fields())
    self.post = Post.objects.create(**get_test_post_fields(), author=self.author)

  def test_delete_valid_post(self):
    response = client.delete(f'/api/author/{self.author.id}/posts/{self.post.id}/')
    self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

  def test_delete_invalid_post(self):
    response = client.delete(f'/api/author/{self.author.id}/posts/invalidId/')
    self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class CreatePostById(TestCase):
  """Tests for creating a single Post by PUT'ing to endpoint /author/{AUTHOR_ID}/posts/{POST_ID}/."""
  def setUp(self):
    client.force_authenticate(User.objects.create(username='john', password='doe'))
    self.author = Author.objects.create(**get_test_author_fields())
    self.uuid = uuid.uuid4()
    self.payload = get_test_post_fields()

  def test_create_post(self):
    response = client.put(
      f'/api/author/{self.author.id}/posts/{self.uuid}/',
      data=json.dumps(self.payload),
      content_type='application/json'
    )
    post = Post.objects.get(id=self.uuid)

    self.assertEqual(response.status_code, status.HTTP_201_CREATED)
    self.assertEqual(response.data, PostSerializer(post).data)
