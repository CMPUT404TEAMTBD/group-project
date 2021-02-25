"""Tests for the /api/author/{AUTHOR_ID}/posts/ endpoint.
Referenced https://realpython.com/test-driven-development-of-a-django-restful-api/"""
import json
from rest_framework import status
from django.test import TestCase, Client
from quickstart.models import Post
from quickstart.serializers import PostSerializer
from .helper_test import get_test_post_fields, get_test_partial_post_fields

client = Client()

class GetPosts(TestCase):
  def setUp(self):
    self.post1 = Post.objects.create(
      **get_test_post_fields(1)
    )
    self.post2 = Post.objects.create(
      **get_test_post_fields(2)
    )
    self.post3 = Post.objects.create(
      **get_test_post_fields(3, "otherauthor")
    )

  def test_get_all_posts(self):
    response = client.get(f'/api/author/{self.post1.author}/posts/')

    posts = Post.objects.filter(author=self.post1.author)
    serializer = PostSerializer(posts, many=True)

    self.assertEqual(response.data, serializer.data)
    self.assertEqual(response.status_code, status.HTTP_200_OK)


class CreatePost(TestCase):
  def setUp(self):
    self.post = Post.objects.create(**get_test_post_fields(i=1))
    self.payload = get_test_partial_post_fields(i=1)
    
  def test_create_post(self):
    response = client.post(
      f'/api/author/{self.post.author}/posts/',
      data=json.dumps(self.payload),
      content_type='application/json'
    )

    self.assertEqual(response.status_code, status.HTTP_201_CREATED)
