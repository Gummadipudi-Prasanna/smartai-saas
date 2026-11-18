
def generate_content(topic, content_type, tone, length):

    content_type_names = {
        'blog': 'Blog',
        'product_description': 'Product Description',
        'social_media': 'Social Media Post',
        'seo_description': 'SEO Description',
    }

    tone_names = {
        'professional': 'Professional',
        'friendly': 'Friendly',
        'creative': 'Creative',
    }

    length_names = {
        'short': 'Short',
        'medium': 'Medium',
        'long': 'Long',
    }

    selected_type = content_type_names.get(content_type, 'Content')
    selected_tone = tone_names.get(tone, 'Professional')
    selected_length = length_names.get(length, 'Medium')

    return f"""# {topic}

## Introduction

Welcome to this {selected_type} about {topic}.

This content provides useful information and important
points to help readers understand the topic.

## Key Highlights

1. Understanding {topic}
2. Important features and benefits
3. Key points to remember
4. Useful tips and recommendations

## Conclusion

In conclusion, {topic} is an interesting and useful topic.
We hope this content helps readers gain a better understanding.

---
Content Type: {selected_type}
Tone: {selected_tone}
Length: {selected_length}

Generated using SmartAI SaaS Mock Generator.
"""
