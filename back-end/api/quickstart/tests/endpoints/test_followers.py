import json
from rest_framework import status
from rest_framework.test import APIClient, force_authenticate
from django.contrib.auth.models import User
from django.test import TestCase, Client
from quickstart.models import Follow, Author, Inbox
from quickstart.serializers import FollowSerializer, AuthorSerializer
from quickstart.tests.helper_test import get_follow_author_fields, get_test_author_fields

client = APIClient()

class GetFollow(TestCase):
  """Tests for getting a single Follow at endpoint /api/author/{RECEIVER_ID}/followers/{SENDER_ID}/."""
  def setUp(self):
    client.force_authenticate(User.objects.create(username='john', password='doe'))
    self.receiver = Author.objects.create(**get_test_author_fields())
    self.sender = Author.objects.create(**get_test_author_fields())
    self.sender_id = self.sender.id
    self.follow = Follow.objects.create(sender=AuthorSerializer(self.sender).data, receiver=self.receiver)

  def test_get_valid_follow(self):
    response = client.get(f'/api/author/{self.receiver.id}/followers/{self.sender_id}/')
    serializer = FollowSerializer(self.follow)
    
    self.assertEqual(response.status_code, status.HTTP_200_OK)
    for property in serializer.data.keys():
      self.assertEqual(response.data[property], serializer.data[property])
    

  def test_get_invalid_follow(self):
    response = client.get(f'/api/author/{self.receiver.id}/followers/invalidId/')
    self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

  
class DeleteFollow(TestCase):
  """Tests for deleting a single Follow at endpoint /api/author/{RECEIVER_ID}/followers/{SENDER_ID}/."""
  def setUp(self):
    client.force_authenticate(User.objects.create(username='john', password='doe'))
    self.receiver = Author.objects.create(**get_test_author_fields())
    self.sender = Author.objects.create(**get_test_author_fields())
    self.sender_id = self.sender.id
    self.follow = Follow.objects.create(sender=AuthorSerializer(self.sender).data, receiver=self.receiver)

  def test_delete_valid_follow(self):
    response = client.delete(f'/api/author/{self.receiver.id}/followers/{self.sender_id}/')
    self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

  def test_delete_invalid_follow(self):
    response = client.delete(f'/api/author/{self.receiver.id}/followers/invalidId/')
    self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class CreateFollow(TestCase):
  """Tests for creating a Follow by PUT'ing to endpoint /api/author/{RECEIVER_ID}/followers/{SENDER_ID}/."""
  def setUp(self):
    client.force_authenticate(User.objects.create(username='john', password='doe'))
    self.receiver = Author.objects.create(**get_test_author_fields(i=1))
    self.inbox = Inbox.objects.create(author=self.receiver)
    self.sender = get_follow_author_fields()
    self.sender_id = self.sender["id"]

  def test_create_follow(self):
    response = client.put(
      f'/api/author/{self.receiver.id}/followers/{self.sender_id}/',
      data=json.dumps(self.sender),
      content_type='application/json'
    )
    self.assertEqual(response.status_code, status.HTTP_201_CREATED)
    self.assertTrue(Follow.objects.get(receiver=self.receiver, sender=self.sender))

    changed_inbox = Inbox.objects.get(author=self.receiver)
    self.assertTrue(changed_inbox.items[0])