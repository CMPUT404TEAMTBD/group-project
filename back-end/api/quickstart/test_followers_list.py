import json
from rest_framework import status
from django.test import TestCase, Client
from .models import Author, Follow
from .serializers import AuthorSerializer
from .helper_test import get_test_follow_fields

client = Client()

class GetFollowers(TestCase):
  """Tests for getting all followers of an author at endpoint /api/author/{RECEIVER_ID}/followers/."""
  def setUp(self):
    self.senders = []
    for i in range(2):
      Follow.objects.create(
        receiver='receiverUrl',
        sender=f'senderUrl{i}',
        approved=False
      )

      self.senders.append(
        Author.objects.create(
          id=f'senderUrl{i}',
          displayName=f'John Doe{i}',
          url=f'testUrl{i}',
          github=f'testGithub{i}')
        )

  def test_get_all_followers(self):
    response = client.get(f'/api/author/receiverUrl/followers/')
    self.assertEqual(response.status_code, status.HTTP_200_OK)
    self.assertEqual(response.data['type'], 'followers')

    for i in range(len(self.senders)):
      self.assertEqual(response.data['items'][i], AuthorSerializer(self.senders[i]).data)
