
from django.db import models
from django.conf import settings


class Subscription(models.Model):

    PLAN_CHOICES = [
        ('free', 'Free'),
        ('premium', 'Premium'),
    ]

    STATUS_CHOICES = [
        ('active', 'Active'),
        ('expired', 'Expired'),
        ('cancelled', 'Cancelled'),
    ]

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='subscription'
    )

    plan = models.CharField(
        max_length=20,
        choices=PLAN_CHOICES,
        default='free'
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='active'
    )

    start_date = models.DateTimeField(auto_now_add=True)
    end_date = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.user.username} - {self.plan}"

class Usage(models.Model):

    subscription = models.ForeignKey(
        Subscription,
        on_delete=models.CASCADE,
        related_name='usages'
    )

    date = models.DateField(auto_now_add=True)

    generation_count = models.PositiveIntegerField(default=0)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['subscription', 'date'],
                name='unique_subscription_daily_usage'
            )
        ]

    def __str__(self):
        return f"{self.subscription.user.username} - {self.date}"
