from django.db import models
from django.contrib.auth.models import User
from skills.models import Skill


class SwapRequest(models.Model):
    STATUS_CHOICES = [
        ("pending", "Gözləyir"),
        ("accepted", "Qəbul edildi"),
        ("rejected", "Rədd edildi"),
        ("completed", "Tamamlandı"),
        ("cancelled", "Ləğv edildi"),
    ]

    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name="sent_swaps")
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name="received_swaps")
    offered_skill = models.ForeignKey(Skill, on_delete=models.CASCADE, related_name="offered_in_swaps")
    requested_skill = models.ForeignKey(Skill, on_delete=models.CASCADE, related_name="requested_in_swaps")
    message = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.sender.username} → {self.receiver.username} ({self.status})"

    class Meta:
        ordering = ["-created_at"]
