from django.urls import path
from .views import MarkerListAPIView
from .views import MarkersMapView

app_name = "markers"

urlpatterns = [
    path('api/markers/', MarkerListAPIView.as_view(), name='marker-list'),
    path("map/", MarkersMapView.as_view()),
]
