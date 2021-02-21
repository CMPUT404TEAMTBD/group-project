from django.contrib.auth.models import User, Group
from .models import Author, Post, Follow, Comment, Like, Inbox
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
        fields = ['id', 'type', 'displayName', 'url', 'github']


class PostSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Post
        fields = ['_id', '_type', 'title', 'description', 'source', 'origin', 'visibility',
                  'unlisted', 'author', 'contentType', 'content',
                  'categories', 'published', 'count', 'pageSize', 'commentLink', 'comments']


class CommentSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Comment
        fields = ['_id', '_type', 'postId', 'author', 'comment', 'contentType', 'published']


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