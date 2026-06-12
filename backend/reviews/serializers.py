from rest_framework import serializers
from .models import Review


class ReviewSerializer(serializers.ModelSerializer):
    reviewer_username = serializers.CharField(source="reviewer.username", read_only=True)
    reviewed_user_username = serializers.CharField(source="reviewed_user.username", read_only=True)
    reviewer_avatar = serializers.SerializerMethodField()

    def get_reviewer_avatar(self, obj):
        request = self.context.get("request")
        if obj.reviewer.profile.avatar and request:
            return request.build_absolute_uri(obj.reviewer.profile.avatar.url)
        return None

    class Meta:
        model = Review
        fields = [
            "id", "swap", "reviewer_username", "reviewed_user_username",
            "reviewer_avatar", "rating", "comment", "created_at", "updated_at",
        ]
        read_only_fields = ["created_at", "updated_at"]


class ReviewCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ["swap", "reviewed_user", "rating", "comment"]

    def validate(self, data):
        request = self.context["request"]
        swap = data["swap"]
        if swap.status != "completed":
            raise serializers.ValidationError("Yalnız tamamlanmış swap üçün rəy yazıla bilər.")
        if swap.sender != request.user and swap.receiver != request.user:
            raise serializers.ValidationError("Bu swap sizə aid deyil.")
        if Review.objects.filter(swap=swap, reviewer=request.user).exists():
            raise serializers.ValidationError("Bu swap üçün artıq rəy yazmısınız.")
        return data
