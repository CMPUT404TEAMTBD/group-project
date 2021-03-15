import json
from rest_framework import status
from django.test import TestCase, Client
from quickstart.models import Author, Like
from quickstart.serializers import AuthorSerializer, LikeSerializer
from quickstart.tests.helper_test import get_test_author_fields, get_test_like_fields

client = Client()

class GetLikedForAuthor(TestCase):
  """Tests for getting all things liked by an author '/api/author/<str:author>/liked/'."""
  def setUp(self):
    self.author = Author.objects.create(**get_test_author_fields())
    self.other_author = Author.objects.create(**get_test_author_fields())
    
    self.like1 = Like.objects.create(**get_test_like_fields(author=AuthorSerializer(self.author).data))
    self.like2 = Like.objects.create(**get_test_like_fields(author=AuthorSerializer(self.author).data))
    self.like3 = Like.objects.create(**get_test_like_fields(author=AuthorSerializer(self.other_author).data))

    self.likes = [self.like1, self.like2]

  def test_get_liked(self):
    response = client.get(f'/api/author/{self.author.id}/liked/')

    serializer = LikeSerializer(self.likes, many=True)

    self.assertEqual(response.status_code, status.HTTP_200_OK)
    self.assertEqual(response.data['type'], 'liked')
    self.assertEqual(response.data['items'], serializer.data)