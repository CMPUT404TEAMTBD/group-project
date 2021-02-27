from django.contrib.auth.models import User, Group
from .models import Author, Post, Follow, Comment, Like, Inbox
from rest_framework import viewsets
from rest_framework import status
from rest_framework.response import Response
from quickstart.serializers import UserSerializer, GroupSerializer, AuthorSerializer, PostSerializer, FollowSerializer, CommentSerializer, LikeSerializer, InboxSerializer
from .mixins import MultipleFieldLookupMixin
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.permissions import IsAuthenticated


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
    lookup_field = 'id'


class AuthUserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows to fetch an author by the author's username (NOT displayName).
    """
    queryset = Author.objects.all()
    serializer_class = AuthorSerializer

    def retrieve(self, request, username):
        try:
            author = Author.objects.get(user__username=username)
            serializer = AuthorSerializer(author)
        except Author.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        return Response(serializer.data)


class PostListViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows posts to be viewed or edited.
    """
    authentication_classes = [BasicAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    lookup_field = 'id'
    
    """
    Get all posts for the queried author.
    If the authenticated author is the same queried author, we return ALL posts for that author.
    Otherwise, we only return the queried author's public posts.
    """
    def list(self, request, author):
        try:
            # TODO: Set up pagination: https://www.django-rest-framework.org/api-guide/pagination/

            authenticated_author = Author.objects.get(user__username=request.user)
            # Check if the authenticated author is the same as the author we're querying for posts.
            if str(authenticated_author.id) == author:
                queryset = Post.objects.filter(author=author)
            else:
                queryset = Post.objects.filter(author=author, visibility="Public", unlisted=False)

            serializer = PostSerializer(queryset, many=True)
        except (Author.DoesNotExist, Post.DoesNotExist):
            return Response(status=status.HTTP_404_NOT_FOUND)

        return Response(serializer.data)

    def create(self, request, author):
        try:
            author = Author.objects.get(id=author)
            post = Post.objects.create(author=author, **request.data)
            serializer = PostSerializer(post)
        except Author.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        return Response(serializer.data, status=status.HTTP_201_CREATED)

class PublicPostListViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows posts to be viewed or edited.
    """
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    lookup_field = 'id'

    def list(self, request):
        try:
            # TODO: Set up pagination: https://www.django-rest-framework.org/api-guide/pagination/
            queryset = Post.objects.filter(visibility='Public')
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
    lookup_field = 'id'

    def create(self, request, author, id):
        try:
            author = Author.objects.get(id=author)
            post = Post.objects.create(author=author, id=id, **request.data)
            serializer = PostSerializer(post)
        except Author.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        return Response(serializer.data, status=status.HTTP_201_CREATED)
    

class CommentViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows comments to be viewed or edited.
    """
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    lookup_field = 'id'

    def retrieve(self, request, author, post):
        try:
            queryset = Comment.objects.filter(postId=post)
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
        senders = Author.objects.filter(id__in=sender_ids)
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


class LikesPostViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows getting likes for a given post.
    """
    queryset = Like.objects.all()
    serializer_class = LikeSerializer

    # TODO: Author is currently being ignored. Do we need to use it?
    def retrieve(self, request, author, post):
        likes = Like.objects.filter(object=post)
        serializer = LikeSerializer(likes, many=True)

        return Response({
            'type': 'likes',
            'items': serializer.data
        })


class LikesCommentViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows getting likes for a given comment.
    """
    queryset = Like.objects.all()
    serializer_class = LikeSerializer

    # TODO: Author+Post is currently being ignored. Do we need to use it?
    def retrieve(self, request, author, post, comment):
        likes = Like.objects.filter(object=comment)
        serializer = LikeSerializer(likes, many=True)

        return Response({
            'type': 'likes',
            'items': serializer.data
        })


class LikedViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows getting a list of public things author_id liked
    """
    queryset = Like.objects.all() #used for default behaviour
    serializer_class = LikeSerializer

    def list(self, request, author):
        liked = Like.objects.filter(author=author)
        serializer = LikeSerializer(liked, many=True)

        return Response({
            'type': 'liked',
            'items': serializer.data
        })

class InboxViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows getting inbox items for an author
    """
    queryset = Inbox.objects.all()
    serializer_class = InboxSerializer
    lookup_field = 'author'
        
    def update(self, request, author):
        inbox = Inbox.objects.get(author=author)
        inbox.items.append(request.data)
        inbox.save()

        return Response(status=status.HTTP_204_NO_CONTENT)

    def destroy(self, request, author):
        inbox = Inbox.objects.get(author=author)
        inbox.items.clear()
        inbox.save()    

        return Response(status=status.HTTP_204_NO_CONTENT)


