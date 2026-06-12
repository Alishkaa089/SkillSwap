from django.db import models
from django.contrib.auth.models import User
from django.utils.text import slugify


class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    icon = models.CharField(max_length=50, blank=True)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ["name"]
        verbose_name_plural = "Categories"


class Skill(models.Model):
    LEVEL_CHOICES = [
        ("beginner", "Başlanğıc"),
        ("intermediate", "Orta"),
        ("advanced", "İrəliləmiş"),
        ("expert", "Ekspert"),
    ]
    STATUS_CHOICES = [
        ("pending", "Gözləyir"),
        ("approved", "Təsdiqlənib"),
        ("rejected", "Rədd edilib"),
    ]

    slug = models.SlugField(unique=True, blank=True)
    title = models.CharField(max_length=200)
    description = models.TextField()
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name="skills")
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="skills")
    level = models.CharField(max_length=20, choices=LEVEL_CHOICES, default="beginner")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="approved")
    cover_image = models.ImageField(upload_to="skills/", blank=True, null=True)
    tags = models.CharField(max_length=300, blank=True, help_text="Vergüllə ayrılmış teqlər")
    is_active = models.BooleanField(default=True)
    views_count = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if not self.slug:
            base = slugify(self.title)
            slug = base
            counter = 1
            while Skill.objects.filter(slug=slug).exists():
                slug = f"{base}-{counter}"
                counter += 1
            self.slug = slug
        super().save(*args, **kwargs)

    class Meta:
        ordering = ["-created_at"]
