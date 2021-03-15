import json
from rest_framework import status
from django.test import TestCase, Client
from quickstart.models import Like, Inbox
from quickstart.serializers import InboxSerializer
from quickstart.tests.helper_test import get_test_post_fields, get_test_follow_fields, get_test_like_fields

client = Client()

class GetInbox(TestCase):
  """Tests to GET an author's inbox at endpoint /api/author/<str:author>/inbox/."""
  def setUp(self):
    self.inbox = Inbox.objects.create(author="testAuthorId")
    self.inbox.items.append(get_test_post_fields())
    self.inbox.items.append(get_test_follow_fields())
    self.inbox.items.append(get_test_like_fields())
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
    fields = get_test_post_fields()
    fields['type'] = 'post'
    self.send_to_inbox(fields)

  def test_send_follow_to_inbox(self):
    fields = get_test_follow_fields()
    fields['type'] = 'follow'
    self.send_to_inbox(fields)

  def test_send_like_to_inbox(self):
    fields = get_test_like_fields()
    fields['type'] = 'like'
    self.send_to_inbox(fields)
    
    # Ensure a Like model is saved into our database.
    self.assertTrue(Like.objects.get(object=fields['object']))

  def send_to_inbox(self, payload):
    response = client.post(
      f'/api/author/{self.inbox.author}/inbox/',
      data=json.dumps(payload),
      content_type='application/json'
    )
    
    self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
    changed_inbox = Inbox.objects.get(author=self.inbox.author)

    self.assertEqual(len(changed_inbox.items), 1)
    self.assertEqual(changed_inbox.items[0], payload)


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