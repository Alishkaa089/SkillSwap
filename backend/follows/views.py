from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth.models import User

from .models import Follow
from .serializers import FollowSerializer
from notifications.utils import create_notification


class FollowViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    @action(detail=True, methods=["post"], url_path="follow")
    def follow(self, request, pk=None):
        try:
            target = User.objects.get(pk=pk)
        except User.DoesNotExist:
            return Response({"error": "İstifadəçi tapılmadı."}, status=status.HTTP_404_NOT_FOUND)
        if target == request.user:
            return Response({"error": "Özünüzü izləyə bilməzsiniz."}, status=status.HTTP_400_BAD_REQUEST)
        follow, created = Follow.objects.get_or_create(follower=request.user, following=target)
        if not created:
            return Response({"error": "Artıq izləyirsiniz."}, status=status.HTTP_400_BAD_REQUEST)
        create_notification(
            recipient=target,
            sender=request.user,
            notif_type="new_follower",
            message=f"{request.user.username} sizi izləməyə başladı.",
            related_id=request.user.id,
        )
        return Response({"message": f"{target.username} izlənildi."}, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=["delete"], url_path="unfollow")
    def unfollow(self, request, pk=None):
        try:
            target = User.objects.get(pk=pk)
        except User.DoesNotExist:
            return Response({"error": "İstifadəçi tapılmadı."}, status=status.HTTP_404_NOT_FOUND)
        deleted, _ = Follow.objects.filter(follower=request.user, following=target).delete()
        if not deleted:
            return Response({"error": "Bu istifadəçini izləmirdiniz."}, status=status.HTTP_400_BAD_REQUEST)
        return Response({"message": f"{target.username} izlənilmədi."})

    @action(detail=True, methods=["get"], url_path="followers", permission_classes=[AllowAny])
    def followers(self, request, pk=None):
        follows = Follow.objects.filter(following__id=pk)
        serializer = FollowSerializer(follows, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=["get"], url_path="following", permission_classes=[AllowAny])
    def following_list(self, request, pk=None):
        follows = Follow.objects.filter(follower__id=pk)
        serializer = FollowSerializer(follows, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=["get"])
    def feed(self, request):
        following_ids = Follow.objects.filter(follower=request.user).values_list("following_id", flat=True)
        from skills.models import Skill
        from skills.serializers import SkillSerializer
        skills = Skill.objects.filter(owner__id__in=following_ids, status="approved").order_by("-created_at")[:20]
        serializer = SkillSerializer(skills, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=["get"], url_path="is-following")
    def is_following(self, request, pk=None):
        is_following = Follow.objects.filter(follower=request.user, following__id=pk).exists()
        return Response({"is_following": is_following})
