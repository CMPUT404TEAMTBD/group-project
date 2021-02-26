from django.test import TestCase
from quickstart.models import Inbox
from types import SimpleNamespace
from quickstart.tests.helper_test import get_test_inbox_fields

class CreateInbox(TestCase):
  """Tests for creating an Inbox."""
  def setUp(self): 
    self.fields = SimpleNamespace(**get_test_inbox_fields())
    self.inbox = Inbox.objects.create(**vars(self.fields))

  def test_create_inbox(self):
    self.assertTrue(self.inbox.author)

    self.assertEqual(self.inbox.type, 'inbox')
    self.assertEqual(self.inbox.items, self.fields.items)