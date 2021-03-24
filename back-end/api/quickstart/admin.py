"""
admin.py registers models so that they can be created/modified/deleted from the admin page.
"""
from django.contrib import admin

from .models import Author, Post, Follow, Following, Comment, Like, Inbox, Node

admin.site.register(Author)
admin.site.register(Post)
admin.site.register(Comment)
admin.site.register(Follow)
admin.site.register(Following)
admin.site.register(Like)
admin.site.register(Inbox)
admin.site.register(Node)