import datetime

def get_test_author_fields(i=1):
  return {
    'displayName': f'John Doe {i}',
    'url': f'testUrl{i}',
    'github': f'testGithub{i}'
  }

def get_test_follow_fields():
  return {
    'receiver': 'receiverUrl',
    'sender': 'senderUrl',
    'approved': False
  }

def get_test_like_fields(object_id=1, author_id='testAuthorId'):
  return {
    'context': 'testContext',
    'summary': 'Someone likes your object',
    'author': author_id,
    'object': object_id,
  }

def get_test_comment_fields(i=1):
  return {
    'author': f'testcommenter{i}',
    'comment': 'i am a comment',
    'contentType': 'text/plain',
  }

def get_test_post_fields(i=1, author="testauthorid", visibility="Public"):
  return {
    'title': f'testpost{i}',
    'description': f'i am test post {i}',
    'source': f'source post id{i}',
    'origin': f'origin post id{i}',
    'visibility': visibility,
    'unlisted': True,
    'author': author,
    'contentType': 'text/plain',
    'content': 'Hello, I am a test post',
    'categories': '["Testing"]',
    'commentLink': 'link to comments'
  }

def get_test_partial_post_fields(i=1, author="testauthorid"):
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
