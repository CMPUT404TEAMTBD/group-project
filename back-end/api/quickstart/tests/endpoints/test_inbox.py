import json
import uuid
from rest_framework import status
from rest_framework.test import APIClient, force_authenticate
from django.contrib.auth.models import User
from django.test import TestCase
from quickstart.models import Like, Inbox, Author
from quickstart.serializers import InboxSerializer
from quickstart.tests.helper_test import get_test_post_fields, get_follow_author_fields, get_test_like_fields, get_test_author_fields

client = APIClient()

class GetInbox(TestCase):
  """Tests to GET an author's inbox at endpoint /api/author/<str:author>/inbox/."""
  def setUp(self):
    client.force_authenticate(User.objects.create(username='john', password='doe'))
    self.inbox = Inbox.objects.create(author=Author.objects.create(**get_test_author_fields()))
    self.inbox.items.append(get_test_post_fields())
    self.inbox.items.append(get_follow_author_fields())
    self.inbox.items.append(get_test_like_fields())
    self.inbox.save()

  def test_get_inbox(self):
    response = client.get(f'/api/author/{self.inbox.author.id}/inbox/')
    inbox = Inbox.objects.get(author=self.inbox.author)

    self.assertEqual(response.status_code, status.HTTP_200_OK)
    self.assertEqual(response.data, InboxSerializer(inbox).data)

  def test_get_invalid_inbox(self):
    response = client.get(f'/api/author/{uuid.uuid4()}/inbox/')
    self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class PostInbox(TestCase):
  """Tests for sending a post/follow/like to an inbox by POST'ing to /api/author/<str:author>/inbox/."""
  def setUp(self):
    client.force_authenticate(User.objects.create(username='john', password='doe'))
    self.inbox = Inbox.objects.create(author=Author.objects.create(**get_test_author_fields()))

  def test_send_post_to_inbox(self):
    fields = get_test_post_fields()
    fields['type'] = 'post'
    self.send_to_inbox(fields)

  def test_send_follow_to_inbox(self):
    fields = get_follow_author_fields()
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
      f'/api/author/{self.inbox.author.id}/inbox/',
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
    client.force_authenticate(User.objects.create(username='john', password='doe'))
    self.inbox = Inbox.objects.create(author=Author.objects.create(**get_test_author_fields()))
    self.inbox.items.append(get_follow_author_fields())
    self.inbox.save()

  def test_clear_inbox(self):
    self.assertEqual(len(self.inbox.items), 1)

    response = client.delete(f'/api/author/{self.inbox.author.id}/inbox/')
    changed_inbox = Inbox.objects.get(author=self.inbox.author)

    self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
    self.assertEqual(len(changed_inbox.items), 0)