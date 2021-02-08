import json
from rest_framework import status
from django.test import TestCase, Client
from .models import Author, Post, Comment
from .serializers import AuthorSerializer, PostSerializer, CommentSerializer
import datetime

client = Client()

def get_test_comment1_fields():
  return {
    '_id': 'testid',
    'postId': 'testpostid',
    'author': 'testcommenter1',
    'comment': 'i am a comment',
    'contentType': 'text/plain',
    'published': '03:25:53.827044',
  }

def get_test_comment2_fields():
  return {
    '_id': 'testid2',
    'postId': 'testpostid',
    'author': 'testcommenter2',
    'comment': 'i am a comment2',
    'contentType': 'text/plain',
    'published': '03:25:53.827044',
  }

def get_test_comment3_fields():
  return {
    '_id': 'testid3',
    'postId': 'testotherpostid',
    'author': 'testcommenter4',
    'comment': 'i am a comment3',
    'contentType': 'text/plain',
    'published': '03:25:53.827044',
  }


class GetAllCommentsTest(TestCase):
  """ Test module for GET all comments for a post API """

  def setUp(self):
    self.comment1 = Comment.objects.create(**get_test_comment1_fields())
    self.comment2 = Comment.objects.create(**get_test_comment2_fields())
    self.comment3 = Comment.objects.create(**get_test_comment3_fields())


  def test_get_all_comments(self):
    # get API response
    response = client.get(f'/author/testauthor/posts/{self.comment1.postId}/comments/')
    # get data from db
    comments = Comment.objects.filter(postId=self.comment1.postId)
    serializer = CommentSerializer(comments, many=True)
    self.assertEqual(response.data, serializer.data)
    self.assertEqual(response.status_code, status.HTTP_200_OK)


  def test_get_other_comments(self):
    # get API response
    response = client.get(f'/author/testauthor/posts/{self.comment3.postId}/comments/')
    # get data from db
    comments = Comment.objects.filter(postId=self.comment3.postId)
    serializer = CommentSerializer(comments, many=True)
    self.assertEqual(response.data, serializer.data)
    self.assertEqual(response.status_code, status.HTTP_200_OK)


class CreateCommentTest(TestCase):
  """ Test module for GET all comments for a post API """

  def setUp(self):
    self.payload = get_test_comment1_fields()

  def test_create_comment(self):
    response = client.post(
      f'/author/testauthor/posts/{self.payload["postId"]}/comments/',
      data=json.dumps(self.payload),
      content_type='application/json'
    )

    self.assertEqual(response.status_code, status.HTTP_201_CREATED)
