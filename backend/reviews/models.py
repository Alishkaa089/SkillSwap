from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator
from swaps.models import SwapRequest


class Review(models.Model):
    swap = models.ForeignKey(SwapRequest, on_delete=models.CASCADE, related_name="reviews")
    reviewer = models.ForeignKey(User, on_delete=models.CASCADE, related_name="given_reviews")
    reviewed_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="received_reviews")
    rating = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.reviewer.username} → {self.reviewed_user.username} ({self.rating}★)"

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        # Update user average rating
        from django.db.models import Avg
        avg = Review.objects.filter(reviewed_user=self.reviewed_user).aggregate(Avg("rating"))["rating__avg"]
        profile = self.reviewed_user.profile
        profile.rating = round(avg or 0, 1)
        profile.save()

    class Meta:
        ordering = ["-created_at"]
        unique_together = ["swap", "reviewer"]
