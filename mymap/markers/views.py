from django.views.generic.base import TemplateView
# from rest_framework.views import APIView
from rest_framework.decorators import api_view

from rest_framework.response import Response
from markers.models import Marker
from .serializers import MarkerSerializer
import json
from django.contrib.gis.geos import Point


@api_view(['GET'])
def getRoutes(request):
    routes = [
        {
            'Endpoint': '/markers/',
            'method': 'GET',
            'body': None,
            'description': 'Returns an array of markers'
        },
        {
            'Endpoint': '/create/',
            'method': 'POST',
            'body': {'name': "", 'location': ""},
            'description': 'Creates new marker with data sent in post request'
        },
        # {
        #     'Endpoint': '/notes/id/update/',
        #     'method': 'PUT',
        #     'body': {'body': ""},
        #     'description': 'Creates an existing note with data sent in post request'
        # },
        # {
        #     'Endpoint': '/notes/id/delete/',
        #     'method': 'DELETE',
        #     'body': None,
        #     'description': 'Deletes and exiting note'
        # },
    ]
    return Response(routes)


@api_view(['GET'])
def getMarkers(request):
    marker = Marker.objects.all()
    serializer = MarkerSerializer(marker, many=True)
    return Response(serializer.data)


@api_view(['POST'])
def createMarkers(request):
    data = request.data

    print(data)
    marker = Marker.objects.create(
        name=data['properties']['name'],
        location=Point(data['geometry']['coordinates'][0],
                       data['geometry']['coordinates'][1])
    )
    serializer = MarkerSerializer(marker, many=False)
    return Response(serializer.data)


class MarkersMapView(TemplateView):
    template_name = "map.html"
