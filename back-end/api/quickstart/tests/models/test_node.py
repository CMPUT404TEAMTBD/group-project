from django.test import TestCase
from quickstart.models import Node
from types import SimpleNamespace
from quickstart.tests.helper_test import get_test_node_fields

class CreateNode(TestCase):
  """Tests for creating a Node."""
  def setUp(self): 
    self.fields = SimpleNamespace(**get_test_node_fields())
    self.node = Node.objects.create(**vars(self.fields))

  def test_create_node(self):
    self.assertEqual(self.node.host, self.fields.host)
    self.assertEqual(self.node.username, self.fields.username)
    self.assertEqual(self.node.password, self.fields.password)