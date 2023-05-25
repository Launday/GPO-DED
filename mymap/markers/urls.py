# from django.urls import path
# from .views import MarkerListAPIView
from .views import MarkersMapView
from django.urls import path
from . import views
app_name = "markers"

# urlpatterns = [
#     path('api/markers/', MarkerListAPIView.as_view(), name='marker-list'),
#     path("map/", MarkersMapView.as_view()),
# ]


urlpatterns = [
    path('', views.getRoutes, name="routes"),
    path('markers/', views.getMarkers, name="markers"),
    path('create/', views.createMarkers, name="create-marker"),
    path("map/", MarkersMapView.as_view(), name="map"),
    # path('notes/<str:pk>/update/', views.updateNote, name="update-note"),
    # path('notes/<str:pk>/delete/', views.deleteNote, name="delete-note"),

    # path('notes/<str:pk>/', views.getMarkers, name="note"),
]
