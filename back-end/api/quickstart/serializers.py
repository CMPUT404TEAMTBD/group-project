"""
serializers.py defines Serializers that help convert our Django models to JSON and vice-versa.
We have one Serializer for each of our models, and we specify exactly what fields should be serialized.
"""
from django.contrib.auth.models import User, Group
from .models import Author, Post, Follow, Comment, Like, Inbox
from rest_framework import serializers

class AuthorSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Author
        fields = ['id', 'type', 'displayName', 'url', 'github']

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
        fields = ['id', 'type', 'author', 'comment', 'contentType', 'published']


class FollowSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Follow
        fields = ['sender']

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        return ret["sender"]


class LikeSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Like
        fields = ['context', 'summary', 'type', 'author', 'object']
        

class InboxSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Inbox
        fields = ["author", "items"]