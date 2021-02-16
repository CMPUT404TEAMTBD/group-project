import json
from rest_framework import status
from django.test import TestCase, Client
from .models import Like
from .serializers import LikeSerializer

client = Client()

def get_test_like_fields(post_id):
  return {
    'context': 'testContext',
    'summary': 'Someone likes your post',
    'author': 'testAuthorUrl',
    '_object': f'{post_id}',
  }

class GetLikesForPost(TestCase):
  """Tests for getting all likes of a post at endpoint api/author/<str:author>/posts/<str:post>/likes/."""
  def setUp(self):
    self.test_post_id = 1
    self.like1 = Like.objects.create(**get_test_like_fields(post_id=self.test_post_id))
    self.like2 = Like.objects.create(**get_test_like_fields(post_id=self.test_post_id))
    self.like3 = Like.objects.create(**get_test_like_fields(post_id=2))

    self.likes = [self.like1, self.like2]

  def test_get_likes_for_post(self):
    response = client.get(f'/api/author/authorId/posts/{self.test_post_id}/likes/')

    likes = Like.objects.filter(_object=self.test_post_id)
    serializer = LikeSerializer(likes, many=True)

    self.assertEqual(response.status_code, status.HTTP_200_OK)
    self.assertEqual(response.data['type'], 'likes')

    self.assertEqual(len(response.data['items']), len(self.likes))
    for i in range(len(self.likes)):
      self.assertEqual(response.data['items'][i], LikeSerializer(self.likes[i]).data)
