from django.test import TestCase
from quickstart.models import Author
from types import SimpleNamespace
from quickstart.tests.helper_test import get_test_author_fields

class CreateAuthor(TestCase):
  """Tests for creating an Author."""
  def setUp(self): 
    self.fields = SimpleNamespace(**get_test_author_fields())
    self.author = Author.objects.create(**vars(self.fields))

  def test_create_author(self):
    self.assertTrue(self.author.id)

    self.assertEqual(self.author.type, 'author')
    self.assertEqual(self.author.displayName, self.fields.displayName)
    self.assertEqual(self.author.github, self.fields.github)
    self.assertEqual(self.author.host, self.fields.host)
    self.assertEqual(self.author.url, self.fields.url)