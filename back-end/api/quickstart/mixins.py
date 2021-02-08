from django.shortcuts import get_object_or_404

class MultipleFieldLookupMixin(object):
  """
  Apply this mixin to any view or viewset to get multiple field filtering
  based on a `lookup_fields` attribute, instead of the default single field filtering.
  Code was taken from DRF docs: https://www.django-rest-framework.org/api-guide/generic-views/
  """
  def get_object(self):
    queryset = self.get_queryset()  # Get the base queryset
    queryset = self.filter_queryset(queryset)
    filter = {}
    for field in self.lookup_fields:
        if self.kwargs[field]:  # Ignore empty fields.
            filter[field] = self.kwargs[field]
    return get_object_or_404(queryset, **filter)  # Lookup the object