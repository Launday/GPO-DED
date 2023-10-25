from django.views.generic.base import TemplateView
# from rest_framework.views import APIView
from rest_framework.decorators import api_view
from django.http import JsonResponse
from rest_framework.response import Response
from markers.models import Marker
from .serializers import MarkerSerializer
import json
from django.contrib.gis.geos import Point
import folium
from django.shortcuts import render,redirect
from . import getroute
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


def showmap(request):
    return render(request,'showmap.html')

@api_view(['GET'])
def showroute(request,lat1,long1,lat2,long2):
    figure = folium.Figure()
    lat1,long1,lat2,long2=float(lat1),float(long1),float(lat2),float(long2)
    route=getroute.get_route(long1,lat1,long2,lat2)
    m = folium.Map(location=[(route['start_point'][0]),
                                 (route['start_point'][1])], 
                       zoom_start=10)
    m.add_to(figure)
    folium.PolyLine(route['route'],weight=8,color='blue',opacity=0.6).add_to(m)
    folium.Marker(location=route['start_point'],icon=folium.Icon(icon='play', color='green')).add_to(m)
    folium.Marker(location=route['end_point'],icon=folium.Icon(icon='stop', color='red')).add_to(m)
    figure.render()
    context={'map':figure}
    return JsonResponse(route)