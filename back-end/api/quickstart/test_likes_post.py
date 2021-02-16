import json
from rest_framework import status
from django.test import TestCase, Client
from .models import Like
from .serializers import LikeSerializer

client = Client()

def get_test_like_fields(post_id):
  return {
    'context': 'testContext'
    'postId': post_id,
    'author': f'testcommenter{i}',
    'comment': 'i am a comment',
    'contentType': 'text/plain',
    'published': '03:25:53.827044',
  }

class GetLikesForPost(TestCase):
  """Tests for getting all likes of a post at endpoint api/author/<str:author>/posts/<str:post>/likes/."""
  def setUp(self):
    self.test_post_id = 1
    self.like1 = get_test_like_fields(post_id=self.test_post_id)
    self.like2 = get_test_like_fields(post_id=self.test_post_id)
    self.like3 = get_test_like_fields(post_id=2)

  def test_get_likes_for_post(self):
    response = client.get(f'/api/author/authorId/posts/{self.test_post_id}/likes/')

    likes = Like.objects.filter(object=self.test_post_id)
    serializer = LikeSerializer(likes, many=True)

    self.assertEqual(response.data, serializer.data)
    self.assertEqual(response.status_code, status.HTTP_200_OK)
