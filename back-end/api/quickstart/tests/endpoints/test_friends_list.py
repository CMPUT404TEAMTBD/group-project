import json
from rest_framework import status
from django.test import TestCase, Client
from quickstart.models import Author, Follow, Following
from quickstart.serializers import AuthorSerializer
from quickstart.tests.helper_test import get_test_author_fields, get_follow_author_fields

client = Client()

class GetFriends(TestCase):
  """Tests for getting all friends of an author at endpoint /api/author/{author}/friends/."""
  def setUp(self):
    self.author = Author.objects.create(**get_test_author_fields(i=1))

    self.friends = [
      Author.objects.create(**get_test_author_fields(i=2)), 
      Author.objects.create(**get_test_author_fields(i=3))
    ]

    self.other_follower = Author.objects.create(**get_test_author_fields(i=4))
    
    self.other_followings = Author.objects.create(**get_test_author_fields(i=5))

    self.follows = [
      Follow.objects.create(receiver=self.author, sender=AuthorSerializer(self.friends[0]).data),
      Follow.objects.create(receiver=self.author, sender=AuthorSerializer(self.friends[1]).data),
      Follow.objects.create(receiver=self.author, sender=AuthorSerializer(self.other_follower).data),
    ]

    self.followings = [
      Following.objects.create(receiver=AuthorSerializer(self.friends[0]).data, sender=self.author),
      Following.objects.create(receiver=AuthorSerializer(self.friends[1]).data, sender=self.author),
      Following.objects.create(receiver=AuthorSerializer(self.other_followings).data, sender=self.author),
    ]

    self.friends_obj = [
      AuthorSerializer(self.friends[0]).data,
      AuthorSerializer(self.friends[1]).data
    ] 

  def test_get_all_friends(self):
    response = client.get(f'/api/author/{self.author.id}/friends/')

    self.assertEqual(response.status_code, status.HTTP_200_OK)
    self.assertEqual(response.data['type'], 'friends')
    self.assertEqual(response.data['items'], self.friends_obj)
