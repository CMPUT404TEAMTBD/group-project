import json
from rest_framework import status
from django.test import TestCase, Client
from quickstart.models import Like
from quickstart.serializers import LikeSerializer
from quickstart.tests.helper_test import get_test_like_fields

client = Client()

class GetLikesForComment(TestCase):
  """Tests for getting all likes of a comment at endpoint api/author/<str:author>/posts/<str:post>/comments/<str:comment>/likes/."""
  def setUp(self):
    self.test_comment_id = 1
    self.like1 = Like.objects.create(**get_test_like_fields(object_id=self.test_comment_id))
    self.like2 = Like.objects.create(**get_test_like_fields(object_id=self.test_comment_id))
    self.like3 = Like.objects.create(**get_test_like_fields(object_id=2))

    self.likes = [self.like1, self.like2]

  def test_get_likes_for_comment(self):
    response = client.get(f'/api/author/authorId/posts/postId/comments/{self.test_comment_id}/likes/')

    likes = Like.objects.filter(object__contains=self.test_comment_id)
    serializer = LikeSerializer(likes, many=True)

    self.assertEqual(response.status_code, status.HTTP_200_OK)
    self.assertEqual(response.data['type'], 'likes')
    self.assertEqual(response.data['items'], serializer.data) 
