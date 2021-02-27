"""Tests for the /api/author/{AUTHOR_ID}/posts/ endpoint.
Referenced https://realpython.com/test-driven-development-of-a-django-restful-api/"""
import json
from rest_framework import status
from django.test import TestCase, Client
from quickstart.models import Author, Post
from quickstart.serializers import PostSerializer
from quickstart.tests.helper_test import get_test_author_fields, get_test_post_fields, get_test_partial_post_fields

client = Client()

class GetPosts(TestCase):
  def setUp(self):
    self.author1 = Author.objects.create(**get_test_author_fields())
    self.post1 = Post.objects.create(
      **get_test_post_fields(1), author=self.author1
    )
    self.post2 = Post.objects.create(
      **get_test_post_fields(2), author=self.author1
    )

    self.author2 = Author.objects.create(**get_test_author_fields())
    self.post3 = Post.objects.create(
      **get_test_post_fields(3), author=self.author2
    )

  def test_get_all_posts(self):
    response = client.get(f'/api/author/{self.author1.id}/posts/')

    posts = Post.objects.filter(author=self.author1.id)
    serializer = PostSerializer(posts, many=True)

    self.assertEqual(response.data, serializer.data)
    self.assertEqual(response.status_code, status.HTTP_200_OK)


class CreatePost(TestCase):
  def setUp(self):
    self.author = Author.objects.create(**get_test_author_fields())
    self.payload = get_test_partial_post_fields(i=1)
    
  def test_create_post(self):
    response = client.post(
      f'/api/author/{self.author.id}/posts/',
      data=json.dumps(self.payload),
      content_type='application/json'
    )
    post = Post.objects.get(id=response.data['id'])

    self.assertEqual(response.status_code, status.HTTP_201_CREATED)
    self.assertEqual(response.data, PostSerializer(post).data)