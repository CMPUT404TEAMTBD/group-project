import json
from rest_framework import status
from django.test import TestCase, Client
from quickstart.models import Like
from quickstart.serializers import LikeSerializer
from quickstart.tests.helper_test import get_test_like_fields

client = Client()

class GetLikedForAuthor(TestCase):
  """Tests for getting all things liked by an author '/api/author/<str:author>/liked/'."""
  def setUp(self):
    self.test_author_id = 1
    self.like1 = Like.objects.create(**get_test_like_fields(author_id= self.test_author_id))
    self.like2 = Like.objects.create(**get_test_like_fields(author_id= self.test_author_id))
    self.like3 = Like.objects.create(**get_test_like_fields(author_id=2))

    self.likes = [self.like1, self.like2]

  def test_get_liked(self):
    response = client.get(f'/api/author/{self.test_author_id}/liked/')

   
    liked = Like.objects.filter(author=self.test_author_id)
    serializer = LikeSerializer(liked, many=True)

    self.assertEqual(response.status_code, status.HTTP_200_OK)
    self.assertEqual(response.data['type'], 'liked')

    self.assertEqual(len(response.data['items']), len(self.likes))
    for i in range(len(self.likes)):
      self.assertEqual(response.data['items'][i], LikeSerializer(self.likes[i]).data)
