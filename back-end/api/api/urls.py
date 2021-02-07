from django.urls import include, path
from django.contrib import admin
from rest_framework import routers
from quickstart import views

router = routers.DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'groups', views.GroupViewSet)

author = views.AuthorViewSet.as_view({
    'get': 'retrieve',
    'post': 'update',
    'put': 'create'
})

posts = views.PostViewSet.as_view({
    'get': 'retrieve',
    'post': 'update',
    'delete': 'destroy',
    'put': 'create'
})

# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.
urlpatterns = [
    path('', include(router.urls)),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    path('admin/', admin.site.urls),
    path('author/<str:_id>/', author, name='author'),
    path('author/<str:author>/posts/<str:_id>/', posts, name='posts')
]