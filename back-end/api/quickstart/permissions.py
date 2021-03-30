from rest_framework.permissions import IsAuthenticated

class IsAuthenticatedOrGet(IsAuthenticated):
  def has_permission(self, request, view):
    if request.method == 'GET':
        return True
    return super(IsAuthenticatedOrGet, self).has_permission(request, view)