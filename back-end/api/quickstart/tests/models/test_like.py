from django.test import TestCase
from quickstart.models import Like
from types import SimpleNamespace
from quickstart.tests.helper_test import get_test_like_fields

class CreateLike(TestCase):
  """Tests for creating a Like."""
  def setUp(self): 
    self.fields = SimpleNamespace(**get_test_like_fields())
    self.like = Like.objects.create(**vars(self.fields))

  def test_create_like(self):
    self.assertEqual(self.like.type, 'like')
    self.assertEqual(self.like.context, self.fields.context)
    self.assertEqual(self.like.summary, self.fields.summary)
    self.assertEqual(self.like.author, self.fields.author)
    self.assertEqual(self.like.object, self.fields.object)