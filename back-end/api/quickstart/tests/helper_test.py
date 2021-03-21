import datetime

def get_test_author_fields(i=1):
  return {
    'displayName': f'John Doe {i}',
    'url': f'testUrl{i}',
    'github': f'testGithub{i}',
    'host': 'testHost'
  }

def get_sender_fields(i=1):
  return {
    'id': f'testid{i}',
    'displayName': f'John Doe {i}',
    'url': f'testUrl{i}',
    'github': f'testGithub{i}',
    'host': 'testHost'
  }

def get_test_like_fields(
  object_id=1, 
  author={
    'id': 'testId',
    'displayName': 'John Doe',
    'url': 'testUrl',
    'github': 'testGithub',
    'host': 'testHost'
  }
):
  return {
    'author': author,
    'object': f'{object_id}',
  }

def get_test_comment_fields(i=1):
  return {
    'author': f'testcommenter{i}',
    'comment': 'i am a comment',
    'contentType': 'text/plain',
  }

def get_test_post_fields(i=1, visibility="Public", unlisted=False):
  return {
    'title': f'testpost{i}',
    'description': f'i am test post {i}',
    'source': f'source post id{i}',
    'origin': f'origin post id{i}',
    'visibility': visibility,
    'unlisted': unlisted,
    'contentType': 'text/plain',
    'content': 'Hello, I am a test post',
    'categories': '["Testing"]',
    'commentLink': 'link to comments'
  }

def get_test_partial_post_fields(i=1):
    return {
    'title': f'testpost{i}',
    'description': f'i am test post {i}',
    'visibility': "Public",
    'unlisted': True,
    'contentType': 'text/plain',
    'content': 'Hello, I am a test post',
    'categories': '["Testing"]',
    'commentLink': 'link to comments'
  }

def get_test_inbox_fields():
  return {
    'author': 'testAuthor',
    'items': '[{"type":"post"}, {"type":"comment"}]'
  }