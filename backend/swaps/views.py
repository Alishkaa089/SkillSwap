from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q

from .models import SwapRequest
from .serializers import SwapRequestSerializer, SwapRequestDetailSerializer, SwapCreateSerializer
from .pagination import SwapPagination
from notifications.utils import create_notification


class SwapRequestViewSet(viewsets.ModelViewSet):
    pagination_class = SwapPagination
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return SwapRequest.objects.filter(Q(sender=user) | Q(receiver=user))

    def get_serializer_class(self):
        if self.action == "create":
            return SwapCreateSerializer
        if self.action == "retrieve":
            return SwapRequestDetailSerializer
        return SwapRequestSerializer

    def perform_create(self, serializer):
        swap = serializer.save(sender=self.request.user)
        create_notification(
            recipient=swap.receiver,
            sender=self.request.user,
            notif_type="swap_request",
            message=f"{self.request.user.username} sizə swap sorğusu göndərdi.",
            related_id=swap.id,
        )

    @action(detail=False, methods=["get"])
    def incoming(self, request):
        swaps = SwapRequest.objects.filter(receiver=request.user)
        page = self.paginate_queryset(swaps)
        if page is not None:
            serializer = SwapRequestSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        return Response(SwapRequestSerializer(swaps, many=True).data)

    @action(detail=False, methods=["get"])
    def outgoing(self, request):
        swaps = SwapRequest.objects.filter(sender=request.user)
        page = self.paginate_queryset(swaps)
        if page is not None:
            serializer = SwapRequestSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        return Response(SwapRequestSerializer(swaps, many=True).data)

    @action(detail=True, methods=["patch"])
    def accept(self, request, pk=None):
        swap = self.get_object()
        if swap.receiver != request.user:
            return Response({"error": "İcazəniz yoxdur."}, status=status.HTTP_403_FORBIDDEN)
        if swap.status != "pending":
            return Response({"error": "Bu sorğu artıq cavablandırılıb."}, status=status.HTTP_400_BAD_REQUEST)
        swap.status = "accepted"
        swap.save()
        create_notification(
            recipient=swap.sender,
            sender=request.user,
            notif_type="swap_accepted",
            message=f"{request.user.username} swap sorğunuzu qəbul etdi.",
            related_id=swap.id,
        )
        return Response({"message": "Swap qəbul edildi.", "status": swap.status})

    @action(detail=True, methods=["patch"])
    def reject(self, request, pk=None):
        swap = self.get_object()
        if swap.receiver != request.user:
            return Response({"error": "İcazəniz yoxdur."}, status=status.HTTP_403_FORBIDDEN)
        if swap.status != "pending":
            return Response({"error": "Bu sorğu artıq cavablandırılıb."}, status=status.HTTP_400_BAD_REQUEST)
        swap.status = "rejected"
        swap.save()
        create_notification(
            recipient=swap.sender,
            sender=request.user,
            notif_type="swap_rejected",
            message=f"{request.user.username} swap sorğunuzu rədd etdi.",
            related_id=swap.id,
        )
        return Response({"message": "Swap rədd edildi.", "status": swap.status})

    @action(detail=True, methods=["patch"])
    def complete(self, request, pk=None):
        swap = self.get_object()
        if swap.sender != request.user and swap.receiver != request.user:
            return Response({"error": "İcazəniz yoxdur."}, status=status.HTTP_403_FORBIDDEN)
        if swap.status != "accepted":
            return Response({"error": "Yalnız qəbul edilmiş swap tamamlana bilər."}, status=status.HTTP_400_BAD_REQUEST)
        swap.status = "completed"
        swap.save()
        # Update total_swaps for both users
        for profile in [swap.sender.profile, swap.receiver.profile]:
            profile.total_swaps += 1
            profile.save()
        return Response({"message": "Swap tamamlandı.", "status": swap.status})

    @action(detail=True, methods=["delete"])
    def cancel(self, request, pk=None):
        swap = self.get_object()
        if swap.sender != request.user:
            return Response({"error": "İcazəniz yoxdur."}, status=status.HTTP_403_FORBIDDEN)
        if swap.status not in ["pending"]:
            return Response({"error": "Yalnız gözləyən sorğu ləğv edilə bilər."}, status=status.HTTP_400_BAD_REQUEST)
        swap.status = "cancelled"
        swap.save()
        return Response({"message": "Swap ləğv edildi."})

    @action(detail=False, methods=["get"])
    def stats(self, request):
        user = request.user
        from django.db.models import Count, Q
        stats = SwapRequest.objects.filter(
            Q(sender=user) | Q(receiver=user)
        ).aggregate(
            total=Count("id"),
            pending=Count("id", filter=Q(status="pending")),
            accepted=Count("id", filter=Q(status="accepted")),
            completed=Count("id", filter=Q(status="completed")),
        )
        return Response(stats)
