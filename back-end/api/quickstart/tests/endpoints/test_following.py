import json
from rest_framework import status
from rest_framework.test import APIClient, force_authenticate
from django.contrib.auth.models import User
from django.test import TestCase
from quickstart.models import Following, Author
from quickstart.serializers import FollowingSerializer, AuthorSerializer
from quickstart.tests.helper_test import get_follow_author_fields, get_test_author_fields

client = APIClient()

class GetFollowing(TestCase):
  """Tests for getting a single Following at endpoint /api/author/{SENDER_ID}/following/{RECEIVER_ID}/."""
  def setUp(self):
    client.force_authenticate(User.objects.create(username='john', password='doe'))
    self.receiver = Author.objects.create(**get_test_author_fields())
    self.sender = Author.objects.create(**get_test_author_fields())
    self.following = Following.objects.create(receiver=AuthorSerializer(self.receiver).data, sender=self.sender)

  def test_get_valid_following(self):
    response = client.get(f'/api/author/{self.sender.id}/following/{self.receiver.id}/')
    serializer = FollowingSerializer(self.following)
    
    self.assertEqual(response.status_code, status.HTTP_200_OK)
    for property in serializer.data.keys():
      self.assertEqual(response.data[property], serializer.data[property])
    

  def test_get_invalid_following(self):
    response = client.get(f'/api/author/{self.sender.id}/following/invalidId/')
    self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

  
class DeleteFollowing(TestCase):
  """Tests for deleting a single Following at endpoint /api/author/{SENDER_ID}/following/{RECEIVER_ID}/."""
  def setUp(self):
    client.force_authenticate(User.objects.create(username='john', password='doe'))
    self.receiver = Author.objects.create(**get_test_author_fields())
    self.sender = Author.objects.create(**get_test_author_fields())
    self.follow = Following.objects.create(receiver=AuthorSerializer(self.receiver).data, sender=self.sender)

  def test_delete_valid_following(self):
    response = client.delete(f'/api/author/{self.sender.id}/following/{self.receiver.id}/')
    self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

  def test_delete_invalid_following(self):
    response = client.delete(f'/api/author/{self.sender.id}/following/invalidId/')
    self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class CreateFollowing(TestCase):
  """Tests for creating a Following by PUT'ing to endpoint /api/author/{SENDER_ID}/following/{RECEIVER_ID}/."""
  def setUp(self):
    client.force_authenticate(User.objects.create(username='john', password='doe'))
    self.sender = Author.objects.create(**get_test_author_fields(i=1))
    self.receiver = get_follow_author_fields()
    self.receiver_id = self.receiver["id"]

  def test_create_following(self):
    response = client.put(
      f'/api/author/{self.sender.id}/following/{self.receiver_id}/',
      data=json.dumps(self.receiver),
      content_type='application/json'
    )
    self.assertEqual(response.status_code, status.HTTP_201_CREATED)
    self.assertTrue(Following.objects.get(receiver=self.receiver, sender=self.sender))

  def test_create_dup_following(self):
    client.put(
      f'/api/author/{self.sender.id}/following/{self.receiver_id}/',
      data=json.dumps(self.receiver),
      content_type='application/json'
    )

    response = client.put(
      f'/api/author/{self.sender.id}/following/{self.receiver_id}/',
      data=json.dumps(self.receiver),
      content_type='application/json'
    )
    self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
