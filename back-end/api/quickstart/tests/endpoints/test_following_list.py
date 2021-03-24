import json
from rest_framework import status
from django.test import TestCase, Client
from quickstart.models import Author, Following
from quickstart.serializers import AuthorSerializer, FollowingSerializer
from quickstart.tests.helper_test import get_test_author_fields

client = Client()

class GetFollowing(TestCase):
  """Tests for getting all following of an author at endpoint /api/author/{SENDER_ID}/following/."""
  def setUp(self):
    self.receivers = [
      Author.objects.create(**get_test_author_fields(i=1)), 
      Author.objects.create(**get_test_author_fields(i=2))
    ]

    self.sender = Author.objects.create(**get_test_author_fields(i=3))
    
    self.following = [
      Following.objects.create(sender=self.sender, receiver=AuthorSerializer(self.receivers[0]).data),
      Following.objects.create(sender=self.sender, receiver=AuthorSerializer(self.receivers[1]).data)
    ]

  def test_get_all_followings(self):
    response = client.get(f'/api/author/{self.sender.id}/following/')
    serializer = FollowingSerializer(self.following, many=True)

    self.assertEqual(response.status_code, status.HTTP_200_OK)
    self.assertEqual(response.data['type'], 'following')

    self.assertEqual(response.data['items'], serializer.data)
