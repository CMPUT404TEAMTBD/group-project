import json
from rest_framework import status
from django.test import TestCase, Client
from .models import Author, Follow
from .serializers import AuthorSerializer
from .helper_test import get_test_author_fields, get_test_follow_fields

client = Client()

class GetFollowers(TestCase):
  """Tests for getting all followers of an author at endpoint /api/author/{RECEIVER_ID}/followers/."""
  def setUp(self):
    self.senders = [
      Author.objects.create(**get_test_author_fields(i=1)), 
      Author.objects.create(**get_test_author_fields(i=2))
    ]

    self.receiver_id = "testId"
    Follow.objects.create(receiver=self.receiver_id, sender=self.senders[0].id, approved=False)
    Follow.objects.create(receiver=self.receiver_id, sender=self.senders[1].id, approved=False)

  def test_get_all_followers(self):
    response = client.get(f'/api/author/{self.receiver_id}/followers/')
    self.assertEqual(response.status_code, status.HTTP_200_OK)
    self.assertEqual(response.data['type'], 'followers')

    for i in range(len(self.senders)):
      self.assertEqual(response.data['items'][i], AuthorSerializer(self.senders[i]).data)
