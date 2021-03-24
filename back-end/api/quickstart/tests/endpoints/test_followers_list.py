import json
from rest_framework import status
from django.test import TestCase, Client
from quickstart.models import Author, Follow
from quickstart.serializers import AuthorSerializer, FollowSerializer
from quickstart.tests.helper_test import get_test_author_fields, get_follow_author_fields

client = Client()

class GetFollowers(TestCase):
  """Tests for getting all followers of an author at endpoint /api/author/{RECEIVER_ID}/followers/."""
  def setUp(self):
    self.senders = [
      Author.objects.create(**get_test_author_fields(i=1)), 
      Author.objects.create(**get_test_author_fields(i=2))
    ]

    self.receiver = Author.objects.create(**get_test_author_fields(i=3))
    
    self.follows = [
      Follow.objects.create(receiver=self.receiver, sender=AuthorSerializer(self.senders[0]).data),
      Follow.objects.create(receiver=self.receiver, sender=AuthorSerializer(self.senders[1]).data)
    ]

  def test_get_all_followers(self):
    response = client.get(f'/api/author/{self.receiver.id}/followers/')
    serializer = FollowSerializer(self.follows, many=True)

    self.assertEqual(response.status_code, status.HTTP_200_OK)
    self.assertEqual(response.data['type'], 'followers')

    self.assertEqual(response.data['items'], serializer.data)
