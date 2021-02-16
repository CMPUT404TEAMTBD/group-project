from django.urls import include, path
from django.contrib import admin
from rest_framework import routers
from quickstart import views

router = routers.DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'groups', views.GroupViewSet)
router.register(r'authors', views.AuthorViewSet)
router.register(r'posts', views.PostViewSet)
router.register(r'followers', views.FollowersViewSet)
# router.register(r'likes', views.LikesPostViewSet)

# Manually bind viewsets instead of using the router so that we can use POST for updates.
# Also allows us to be more flexible with our URL endpoints.
# Referenced Lucas Weyne's code at https://stackoverflow.com/a/53991768

# api/author/<str:_id>/
author = views.AuthorViewSet.as_view({
    'get': 'retrieve',
    'post': 'update',
    # TODO: remove put: create once we no longer need a dev shortcut to create authors, 
    # because user creation should be handled with the built in User model. 
    'put': 'create'
})

posts = views.PostViewSet.as_view({
    'get': 'retrieve',
    'post': 'update',
    'delete': 'destroy',
    'put': 'create'
})

posts_list = views.PostListViewSet.as_view({
    'get': 'list'
})

comments = views.CommentViewSet.as_view({
    'get': 'list',
    'post': 'create'
})

followers_list = views.FollowersListViewSet.as_view({
    'get': 'list'
})

followers = views.FollowersViewSet.as_view({
    'delete': 'destroy',
    'put': 'create',
    'get': 'retrieve'
})

likes_post = views.LikesPostViewSet.as_view({
    'get': 'list'
})

likes_comment = views.LikesCommentViewSet.as_view({
    'get': 'list'
})


# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.
urlpatterns = [
    path('api/', include(router.urls)),
    path('api/rest-auth/', include('rest_auth.urls')),
    path('api/rest-auth/registration/', include('rest_auth.registration.urls')),
    path('api/admin/', admin.site.urls),
    path('api/author/<str:_id>/', author, name='author'),
    path('api/author/<str:author>/posts/', posts_list, name='posts-list'),
    path('api/author/<str:author>/posts/<str:_id>/', posts, name='posts'),
    path('api/author/<str:receiver>/followers/', followers_list, name='followers-list'),
    path('api/author/<str:receiver>/followers/<str:sender>/', followers, name='followers'),
    path('api/author/<str:author>/posts/<str:post>/comments/', comments, name='comments'),
    path('api/author/<str:author>/posts/<str:post>/likes/', likes_post, name='likes-post'),
    path('api/author/<str:author>/posts/<str:post>/comments/<str:comment>/likes', likes_comment, name='likes-comment')
]
