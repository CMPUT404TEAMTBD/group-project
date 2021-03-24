from django.test import TestCase
from quickstart.models import Following, Author
from types import SimpleNamespace
from quickstart.tests.helper_test import get_follow_author_fields, get_test_author_fields

class CreateFollowing(TestCase):
  """Tests for creating a Following."""
  def setUp(self): 
    self.receiver = get_follow_author_fields()
    self.following = Following.objects.create(receiver=self.receiver, sender=Author.objects.create(**get_test_author_fields()))

  def test_create_following(self):
    self.assertTrue(self.following.sender)
    self.assertEqual(self.following.receiver, self.receiver)