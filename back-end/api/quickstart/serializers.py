from django.contrib.auth.models import User, Group
from .models import Author, Post, Follow
from rest_framework import serializers


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ['url', 'username', 'email', 'groups']


class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ['url', 'name']


class AuthorSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Author
        fields = ['_id', '_type', 'displayName', 'url', 'github']


class PostSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Post
        fields = ['_id', '_type', 'title', 'description', 'source', 'origin', 'visibility',
                  'unlisted', 'isPrivateToFriends', 'author', 'contentType', 'content',
                  'categories', 'published', 'count', 'pageSize', 'commentLink', 'comments']


class FollowSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Follow
        fields = ['receiver', 'sender', 'approved']
