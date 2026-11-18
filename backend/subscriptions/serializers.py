
from rest_framework import serializers
from .models import Subscription, Usage


class SubscriptionSerializer(serializers.ModelSerializer):

    class Meta:
        model = Subscription
        fields = [
            'id',
            'plan',
            'status',
            'start_date',
            'end_date',
        ]

        read_only_fields = [
            'id',
            'status',
            'start_date',
            'end_date',
        ]


class UsageSerializer(serializers.ModelSerializer):

    class Meta:
        model = Usage
        fields = [
            'date',
            'generation_count',
        ]
