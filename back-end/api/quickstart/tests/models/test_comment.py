from django.test import TestCase
from quickstart.models import Comment, Author, Post
from types import SimpleNamespace
from quickstart.tests.helper_test import get_test_comment_fields, get_test_author_fields, get_test_post_fields

class CreateComment(TestCase):
  """Tests for creating a Comment."""
  def setUp(self): 
    self.fields = SimpleNamespace(**get_test_comment_fields())
    
    self.post = Post.objects.create(**get_test_post_fields(), author=Author.objects.create(**get_test_author_fields()))
    self.comment = Comment.objects.create(**vars(self.fields), post=self.post)
      

  def test_create_comment(self):
    self.assertTrue(self.comment.id)
    self.assertTrue(self.comment.post)
    self.assertTrue(self.comment.published)

    self.assertEqual(self.comment.type, 'comment')
    self.assertEqual(self.comment.author, self.fields.author)
    self.assertEqual(self.comment.comment, self.fields.comment)