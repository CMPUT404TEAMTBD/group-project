from django.test import TestCase
from quickstart.models import Inbox, Author
from types import SimpleNamespace
from quickstart.tests.helper_test import get_test_author_fields

class CreateInbox(TestCase):
  """Tests for creating an Inbox."""
  def setUp(self): 
    self.inbox = Inbox.objects.create(
      author=Author.objects.create(**get_test_author_fields()),
    )

  def test_create_inbox(self):
    self.assertTrue(self.inbox.author)

    self.assertEqual(self.inbox.type, 'inbox')
    self.assertEqual(len(self.inbox.items), 0)