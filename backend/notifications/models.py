from django.db import models
from django.contrib.auth.models import User


class Notification(models.Model):
    TYPE_CHOICES = [
        ("swap_request", "Swap Sorğusu"),
        ("swap_accepted", "Swap Qəbul Edildi"),
        ("swap_rejected", "Swap Rədd Edildi"),
        ("swap_completed", "Swap Tamamlandı"),
        ("new_review", "Yeni Rəy"),
        ("new_follower", "Yeni İzləyici"),
    ]

    recipient = models.ForeignKey(User, on_delete=models.CASCADE, related_name="notifications")
    sender = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name="sent_notifications")
    notif_type = models.CharField(max_length=30, choices=TYPE_CHOICES)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    related_id = models.IntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.recipient.username} - {self.notif_type}"

    class Meta:
        ordering = ["-created_at"]
