from django.contrib.auth.models import User, Group
from .models import Author, Post, Follow, Comment
from rest_framework import viewsets
from rest_framework import permissions
from rest_framework import status
from rest_framework.response import Response
from quickstart.serializers import UserSerializer, GroupSerializer, AuthorSerializer, PostSerializer, FollowSerializer, CommentSerializer
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

class PostListViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows posts to be viewed or edited.
    """
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    lookup_field = '_id'

    def list(self, request, author):
        try:
            # TODO: Set up pagination: https://www.django-rest-framework.org/api-guide/pagination/
            queryset = Post.objects.filter(author=author)
            serializer = PostSerializer(queryset, many=True)
        except Post.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        return Response(serializer.data)


class PostViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows post to be viewed or edited.
    """
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    lookup_field = '_id'


class CommentViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows comments to be viewed or edited.
    """
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    lookup_field = '_id'

    def list(self, request, author, posts):
        try:
            queryset = Comment.objects.filter(postId=posts)
            serializer = CommentSerializer(queryset, many=True)
        except Comment.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        return Response(serializer.data)


class FollowersListViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows for listing the followers of an author.
    """
    def list(self, request, receiver):
        follows = Follow.objects.filter(receiver=receiver)
        sender_ids = [f.sender for f in follows]

        # TODO: Most likely will have to make API calls here instead of database reading.
        senders = Author.objects.filter(_id__in=sender_ids)
        serializer = AuthorSerializer(senders, many=True)

        return Response({
            'type': 'followers',
            'items': serializer.data
        })


class FollowersViewSet(MultipleFieldLookupMixin, viewsets.ModelViewSet):
    """
    API endpoint that allows removing, adding, and checking followers for an author.
    """
    queryset = Follow.objects.all()
    serializer_class = FollowSerializer
    lookup_fields = ['receiver', 'sender']
