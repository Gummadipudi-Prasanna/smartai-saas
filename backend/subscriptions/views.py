
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone

from .models import Subscription, Usage
from .serializers import SubscriptionSerializer, UsageSerializer


class SubscriptionView(generics.RetrieveAPIView):

    serializer_class = SubscriptionSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        subscription, created = Subscription.objects.get_or_create(
            user=self.request.user,
            defaults={'plan': 'free'}
        )

        return subscription


class UsageView(generics.GenericAPIView):

    permission_classes = [IsAuthenticated]
    serializer_class = UsageSerializer

    def get(self, request):

        subscription, created = Subscription.objects.get_or_create(
            user=request.user,
            defaults={'plan': 'free'}
        )

        usage, created = Usage.objects.get_or_create(
            subscription=subscription,
            date=timezone.localdate()
        )

        limit = 5 if subscription.plan == 'free' else 50

        remaining = max(0, limit - usage.generation_count)

        return Response({
            'plan': subscription.plan,
            'date': usage.date,
            'generation_count': usage.generation_count,
            'daily_limit': limit,
            'remaining': remaining
        })


class UpgradeSubscriptionView(generics.GenericAPIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        subscription, created = Subscription.objects.get_or_create(
            user=request.user,
            defaults={'plan': 'free'}
        )

        if subscription.plan == 'premium' and subscription.status == 'active':
            return Response({
                'success': True,
                'message': 'You already have an active Premium plan.',
                'plan': subscription.plan
            })

        # Development/demo activation only.
        # Replace with verified payment confirmation before production.
        subscription.plan = 'premium'
        subscription.status = 'active'
        subscription.start_date = timezone.now()
        subscription.end_date = None
        subscription.save()

        return Response({
            'success': True,
            'message': 'Premium plan activated successfully.',
            'plan': subscription.plan,
            'daily_limit': 50
        }, status=status.HTTP_200_OK)
