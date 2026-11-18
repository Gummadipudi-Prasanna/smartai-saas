
from django.db import models
from django.conf import settings


class GeneratedContent(models.Model):

    CONTENT_TYPES = [
        ('blog', 'Blog'),
        ('product_description', 'Product Description'),
        ('social_media', 'Social Media Post'),
        ('seo_description', 'SEO Description'),
    ]

    TONES = [
        ('professional', 'Professional'),
        ('friendly', 'Friendly'),
        ('creative', 'Creative'),
    ]

    LENGTHS = [
        ('short', 'Short'),
        ('medium', 'Medium'),
        ('long', 'Long'),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='generated_contents'
    )

    topic = models.CharField(max_length=255)
    content_type = models.CharField(max_length=50, choices=CONTENT_TYPES)
    tone = models.CharField(max_length=20, choices=TONES)
    length = models.CharField(max_length=20, choices=LENGTHS)
    generated_text = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.topic
