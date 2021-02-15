"""Tests for the /api/author/{AUTHOR_ID}/posts/ endpoint.
Referenced https://realpython.com/test-driven-development-of-a-django-restful-api/"""
from rest_framework import status
from django.test import TestCase, Client
from .models import Post
from .serializers import PostSerializer
import datetime

client = Client()

def get_test_post_fields(i, author="testauthorid"):
  return {
    '_id': i,
    'title': f'testpost{i}',
    'description': f'i am test post {i}',
    'source': 'source post id',
    'origin': 'origin post id',
    'visibility': 'Public',
    'unlisted': True,
    'isPrivateToFriends': True,
    'author': author,
    'contentType': 'text/plain',
    'content': 'Hello, I am a test post',
    'categories': '["Testing"]',
    'published': datetime.datetime.now(),
    'count': 5,
    'pageSize': 20,
    'commentLink': 'link to comments',
    'comments': '{ "text": "nice test" }'
  }

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

  def get_all_posts(self):
    response = client.get(f'/api/author/{self.post1.author}/posts/')

    comments = Post.objects.filter(postId=self.post1.postId)
    serializer = PostSerializer(comments, many=True)

    self.assertEqual(response.data, serializer.data)
    self.assertEqual(response.status_code, status.HTTP_200_OK)
