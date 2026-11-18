
from rest_framework import serializers
from .models import GeneratedContent


class GeneratedContentSerializer(serializers.ModelSerializer):

    class Meta:
        model = GeneratedContent
        fields = [
            'id',
            'topic',
            'content_type',
            'tone',
            'length',
            'generated_text',
            'created_at',
        ]

        read_only_fields = [
            'id',
            'generated_text',
            'created_at',
        ]

    def validate_topic(self, value):
        value = value.strip()

        if not value:
            raise serializers.ValidationError(
                "Topic cannot be empty."
            )

        if len(value) < 3:
            raise serializers.ValidationError(
                "Topic must contain at least 3 characters."
            )

        if len(value) > 255:
            raise serializers.ValidationError(
                "Topic cannot exceed 255 characters."
            )

        return value

    def validate_content_type(self, value):
        valid_choices = dict(
            GeneratedContent.CONTENT_TYPES
        )

        if value not in valid_choices:
            raise serializers.ValidationError(
                "Please select a valid content type."
            )

        return value

    def validate_tone(self, value):
        valid_choices = dict(
            GeneratedContent.TONES
        )

        if value not in valid_choices:
            raise serializers.ValidationError(
                "Please select a valid tone."
            )

        return value

    def validate_length(self, value):
        valid_choices = dict(
            GeneratedContent.LENGTHS
        )

        if value not in valid_choices:
            raise serializers.ValidationError(
                "Please select a valid content length."
            )

        return value
