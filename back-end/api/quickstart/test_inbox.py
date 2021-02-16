import json
from rest_framework import status
from django.test import TestCase, Client
from .models import Inbox
from .serializers import InboxSerializer
from .helper_test import get_test_post_fields, get_test_follow_fields, get_test_like_post_fields

client = Client()

class GetInbox(TestCase):
  """Tests to GET an author's inbox at endpoint /api/author/<str:author>/inbox/."""
  def setUp(self):
    self.inbox = Inbox.objects.create(author="testAuthorId")
    self.inbox.items.append(get_test_post_fields())
    self.inbox.items.append(get_test_follow_fields())
    self.inbox.items.append(get_test_like_post_fields())
    self.inbox.save()

  def test_get_inbox(self):
    response = client.get(f'/api/author/{self.inbox.author}/inbox/')
    inbox = Inbox.objects.get(author=self.inbox.author)

    self.assertEqual(response.status_code, status.HTTP_200_OK)
    self.assertEqual(response.data, InboxSerializer(inbox).data)

  def test_get_invalid_inbox(self):
    response = client.get('/api/author/invalidAuthorId/inbox/')
    self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class PostInbox(TestCase):
"""Tests for sending a post/follow/like to an inbox by POST'ing to /api/author/<str:author>/inbox/."""
  def setUp(self):
    self.inbox = Inbox.objects.create(author="testAuthorId")

  def test_send_post_to_inbox(self):
    self.payload = get_test_follow_fields()

    response = client.post(
      f'/api/author/{self.inbox.author}/inbox/',
      data=json.dumps(self.payload),
      content_type='application/json'
    )
    
    self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
    changed_inbox = Inbox.objects.get(author=self.inbox.author)

    self.assertEqual(len(changed_inbox.items), 1)
    self.assertEqual(changed_inbox.items[0], self.payload)


class ClearInbox(TestCase):
  """Tests for clearing an author's inbox by DELETE'ing to /api/author/<str:author>/inbox/."""
  def setUp(self):
    self.inbox = Inbox.objects.create(author="testAuthorId")
    self.inbox.items.append(get_test_follow_fields())
    self.inbox.save()

  def test_clear_inbox(self):
    self.assertEqual(len(self.inbox.items), 1)

    response = client.delete(f'/api/author/{self.inbox.author}/inbox/')
    changed_inbox = Inbox.objects.get(author=self.inbox.author)

    self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
    self.assertEqual(len(changed_inbox.items), 0)