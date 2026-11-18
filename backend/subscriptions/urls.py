
from django.urls import path
from .views import (
    SubscriptionView,
    UsageView,
    UpgradeSubscriptionView,
)

urlpatterns = [
    path(
        'my-subscription/',
        SubscriptionView.as_view(),
        name='my-subscription'
    ),
    path(
        'usage/',
        UsageView.as_view(),
        name='usage'
    ),
    path(
        'upgrade/',
        UpgradeSubscriptionView.as_view(),
        name='upgrade-subscription'
    ),
]
