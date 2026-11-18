
from django.urls import path

from .views import (
    GeneratedContentListCreateView,
    GeneratedContentDetailView,
)

urlpatterns = [
    path(
        'generate/',
        GeneratedContentListCreateView.as_view(),
        name='generate-content'
    ),

    path(
        'generate/<int:pk>/',
        GeneratedContentDetailView.as_view(),
        name='content-detail'
    ),
]
