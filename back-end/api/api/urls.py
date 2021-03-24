"""
urls.py defines all the endpoints of our API service, as defined in the project requirements spec.
It also contains some extra endpoints for our own front-end client to use.
"""
from django.urls import include, path
from django.contrib import admin
from rest_framework import routers
from quickstart import views

# Debug site/endpoints that DRF helps us implement.
router = routers.DefaultRouter()
router.register(r'posts', views.PostViewSet)
router.register(r'comments', views.CommentViewSet)
router.register(r'followers', views.FollowersViewSet)
router.register(r'following', views.FollowingViewSet)
router.register(r'liked', views.LikedViewSet)
router.register(r'inbox', views.InboxViewSet)

# Referenced Lucas Weyne's code at https://stackoverflow.com/a/53991768 for the below ViewSets.
# For our endpoints below that return a list of objects it is more proper to use 'get': 'list', 
# but using retrieve  allows DRF to use the ViewSets' list method for the debug endpoints above. 

# Endpoint: /api/author/{AUTHOR_ID}/
# GET: retrieve their profile
# POST: update profile
author = views.AuthorViewSet.as_view({
    'get': 'retrieve',
    'post': 'partial_update',
})

# Endpoint: /api/authors/
# GET: retrieve a list of all authors. Custom endpoint used for searching authors.
authors = views.AuthorsViewSet.as_view({
    'get': 'list'
})

# Custom endpoint for retrieving an Author object from a Django User object.
auth_user = views.AuthUserViewSet.as_view({
    'get': 'retrieve'
})

nodes = views.NodesViewSet.as_view({
    'get': 'list'
})

# Endpoint: /api/author/{AUTHOR_ID}/posts/{POST_ID}
# GET get the public post
# POST update the post (must be authenticated)
# DELETE remove the post
# PUT create a post with that post_id
posts = views.PostViewSet.as_view({
    'get': 'retrieve',
    'post': 'partial_update',
    'delete': 'destroy',
    'put': 'create'
})

# Custom endpoint for retrieving all posts marked as public.
public_posts_list = views.PublicPostListViewSet.as_view({
    'get': 'list'
})

# Endpoint: /api/author/{AUTHOR_ID}/posts/
# GET get recent posts of author (paginated)
# POST create a new post but generate a post_id
posts_list = views.PostListViewSet.as_view({
    'get': 'list',
    'post': 'create'
})

# Endpoint: /api/author/{AUTHOR_ID}/posts/{POST_ID}/comments
# GET get comments of the post
# POST if you post an object of “type”:”comment”, it will add your comment to the post
comments = views.CommentViewSet.as_view({
    'get': 'retrieve',
    'post': 'create'
})

# Endpoint: /api/author/{AUTHOR_ID}/followers
# GET: get a list of authors who are their followers
followers_list = views.FollowersListViewSet.as_view({
    'get': 'list'
})

# Endpoint: /api/author/{AUTHOR_ID}/followers/{FOREIGN_AUTHOR_ID}
# DELETE: remove a follower
# PUT: Add a follower (must be authenticated)
# GET check if follower
followers = views.FollowersViewSet.as_view({
    'delete': 'destroy',
    'put': 'create',
    'get': 'retrieve'
})

# Endpoint: /api/author/{AUTHOR_ID}/following
# GET: get a list of authors who they are following
following_list = views.FollowingListViewSet.as_view({
    'get': 'list'
})

# Endpoint: /api/author/{AUTHOR_ID}/following/{FOREIGN_AUTHOR_ID}
# DELETE: remove a following
# PUT: Add a following (must be authenticated)
# GET check if following
following = views.FollowingViewSet.as_view({
    'delete': 'destroy',
    'put': 'create',
    'get': 'retrieve'
})

# Endpoint: /api/author/{AUTHOR_ID}/post/{POST_ID}/likes
# GET a list of likes from other authors on AUTHOR_ID's post POST_ID
likes_post = views.LikesPostViewSet.as_view({
    'get': 'retrieve'
})

# Endpoint: /api/author/{AUTHOR_ID}/post/{POST_ID}/comments/{COMMENT_ID}/likes
# GET a list of likes from other authors on author_id’s post post_id comment comment_id
likes_comment = views.LikesCommentViewSet.as_view({
    'get': 'retrieve'
})

# Endpoint: /api/author/{AUTHOR_ID}/liked
# GET list what public things AUTHOR_ID liked
liked = views.LikedViewSet.as_view({
    'get': 'retrieve'
})

# Endpoint: /api/author/{AUTHOR_ID}/inbox
# GET: if authenticated get a list of posts sent to {AUTHOR_ID}
# POST: send a post/follow/like to the author's inbox
# DELETE: clear the inbox
inbox = views.InboxViewSet.as_view({
    'get': 'retrieve',
    'post': 'update',
    'delete': 'destroy'
})

# Define all our endpoint paths.
urlpatterns = [
    # Path used for debugging endpoints
    path('api/', include(router.urls)),
    # Paths used for registration
    path('api/rest-auth/', include('rest_auth.urls')),
    path('api/rest-auth/registration/', include('rest_auth.registration.urls')),
    # Path for the admin site
    path('api/admin/', admin.site.urls),
    # Paths for all our API endpoints
    path('api/author/<str:id>/', author, name='author'),
    path('api/authors/', authors, name='authors'),
    path('api/public-posts/', public_posts_list, name='public-posts-list'),
    path('api/auth-user/<str:username>/', auth_user, name='auth-user'),
    path('api/nodes/', nodes, name='nodes'),
    path('api/author/<str:author>/posts/', posts_list, name='posts-list'),
    path('api/author/<str:author>/posts/<str:id>/', posts, name='posts'),
    path('api/author/<str:receiver>/followers/', followers_list, name='followers-list'),
    path('api/author/<str:receiver>/followers/<str:sender>/', followers, name='followers'),
    path('api/author/<str:sender>/following/', following_list, name='following-list'),
    path('api/author/<str:sender>/following/<str:receiver>/', following, name='following'),
    path('api/author/<str:author>/posts/<str:post>/comments/', comments, name='comments'),
    path('api/author/<str:author>/posts/<str:post>/likes/', likes_post, name='likes-post'),
    path('api/author/<str:author>/posts/<str:post>/comments/<str:comment>/likes', likes_comment, name='likes-comment'),
    path('api/author/<str:author>/liked/', liked, name='liked'),
    path('api/author/<str:author>/inbox/', inbox, name='inbox')
]
