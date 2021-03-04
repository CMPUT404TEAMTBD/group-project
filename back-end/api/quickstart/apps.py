"""
apps.py is Django boilerplate, but we also hook in our signals.py file 
here so we can listen for important events (e.g, user registration).
"""
from django.apps import AppConfig

class QuickstartConfig(AppConfig):
    name = 'quickstart'

    def ready(self):
        import quickstart.signals