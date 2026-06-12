from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.filters import OrderingFilter
from django.contrib.auth.models import User
from django.db.models import Avg, Count

from .models import Review
from .serializers import ReviewSerializer, ReviewCreateSerializer
from .pagination import ReviewPagination


class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    pagination_class = ReviewPagination
    filter_backends = [OrderingFilter]
    ordering_fields = ["created_at", "rating"]
    ordering = ["-created_at"]

    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            return [AllowAny()]
        return [IsAuthenticated()]

    def get_serializer_class(self):
        if self.action == "create":
            return ReviewCreateSerializer
        return ReviewSerializer

    def perform_create(self, serializer):
        serializer.save(reviewer=self.request.user)

    @action(detail=False, methods=["get"], url_path="user/(?P<user_id>[^/.]+)")
    def user_reviews(self, request, user_id=None):
        reviews = Review.objects.filter(reviewed_user__id=user_id)
        page = self.paginate_queryset(reviews)
        if page is not None:
            serializer = ReviewSerializer(page, many=True, context={"request": request})
            return self.get_paginated_response(serializer.data)
        return Response(ReviewSerializer(reviews, many=True, context={"request": request}).data)

    @action(detail=False, methods=["get"])
    def leaderboard(self, request):
        top_users = User.objects.annotate(
            avg_rating=Avg("received_reviews__rating"),
            review_count=Count("received_reviews"),
        ).filter(review_count__gt=0).order_by("-avg_rating")[:20]

        data = [
            {
                "user_id": u.id,
                "username": u.username,
                "avg_rating": round(u.avg_rating or 0, 1),
                "review_count": u.review_count,
                "total_swaps": u.profile.total_swaps,
            }
            for u in top_users
        ]
        return Response(data)
