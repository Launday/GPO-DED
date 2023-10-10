# from django.urls import path
# from .views import MarkerListAPIView
from .views import MarkersMapView
from django.urls import path
from . import views
app_name = "markers"


urlpatterns = [
    path('', views.getRoutes, name="routes"),
    path('markers/', views.getMarkers, name="markers"),
    path('create/', views.createMarkers, name="create-marker"),
    path("map/", MarkersMapView.as_view(), name="map"),

]
