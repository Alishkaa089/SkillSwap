from rest_framework import serializers
from .models import Skill, Category
from users.serializers import UserSerializer


class CategorySerializer(serializers.ModelSerializer):
    skills_count = serializers.SerializerMethodField()

    def get_skills_count(self, obj):
        return obj.skills.filter(is_active=True, status="approved").count()

    class Meta:
        model = Category
        fields = ["id", "name", "icon", "skills_count"]


class SkillSerializer(serializers.ModelSerializer):
    owner_username = serializers.CharField(source="owner.username", read_only=True)
    owner_id = serializers.IntegerField(source="owner.id", read_only=True)
    category_name = serializers.CharField(source="category.name", read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), source="category", write_only=True
    )
    is_active = serializers.BooleanField(default=True, required=False)

    class Meta:
        model = Skill
        fields = [
            "id", "slug", "title", "description", "level",
            "status", "cover_image", "tags", "is_active",
            "views_count", "created_at", "updated_at",
            "owner_username", "owner_id", "category_name", "category_id",
        ]
        read_only_fields = ["slug", "status", "views_count", "created_at", "updated_at"]


class SkillDetailSerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only=True)
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), source="category", write_only=True
    )
    is_active = serializers.BooleanField(default=True, required=False)

    class Meta:
        model = Skill
        fields = [
            "id", "slug", "title", "description", "level",
            "status", "cover_image", "tags", "is_active",
            "views_count", "created_at", "updated_at",
            "owner", "category", "category_id",
        ]
        read_only_fields = ["slug", "status", "views_count", "created_at", "updated_at"]
