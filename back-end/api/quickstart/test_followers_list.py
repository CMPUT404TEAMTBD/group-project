import json
from rest_framework import status
from django.test import TestCase, Client
from .models import Author, Follow
import datetime

client = Client()

def get_test_follow_fields():
  return {
    'receiver': 'receiverUrl',
    'sender': 'senderUrl',
    'approved': False
  }

class GetFollowers(TestCase):
  """Tests for getting all followers of an author at endpoint /author/{RECEIVER_ID}/followers/."""
  def setUp(self):
    for i in range(2):
      Follow.objects.create(
        receiver='receiverUrl',
        sender=f'senderUrl{i}',
        approved=False
      )

      Author.objects.create(
        _id=f'senderUrl{i}',
        displayName=f'John Doe{i}',
        url=f'testUrl{i}',
        github=f'testGithub{i}')
    

  def test_get_all_followers(self):
    response = client.get(f'/author/receiverUrl/followers/')
    # follow = Follow.objects.get(receiver=self.follow.receiver, sender=self.follow.sender)
    # serializer = FollowSerializer(follow)
    # self.assertEqual(response.data, serializer.data)
    self.assertEqual(response.status_code, status.HTTP_200_OK)
    print(response.data)