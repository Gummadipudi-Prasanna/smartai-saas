
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from django.db.models import Count
from django.utils import timezone

from ai_generator.models import GeneratedContent


class AnalyticsView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        user = request.user

        # Get user's generated contents
        contents = GeneratedContent.objects.filter(user=user)

        # Total generations
        total_generations = contents.count()

        # Today's generations
        today = timezone.localdate()

        today_generations = contents.filter(
            created_at__date=today
        ).count()

        # Content type breakdown
        content_breakdown = contents.values(
            'content_type'
        ).annotate(
            count=Count('id')
        )

        return Response({
            'total_generations': total_generations,
            'today_generations': today_generations,
            'content_type_breakdown': list(content_breakdown)
        })
