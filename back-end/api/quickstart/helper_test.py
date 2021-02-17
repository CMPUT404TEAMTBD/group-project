import datetime

def get_test_author_fields():
  return {
    '_id': 'testId',
    'displayName': 'John Doe',
    'url': 'testUrl',
    'github': 'testGithub'
  }

def get_test_follow_fields():
  return {
    'receiver': 'receiverUrl',
    'sender': 'senderUrl',
    'approved': False
  }

def get_test_like_post_fields(post_id=1):
  return {
    'context': 'testContext',
    'summary': 'Someone likes your post',
    'author': 'testAuthorUrl',
    '_object': f'{post_id}',
  }

def get_test_like_comment_fields(comment_id=1):
  return {
    'context': 'testContext',
    'summary': 'Someone likes your comment',
    'author': 'testAuthorUrl',
    '_object': f'{comment_id}',
  }

def get_test_comment_fields(i=1, postid="testpostid"):
  return {
    '_id': f'testid{i}',
    'postId': postid,
    'author': f'testcommenter{i}',
    'comment': 'i am a comment',
    'contentType': 'text/plain',
    'published': '03:25:53.827044',
  }

def get_test_post_fields(i=1, author="testauthorid"):
  return {
    '_id': i,
    'title': f'testpost{i}',
    'description': f'i am test post {i}',
    'source': f'source post id{i}',
    'origin': f'origin post id{i}',
    'visibility': 'Public',
    'unlisted': True,
    'isPrivateToFriends': True,
    'author': author,
    'contentType': 'text/plain',
    'content': 'Hello, I am a test post',
    'categories': '["Testing"]',
    'published': '03:25:53.827044',
    'count': 5,
    'pageSize': 20,
    'commentLink': 'link to comments',
    'comments': '{ "text": "nice test" }'
  }