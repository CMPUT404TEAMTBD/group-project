"""
serializers.py
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
        fields = ['receiver', 'sender', 'approved']


class LikeSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Like
        fields = ['context', 'summary', 'type', 'author', 'object']
        

class InboxSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Inbox
        fields = ["author", "items"]