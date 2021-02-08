from django.contrib.auth.models import User, Group
from .models import Author, Post, Follow
from rest_framework import viewsets
from rest_framework import permissions
from rest_framework import status
from rest_framework.response import Response
from quickstart.serializers import UserSerializer, GroupSerializer, AuthorSerializer, PostSerializer, FollowSerializer
from .mixins import MultipleFieldLookupMixin


class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer
    # permission_classes = [permissions.IsAuthenticated]


class GroupViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    # permission_classes = [permissions.IsAuthenticated]


class AuthorViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows authors to be viewed or edited.
    """
    queryset = Author.objects.all()
    serializer_class = AuthorSerializer
    # Using lookup_field as search param
    # https://stackoverflow.com/questions/56431755/django-rest-framework-urls-without-pk
    lookup_field = '_id'


class PostViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows post to be viewed or edited.
    """
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    lookup_field = "_id"


class FollowersListViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows getting a list of all followers for an author.
    """
    queryset = Follow.objects.all()
    serializer_class = FollowSerializer
    lookup_field = "receiver"


class FollowersViewSet(MultipleFieldLookupMixin, viewsets.ModelViewSet):
    """
    API endpoint that allows removing, adding, and checking followers for an author.
    """
    queryset = Follow.objects.all()
    serializer_class = FollowSerializer
    lookup_fields = ['receiver', 'sender']
