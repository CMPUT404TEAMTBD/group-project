from django.test import TestCase
from quickstart.models import Follow
from types import SimpleNamespace
from quickstart.tests.helper_test import get_test_follow_fields

class CreateFollow(TestCase):
  """Tests for creating a Follow."""
  def setUp(self): 
    self.fields = SimpleNamespace(**get_test_follow_fields())
    self.follow = Follow.objects.create(**vars(self.fields))

  def test_create_Follow(self):
    self.assertEqual(self.follow.receiver, self.fields.receiver)
    self.assertEqual(self.follow.sender, self.fields.sender)
    self.assertEqual(self.follow.approved, self.fields.approved)