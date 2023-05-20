from django.views.generic.base import TemplateView
from rest_framework.views import APIView
from rest_framework.response import Response
from markers.models import Marker
from .serializers import MarkerSerializer


class MarkerListAPIView(APIView):
    def get(self, request):
        markers = Marker.objects.all()
        serializer = MarkerSerializer(markers, many=True)
        print(serializer.data)
        return Response(serializer.data)


class MarkersMapView(TemplateView):
    template_name = "map.html"
