from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated, AllowAny
from rest_framework.filters import SearchFilter, OrderingFilter
from django.db.models import Count, Q

from .models import Skill, Category
from .serializers import SkillSerializer, SkillDetailSerializer, CategorySerializer
from .pagination import SkillPagination, CategoryPagination


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    pagination_class = CategoryPagination
    permission_classes = [AllowAny]


class SkillViewSet(viewsets.ModelViewSet):
    queryset = Skill.objects.filter(is_active=True, status="approved")
    pagination_class = SkillPagination
    lookup_field = "slug"

    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ["title", "description", "tags"]
    ordering_fields = ["created_at", "views_count", "title"]
    ordering = ["-created_at"]

    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            return [AllowAny()]
        return [IsAuthenticated()]

    def get_serializer_class(self):
        if self.action in ["retrieve", "update", "partial_update"]:
            return SkillDetailSerializer
        return SkillSerializer

    def get_queryset(self):
        queryset = Skill.objects.filter(is_active=True, status="approved")
        category = self.request.query_params.get("category")
        level = self.request.query_params.get("level")
        owner = self.request.query_params.get("owner")
        if category:
            queryset = queryset.filter(category__id=category)
        if level:
            queryset = queryset.filter(level=level)
        if owner:
            queryset = queryset.filter(owner__id=owner)
        return queryset

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.views_count += 1
        instance.save(update_fields=["views_count"])
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    @action(detail=False, methods=["get"])
    def my(self, request):
        skills = Skill.objects.filter(owner=request.user)
        page = self.paginate_queryset(skills)
        if page is not None:
            serializer = SkillSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = SkillSerializer(skills, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=["get"])
    def trending(self, request):
        skills = Skill.objects.filter(
            is_active=True, status="approved"
        ).order_by("-views_count")[:10]
        serializer = SkillSerializer(skills, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=["get"])
    def stats(self, request):
        stats = Skill.objects.aggregate(
            total=Count("id"),
            approved=Count("id", filter=Q(status="approved")),
            pending=Count("id", filter=Q(status="pending")),
        )
        category_stats = Category.objects.annotate(
            count=Count("skills", filter=Q(skills__status="approved"))
        ).values("name", "count").order_by("-count")[:5]
        return Response({"overview": stats, "top_categories": list(category_stats)})
