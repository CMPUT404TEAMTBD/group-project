"""
views.py defines the code that is run upon receiving a request to our endpoints, whose URLs are defined in urls.py.
Some endpoint handlers have been omitted, meaning that the DRF default code is sufficient.
"""
import json
from django.contrib.auth.models import User, Group
from .models import Author, Post, Follow, Following, Comment, Like, Inbox, Node
from rest_framework import viewsets
from rest_framework import status
from rest_framework.response import Response
from quickstart.serializers import AuthorSerializer, PostSerializer, FollowSerializer, FollowingSerializer, CommentSerializer, LikeSerializer, InboxSerializer, NodeSerializer
from .mixins import MultipleFieldLookupMixin
from rest_framework.authentication import BasicAuthentication
from rest_framework.permissions import IsAuthenticated
from .permissions import IsAuthenticatedOrGet


class AuthorViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows authors to be viewed or edited.
    """
    queryset = Author.objects.all()
    serializer_class = AuthorSerializer

    # Using lookup_field as search param
    # https://stackoverflow.com/questions/56431755/django-rest-framework-urls-without-pk
    lookup_field = 'id'

class AuthorsViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows getting all authors.
    """
    # DO NOT AUTHENTICATION UNTIL DEEMED SAFE WITH OTHER GROUPS AFTER DEMOS
    queryset = Author.objects.all()
    serializer_class = AuthorSerializer
    lookup_field = 'id'

    def list(self, request):
        authors = Author.objects.all()
        serializer = AuthorSerializer(authors, many=True)

        return Response(serializer.data)

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

class NodesViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows getting all external servers this one is connected to.
    Hostname and Basic Auth credentials for each server is returned.
    """
    queryset = Node.objects.all()
    serializer_class = NodeSerializer

    def list(self, request):
        nodes = Node.objects.all()
        serializer = NodeSerializer(nodes, many=True)

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
                queryset = Post.objects.filter(author=author, visibility="PUBLIC", unlisted=False)

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
    API endpoint that allows public posts to be viewed
    """
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    lookup_field = 'id'

    def list(self, request):
        try:
            # TODO: Set up pagination: https://www.django-rest-framework.org/api-guide/pagination/
            # Warning: visibility='PUBLIC' (single quotes) does not work.
            queryset = Post.objects.filter(visibility="PUBLIC", unlisted=False)
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
    authentication_classes = [BasicAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    lookup_field = 'id'

    def retrieve(self, request, author, post):
        queryset = Comment.objects.filter(post=post)
        serializer = CommentSerializer(queryset, many=True)

        return Response(serializer.data)

    def create(self, request, author, post):
        try:
            postObj = Post.objects.get(id=post)
            comment = Comment.objects.create(**request.data, post=postObj)
            serializer = CommentSerializer(comment)
        except Post.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        return Response(serializer.data, status=status.HTTP_201_CREATED)


class FriendsListViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows for listing the friends of an author.
    """
    def list(self, request, author):
        try:
            author = Author.objects.get(id=author)
            follow_queryset = Follow.objects.filter(receiver=author)
            following_queryset = Following.objects.filter(sender=author)

            friends = []
            for follow in follow_queryset:
                for following in following_queryset:
                    if follow.sender["id"] == following.receiver["id"]:
                        friends.append(follow.sender)
                        break

        except Author.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
            
        return Response({
            'type': 'friends',
            'items': friends
        })


class FollowersListViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows for listing the followers of an author.
    """
    def list(self, request, receiver):
        try:
            author = Author.objects.get(id=receiver)
            queryset = Follow.objects.filter(receiver=author)

            serializer = FollowSerializer(queryset, many=True)

        except Author.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
            
        return Response({
            'type': 'followers',
            'items': serializer.data
        })


class FollowersViewSet(MultipleFieldLookupMixin, viewsets.ModelViewSet):
    """
    API endpoint that allows removing, adding, and checking followers for an author.
    """
    authentication_classes = [BasicAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = Follow.objects.all()
    serializer_class = FollowSerializer
    lookup_fields = ['receiver']

    def retrieve(self, request, receiver, sender):
        try:
            author = Author.objects.get(id=receiver)
            follow = Follow.objects.get(receiver=author, sender__id=sender)

            serializer = FollowSerializer(follow)

        except (Author.DoesNotExist, Follow.DoesNotExist):
            return Response(status=status.HTTP_404_NOT_FOUND)

        return Response(serializer.data)


    def create(self, request, receiver, sender):
        try:
            author = Author.objects.get(id=receiver)
            Follow.objects.create(receiver=author, sender=request.data["actor"])
        except Author.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        # Save this follow to the inbox of the receiver as well
        friend_req = request.data
        inbox = Inbox.objects.get(author=receiver)
        inbox.items.append(friend_req)
        inbox.save()

        return Response(status=status.HTTP_201_CREATED)

    def destroy(self, request, receiver, sender):
        try:
            author = Author.objects.get(id=receiver)
            follow = Follow.objects.get(receiver=author, sender__id=sender)

            follow.delete()
        
        except (Author.DoesNotExist, Follow.DoesNotExist):
            return Response(status=status.HTTP_404_NOT_FOUND)
            
        return Response(status=status.HTTP_204_NO_CONTENT)


class FollowingListViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows for listing the following of an author.
    """
    def list(self, request, sender):
        try:
            author = Author.objects.get(id=sender)
            queryset = Following.objects.filter(sender=author)

            serializer = FollowingSerializer(queryset, many=True)

        except Author.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        return Response({
            'type': 'following',
            'items': serializer.data
        })


class FollowingViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows removing, adding, and checking other authors an author is following.
    """
    authentication_classes = [BasicAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = Following.objects.all()
    serializer_class = FollowingSerializer

    def retrieve(self, request, sender, receiver):
        try:
            author = Author.objects.get(id=sender)
            following = Following.objects.get(sender=author, receiver__id=receiver)

            serializer = FollowingSerializer(following)

        except (Author.DoesNotExist, Following.DoesNotExist):
            return Response(status=status.HTTP_404_NOT_FOUND)

        return Response(serializer.data)


    def create(self, request, sender, receiver):
        try:
            author = Author.objects.get(id=sender)
            Following.objects.create(sender=author, receiver=request.data)
        except Author.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        return Response(status=status.HTTP_201_CREATED)

    def destroy(self, request, sender, receiver):
        try:
            author = Author.objects.get(id=sender)
            following = Following.objects.get(sender=author, receiver__id=receiver)

            following.delete()

        except (Author.DoesNotExist, Following.DoesNotExist):
            return Response(status=status.HTTP_404_NOT_FOUND)

        return Response(status=status.HTTP_204_NO_CONTENT)


class LikesPostViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows getting likes for a given post.
    """
    queryset = Like.objects.all()
    serializer_class = LikeSerializer

    # TODO: Author is currently being ignored. Do we need to use it?
    def retrieve(self, request, author, post):
        likes = Like.objects.filter(object__contains=post)
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
        likes = Like.objects.filter(object__contains=comment)
        serializer = LikeSerializer(likes, many=True)

        return Response({
            'type': 'likes',
            'items': serializer.data
        })


class LikedViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows getting a list of public things author_id liked
    """
    queryset = Like.objects.all()
    serializer_class = LikeSerializer

    def retrieve(self, request, author):
        liked = Like.objects.filter(author__id=author)
        serializer = LikeSerializer(liked, many=True)

        return Response({
            'type': 'liked',
            'items': serializer.data
        })

class InboxViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows getting inbox items for an author
    """
    authentication_classes = [BasicAuthentication]
    permission_classes = [IsAuthenticatedOrGet]
    queryset = Inbox.objects.all()
    serializer_class = InboxSerializer
    lookup_field = 'author'

    def retrieve(self, request, author):
        try:
            author = Author.objects.get(id=author)
            inbox = Inbox.objects.get(author=author)
        except (Author.DoesNotExist, Inbox.DoesNotExist):
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = InboxSerializer(inbox)
        return Response(serializer.data)
        
    def update(self, request, author):
        try:
            author = Author.objects.get(id=author)
            inbox = Inbox.objects.get(author=author)
        except (Author.DoesNotExist, Inbox.DoesNotExist):
            return Response(status=status.HTTP_404_NOT_FOUND)

        # Save likes into our database, so that clearing the inbox keeps them safe.
        if 'type' in request.data and request.data['type'] == 'like':
            # Create the Like model without the type field (or else Django complains)
            like = request.data.copy()
            del like['type']
            Like.objects.create(**like)

        inbox.items.append(request.data)
        inbox.save()

        return Response(status=status.HTTP_204_NO_CONTENT)

    def destroy(self, request, author):
        try:
            author = Author.objects.get(id=author)
            inbox = Inbox.objects.get(author=author)
        except (Author.DoesNotExist, Inbox.DoesNotExist):
            return Response(status=status.HTTP_404_NOT_FOUND)

        inbox = Inbox.objects.get(author=author)
        inbox.items.clear()
        inbox.save()    

        return Response(status=status.HTTP_204_NO_CONTENT)


