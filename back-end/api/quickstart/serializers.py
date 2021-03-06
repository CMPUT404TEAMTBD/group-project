"""
serializers.py defines Serializers that help convert our Django models to JSON and vice-versa.
We have one Serializer for each of our models, and we specify exactly what fields should be serialized.
"""
from django.contrib.auth.models import User, Group
from .models import Author, Post, Follow, Following, Comment, Like, Inbox, Node
from rest_framework import serializers

class AuthorSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Author
        fields = ['id', 'type', 'displayName', 'url', 'github', 'host']


class NodeSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Node
        fields = ['host', 'username', 'password']

class PostSerializer(serializers.HyperlinkedModelSerializer):
    author = AuthorSerializer(read_only=True)

    class Meta:
        model = Post
        fields = ['id', 'type', 'title', 'description', 'source', 'origin', 'visibility',
                  'unlisted', 'author', 'contentType', 'content',
                  'categories', 'published', 'commentLink']

class CommentSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Comment
        fields = ['id', 'type', 'author', 'comment', 'published', 'contentType']


class FollowSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Follow
        fields = ['sender']

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        return ret['sender']

class FollowingSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Following
        fields = ['receiver']

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        return ret['receiver']


class LikeSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Like
        fields = ['type', 'author', 'object']
        

class InboxSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Inbox
        fields = ['type', 'items']