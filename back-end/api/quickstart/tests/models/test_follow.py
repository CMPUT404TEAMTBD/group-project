from django.test import TestCase
from quickstart.models import Follow, Author
from types import SimpleNamespace
from quickstart.tests.helper_test import get_follow_author_fields, get_test_author_fields

class CreateFollow(TestCase):
  """Tests for creating a Follow."""
  def setUp(self): 
    self.sender = get_follow_author_fields()
    self.follow = Follow.objects.create(sender=self.sender, receiver=Author.objects.create(**get_test_author_fields()))

  def test_create_Follow(self):
    self.assertTrue(self.follow.receiver)
    self.assertEqual(self.follow.sender, self.sender)