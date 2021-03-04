"""Tests for the /api/author/{AUTHOR_ID}/posts/ endpoint.
Referenced https://realpython.com/test-driven-development-of-a-django-restful-api/"""
import json
from rest_framework import status
from rest_framework.test import APIClient, force_authenticate
from django.test import TestCase, Client
from django.contrib.auth.models import User
from quickstart.models import Author, Post
from quickstart.serializers import PostSerializer
from quickstart.tests.helper_test import get_test_author_fields, get_test_post_fields, get_test_partial_post_fields

client = Client()

class GetPosts(TestCase):
  """Tests to GET all posts for an Author, at endpoint api/author/<str:author>/posts/"""
  def setUp(self):
    self.auth_client = APIClient()

    self.user1 = User.objects.create(username='john', password='doe')
    self.author1 = Author.objects.create(**get_test_author_fields(), user=self.user1)
    self.post1 = Post.objects.create(
      **get_test_post_fields(1, visibility="Public", unlisted=False), author=self.author1
    )
    self.post2 = Post.objects.create(
      **get_test_post_fields(2, visibility="Private", unlisted=False), author=self.author1
    )
    self.post3 = Post.objects.create(
      **get_test_post_fields(3, visibility="Public", unlisted=True), author=self.author1
    )

    self.user2 = User.objects.create(username='mary', password='lamb')
    self.author2 = Author.objects.create(**get_test_author_fields(), user=self.user2)

  def test_get_all_posts_for_myself(self):
    self.auth_client.force_authenticate(user=self.user1)
    response = self.auth_client.get(f'/api/author/{self.author1.id}/posts/')
    
    posts = Post.objects.filter(author=self.author1.id).order_by('-published')
    serializer = PostSerializer(posts, many=True)

    self.assertEqual(response.data, serializer.data)
    self.assertEqual(response.status_code, status.HTTP_200_OK)

  def test_get_all_posts_for_another_author(self):
    self.auth_client.force_authenticate(user=self.user2)
    response = self.auth_client.get(f'/api/author/{self.author1.id}/posts/')
    
    posts = Post.objects.filter(author=self.author1.id, visibility="Public", unlisted=False).order_by('-published')
    serializer = PostSerializer(posts, many=True)

    self.assertEqual(response.data, serializer.data)
    self.assertEqual(response.status_code, status.HTTP_200_OK)

  def test_get_all_posts_unauthorized(self):
    response = client.get(f'/api/author/{self.author1.id}/posts/')

    self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class CreatePost(TestCase):
  """Tests to POST (create) a new Post at endpoint api/author/<str:author>/posts/"""
  def setUp(self):
    self.auth_client = APIClient()

    self.user = User.objects.create(username='john', password='doe')
    self.author = Author.objects.create(**get_test_author_fields(), user=self.user)

    self.payload = get_test_partial_post_fields(i=1)
    
  def test_create_post(self):
    self.auth_client.force_authenticate(user=self.user)
    response = self.auth_client.post(
      f'/api/author/{self.author.id}/posts/',
      data=json.dumps(self.payload),
      content_type='application/json'
    )
    post = Post.objects.get(id=response.data['id'])

    self.assertEqual(response.status_code, status.HTTP_201_CREATED)
    self.assertEqual(response.data, PostSerializer(post).data)

  def test_create_post_unauthorized(self):
    response = client.post(
      f'/api/author/{self.author.id}/posts/',
      data=json.dumps(self.payload),
      content_type='application/json'
    )

    self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)