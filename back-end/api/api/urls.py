from django.urls import include, path
from django.contrib import admin
from rest_framework import routers
from quickstart import views

router = routers.DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'groups', views.GroupViewSet)

# Manually bind viewsets instead of using the router so that we can use POST for updates.
# Also allows us to be more flexible with our URL endpoints.
# Referenced Lucas Weyne's code at https://stackoverflow.com/a/53991768
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

comments = views.CommentViewSet.as_view({
    'get': 'list',
    'post': 'create'
})

# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.
urlpatterns = [
    path('', include(router.urls)),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    path('admin/', admin.site.urls),
    path('author/<str:_id>/', author, name='author'),
    path('author/<str:author>/posts/<str:_id>/', posts, name='posts'),
    path('author/<str:author>/posts/<str:posts>/comments/', comments, name='comments')
]