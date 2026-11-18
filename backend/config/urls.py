
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),

    path('api/auth/', include('users.urls')),

    path('api/ai/', include('ai_generator.urls')),

    path('api/subscriptions/', include('subscriptions.urls')),

    path('api/analytics/', include('analytics.urls')),
]
