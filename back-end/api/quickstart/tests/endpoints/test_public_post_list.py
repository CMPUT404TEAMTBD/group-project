"""Tests for the /api/author/{AUTHOR_ID}/posts/ endpoint.
Referenced https://realpython.com/test-driven-development-of-a-django-restful-api/"""
from rest_framework import status
from django.test import TestCase, Client
from quickstart.models import Post
from quickstart.serializers import PostSerializer
from .helper_test import get_test_post_fields

client = Client()

class GetPublicPosts(TestCase):
  def setUp(self):
    self.post1 = Post.objects.create(
      **get_test_post_fields(1, "auth1", visibility="Private")
    )
    self.post2 = Post.objects.create(
      **get_test_post_fields(2, "auth1", visibility="Private")
    )
    self.post3 = Post.objects.create(
      **get_test_post_fields(3, "otherauthor", visibility="Private")
    )
    self.public_post = Post.objects.create(
      **get_test_post_fields(4, "auth1", visibility="Public")
    )

  def tests_get_all_public_posts(self):
    response = client.get(f'/api/public-posts/')

    posts = Post.objects.filter(visibility='Public')

    serializer = PostSerializer(posts, many=True)

    self.assertEqual(response.data, serializer.data)
    self.assertEqual(response.status_code, status.HTTP_200_OK)