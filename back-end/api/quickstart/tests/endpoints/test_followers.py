import json
from rest_framework import status
from django.test import TestCase, Client
from quickstart.models import Follow
from quickstart.serializers import FollowSerializer
from .helper_test import get_test_follow_fields

client = Client()

class GetFollow(TestCase):
  """Tests for getting a single Follow at endpoint /api/author/{RECEIVER_ID}/followers/{SENDER_ID}/."""
  def setUp(self):
    self.follow = Follow.objects.create(**get_test_follow_fields())

  def test_get_valid_follow(self):
    response = client.get(f'/api/author/{self.follow.receiver}/followers/{self.follow.sender}/')
    follow = Follow.objects.get(receiver=self.follow.receiver, sender=self.follow.sender)
    serializer = FollowSerializer(follow)
    self.assertEqual(response.data, serializer.data)
    self.assertEqual(response.status_code, status.HTTP_200_OK)

  def test_get_invalid_follow(self):
    response = client.get(f'/api/author/{self.follow.receiver}/followers/invalidId/')
    self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

  
class DeleteFollow(TestCase):
  """Tests for deleting a single Follow at endpoint /api/author/{RECEIVER_ID}/followers/{SENDER_ID}/."""
  def setUp(self):
    self.follow = Follow.objects.create(**get_test_follow_fields())

  def test_delete_valid_follow(self):
    response = client.delete(f'/api/author/{self.follow.receiver}/followers/{self.follow.sender}/')
    self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

  def test_delete_invalid_follow(self):
    response = client.delete(f'/api/author/{self.follow.receiver}/followers/invalidId/')
    self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class CreateFollow(TestCase):
  """Tests for creating a Follow by PUT'ing to endpoint /api/author/{RECEIVER_ID}/followers/{SENDER_ID}/."""
  def setUp(self):
    self.payload = get_test_follow_fields()

  def test_create_post(self):
    response = client.put(
      f'/api/author/{self.payload["receiver"]}/followers/{self.payload["sender"]}/',
      data=json.dumps(self.payload),
      content_type='application/json'
    )
    self.assertEqual(response.status_code, status.HTTP_201_CREATED)
