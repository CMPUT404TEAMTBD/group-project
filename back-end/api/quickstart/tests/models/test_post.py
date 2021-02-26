from django.test import TestCase
from quickstart.models import Post
from types import SimpleNamespace
from quickstart.tests.helper_test import get_test_post_fields

class CreatePost(TestCase):
  """Tests for creating a Post."""
  def setUp(self): 
    self.fields = SimpleNamespace(**get_test_post_fields())
    self.post = Post.objects.create(**vars(self.fields))

  def test_create_post(self):
    self.assertTrue(self.post.id)
    self.assertTrue(self.post.author)
    self.assertTrue(self.post.published)

    self.assertEqual(self.post.type, 'post')
    self.assertEqual(self.post.title, self.fields.title)
    self.assertEqual(self.post.description, self.fields.description)
    self.assertEqual(self.post.source, self.fields.source)
    self.assertEqual(self.post.origin, self.fields.origin)
    self.assertEqual(self.post.visibility, self.fields.visibility)
    self.assertEqual(self.post.unlisted, self.fields.unlisted)
    self.assertEqual(self.post.contentType, self.fields.contentType)
    self.assertEqual(self.post.content, self.fields.content)
    self.assertEqual(self.post.categories, self.fields.categories)
    self.assertEqual(self.post.commentLink, self.fields.commentLink)