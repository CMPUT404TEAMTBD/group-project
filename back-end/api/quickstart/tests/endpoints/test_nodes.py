from rest_framework import status
from django.test import TestCase, Client
from quickstart.models import Node
from quickstart.serializers import NodeSerializer
from quickstart.tests.helper_test import get_test_node_fields

client = Client()

class GetNodes(TestCase):
  """Tests for getting all Nodes at endpoint /api/nodes/."""

  def test_get_nodes(self):
    for i in range(3):
      Node.objects.create(**get_test_node_fields(host=f'coolbears{i}.ca'))

    response = client.get(f'/api/nodes/')
    nodes = Node.objects.all()
    serializer = NodeSerializer(nodes, many=True)

    self.assertEqual(response.status_code, status.HTTP_200_OK)
    self.assertEqual(response.data, serializer.data)

  def test_get_nodes_empty(self):
    response = client.get(f'/api/nodes/')

    self.assertEqual(response.status_code, status.HTTP_200_OK)
    self.assertEqual(len(response.data), 0)