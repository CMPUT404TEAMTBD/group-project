import json
from rest_framework import status
from rest_framework.test import APIClient, force_authenticate
from django.contrib.auth.models import User
from django.test import TestCase
from quickstart.models import Comment, Author, Post
from quickstart.serializers import CommentSerializer
from quickstart.tests.helper_test import get_test_comment_fields, get_test_post_fields, get_test_author_fields

client = APIClient()

class GetAllCommentsTest(TestCase):
  """Tests for getting all comments of a given post at endpoint /api/author/<str:author>/posts/<str:post>/comments/"""
  def setUp(self):
    client.force_authenticate(User.objects.create(username='john', password='doe'))

    self.post1 = Post.objects.create(**get_test_post_fields(), author=Author.objects.create(**get_test_author_fields()))
    self.post2 = Post.objects.create(**get_test_post_fields(), author=Author.objects.create(**get_test_author_fields()))
    self.post3 = Post.objects.create(**get_test_post_fields(), author=Author.objects.create(**get_test_author_fields()))

    self.comment1 = Comment.objects.create(**get_test_comment_fields(), post=self.post1)
    self.comment2 = Comment.objects.create(**get_test_comment_fields(), post=self.post1)
    self.comment3 = Comment.objects.create(**get_test_comment_fields(), post=self.post2)

  def test_get_all_comments(self):
    response = client.get(f'/api/author/testauthor/posts/{self.post1.id}/comments/')

    comments = Comment.objects.filter(post=self.post1)
    serializer = CommentSerializer(comments, many=True)

    self.assertEqual(response.data, serializer.data)
    self.assertEqual(response.status_code, status.HTTP_200_OK)

  def test_get_paginated_comments(self):
    for i in range(10):
      Comment.objects.create(**get_test_comment_fields(), post=self.post1)

    response = client.get(f'/api/author/testauthor/posts/{self.post1.id}/comments/?size=5&page=2')

    self.assertEqual(len(response.data), 5)

  def test_get_empty_comments(self):
    response = client.get(f'/api/author/testauthor/posts/{self.post3.id}/comments/')

    self.assertEqual(response.data, [])
    self.assertEqual(response.status_code, status.HTTP_200_OK)


class CreateCommentTest(TestCase):
  """
  Tests for POST'ing (creating) a comment for a given post at endpoint
  /api/author/<str:author>/posts/<str:post>/comments/ 
  """

  def setUp(self):
    client.force_authenticate(User.objects.create(username='john', password='doe'))
    self.post = Post.objects.create(**get_test_post_fields(), author=Author.objects.create(**get_test_author_fields()))
    self.payload = get_test_comment_fields()

  def test_create_comment(self):
    response = client.post(
      f'/api/author/testauthor/posts/{self.post.id}/comments/',
      data=json.dumps(self.payload),
      content_type='application/json'
    )

    comment = Comment.objects.get(post=self.post)
    self.assertTrue(comment)
    self.assertEqual(response.status_code, status.HTTP_201_CREATED)
    self.assertEqual(response.data, CommentSerializer(comment).data)