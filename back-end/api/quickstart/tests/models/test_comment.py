from django.test import TestCase
from quickstart.models import Comment
from types import SimpleNamespace
from quickstart.tests.helper_test import get_test_comment_fields

class CreateComment(TestCase):
  """Tests for creating a Comment."""
  def setUp(self): 
    self.fields = SimpleNamespace(**get_test_comment_fields())
    self.comment = Comment.objects.create(**vars(self.fields), postId='testPostId')

  def test_create_comment(self):
    self.assertTrue(self.comment.id)
    self.assertTrue(self.comment.postId)
    self.assertTrue(self.comment.published)

    self.assertEqual(self.comment.type, 'comment')
    self.assertEqual(self.comment.author, self.fields.author)
    self.assertEqual(self.comment.comment, self.fields.comment)
    self.assertEqual(self.comment.contentType, self.fields.contentType)