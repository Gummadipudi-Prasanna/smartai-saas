
import logging

from django.db import transaction
from django.utils import timezone

from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import ValidationError, APIException

from .models import GeneratedContent
from .serializers import GeneratedContentSerializer
from .services import generate_content

from subscriptions.models import Subscription, Usage


logger = logging.getLogger(__name__)


def get_daily_limit(plan):
    limits = {
        'free': 5,
        'premium': 50,
    }
    return limits.get(plan, 5)


def generate_safe_content(topic, content_type, tone, length):
    try:
        return generate_content(
            topic=topic,
            content_type=content_type,
            tone=tone,
            length=length
        )
    except Exception:
        logger.exception("Content generation failed.")
        raise APIException(
            "Content generation failed. Please try again later."
        )


class GeneratedContentListCreateView(generics.ListCreateAPIView):

    serializer_class = GeneratedContentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return GeneratedContent.objects.filter(
            user=self.request.user
        )

    @transaction.atomic
    def perform_create(self, serializer):

        subscription, created = Subscription.objects.get_or_create(
            user=self.request.user,
            defaults={'plan': 'free'}
        )

        usage, created = Usage.objects.get_or_create(
            subscription=subscription,
            date=timezone.localdate()
        )

        daily_limit = get_daily_limit(subscription.plan)

        if usage.generation_count >= daily_limit:
            raise ValidationError({
                'error': (
                    f'Daily generation limit reached. '
                    f'Your {subscription.plan} plan allows '
                    f'{daily_limit} generations per day.'
                )
            })

        data = serializer.validated_data

        generated_text = generate_safe_content(
            topic=data['topic'],
            content_type=data['content_type'],
            tone=data['tone'],
            length=data['length']
        )

        serializer.save(
            user=self.request.user,
            generated_text=generated_text
        )

        usage.generation_count += 1
        usage.save(update_fields=['generation_count'])


class GeneratedContentDetailView(generics.RetrieveUpdateDestroyAPIView):

    serializer_class = GeneratedContentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return GeneratedContent.objects.filter(
            user=self.request.user
        )

    @transaction.atomic
    def perform_update(self, serializer):

        subscription, created = Subscription.objects.get_or_create(
            user=self.request.user,
            defaults={'plan': 'free'}
        )

        usage, created = Usage.objects.get_or_create(
            subscription=subscription,
            date=timezone.localdate()
        )

        daily_limit = get_daily_limit(subscription.plan)

        if usage.generation_count >= daily_limit:
            raise ValidationError({
                'error': (
                    f'Daily generation limit reached. '
                    f'Your {subscription.plan} plan allows '
                    f'{daily_limit} generations per day. '
                    f'You cannot edit and regenerate content now.'
                )
            })

        data = serializer.validated_data
        instance = serializer.instance

        topic = data.get('topic', instance.topic)
        content_type = data.get('content_type', instance.content_type)
        tone = data.get('tone', instance.tone)
        length = data.get('length', instance.length)

        generated_text = generate_safe_content(
            topic=topic,
            content_type=content_type,
            tone=tone,
            length=length
        )

        serializer.save(
            generated_text=generated_text
        )

        usage.generation_count += 1
        usage.save(update_fields=['generation_count'])
