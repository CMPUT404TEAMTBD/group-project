"""Tests for the /api/author/{AUTHOR_ID}/posts/ endpoint.
Referenced https://realpython.com/test-driven-development-of-a-django-restful-api/"""
from rest_framework import status
from django.test import TestCase, Client
from .models import Post
from .serializers import PostSerializer
from .helper_test import get_test_post_fields

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
