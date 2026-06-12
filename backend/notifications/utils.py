from .models import Notification


def create_notification(recipient, sender, notif_type, message, related_id=None):
    Notification.objects.create(
        recipient=recipient,
        sender=sender,
        notif_type=notif_type,
        message=message,
        related_id=related_id,
    )
