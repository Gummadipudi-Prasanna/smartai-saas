
from django.urls import path

from .views import RegisterView, ProfileView

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)


urlpatterns = [

    # User Registration API
    path('register/', RegisterView.as_view(), name='register'),

    # User Login API
    path('login/', TokenObtainPairView.as_view(), name='login'),

    # Refresh Access Token API
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # User Profile API
    path('profile/', ProfileView.as_view(), name='profile'),

]
