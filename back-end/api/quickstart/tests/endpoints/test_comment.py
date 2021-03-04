import json
from rest_framework import status
from django.test import TestCase, Client
from quickstart.models import Comment
from quickstart.serializers import CommentSerializer
from quickstart.tests.helper_test import get_test_comment_fields

client = Client()

class GetAllCommentsTest(TestCase):
  """Tests for getting all comments of a given post at endpoint /api/author/<str:author>/posts/<str:post>/comments/"""
  def setUp(self):
    self.test_post_id = 1
    self.test_other_post_id = 2
    self.comment1 = Comment.objects.create(**get_test_comment_fields(1), postId=self.test_post_id)
    self.comment2 = Comment.objects.create(**get_test_comment_fields(2), postId=self.test_post_id)
    self.comment3 = Comment.objects.create(**get_test_comment_fields(3), postId=self.test_other_post_id)


  def test_get_all_comments(self):
    response = client.get(f'/api/author/testauthor/posts/{self.test_post_id}/comments/')

    comments = Comment.objects.filter(postId=self.test_post_id)
    serializer = CommentSerializer(comments, many=True)

    self.assertEqual(response.data, serializer.data)
    self.assertEqual(response.status_code, status.HTTP_200_OK)


  def test_get_other_comments(self):
    response = client.get(f'/api/author/testauthor/posts/{self.test_other_post_id}/comments/')

    comments = Comment.objects.filter(postId=self.test_other_post_id)
    serializer = CommentSerializer(comments, many=True)

    self.assertEqual(response.data, serializer.data)
    self.assertEqual(response.status_code, status.HTTP_200_OK)


class CreateCommentTest(TestCase):
  """
  Tests for POST'ing (creating) a comment for a given post at endpoint
  /api/author/<str:author>/posts/<str:post>/comments/ 
  """

  def setUp(self):
    self.payload = get_test_comment_fields(1)

  def test_create_comment(self):
    response = client.post(
      f'/api/author/testauthor/posts/postId/comments/',
      data=json.dumps(self.payload),
      content_type='application/json'
    )

    self.assertEqual(response.status_code, status.HTTP_201_CREATED)
