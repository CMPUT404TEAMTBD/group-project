"""
admin.py registers models so that they can be created/modified/deleted from the admin page.
"""
from django.contrib import admin

from .models import Author, Post, Follow, Comment, Like, Inbox

admin.site.register(Author)
admin.site.register(Post)
admin.site.register(Comment)
admin.site.register(Follow)
admin.site.register(Like)
admin.site.register(Inbox)
