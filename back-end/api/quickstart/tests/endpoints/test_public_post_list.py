"""Tests for the /api/author/{AUTHOR_ID}/posts/ endpoint.
Referenced https://realpython.com/test-driven-development-of-a-django-restful-api/"""
from rest_framework import status
from django.test import TestCase, Client
from quickstart.models import Author, Post
from quickstart.serializers import PostSerializer
from quickstart.tests.helper_test import get_test_author_fields, get_test_post_fields

client = Client()

class GetPublicPosts(TestCase):
  def setUp(self):
    self.author1 = Author.objects.create(**get_test_author_fields())
    self.author2 = Author.objects.create(**get_test_author_fields())

    self.post1 = Post.objects.create(
      **get_test_post_fields(1, visibility="Public", unlisted=False), author=self.author1
    )
    self.post2 = Post.objects.create(
      **get_test_post_fields(2, visibility="Public", unlisted=False), author=self.author2
    )
    self.post3 = Post.objects.create(
      **get_test_post_fields(3, visibility="Private", unlisted=False), author=self.author1
    )
    self.post4 = Post.objects.create(
      **get_test_post_fields(4, visibility="Private", unlisted=False), author=self.author2
    )
    self.post5 = Post.objects.create(
      **get_test_post_fields(5, visibility="Public", unlisted=True), author=self.author1
    )

  def tests_get_all_public_posts(self):
    response = client.get(f'/api/public-posts/')

    posts = Post.objects.filter(visibility='Public', unlisted=False).order_by('-published')

    serializer = PostSerializer(posts, many=True)

    self.assertEqual(response.data, serializer.data)
    self.assertEqual(response.status_code, status.HTTP_200_OK)

    self.assertEqual(len(response.data), 2)