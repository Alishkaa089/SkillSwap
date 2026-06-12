from rest_framework import serializers
from .models import SwapRequest
from skills.serializers import SkillSerializer
from users.serializers import UserSerializer


class SwapRequestSerializer(serializers.ModelSerializer):
    sender_username = serializers.CharField(source="sender.username", read_only=True)
    receiver_username = serializers.CharField(source="receiver.username", read_only=True)
    offered_skill_title = serializers.CharField(source="offered_skill.title", read_only=True)
    requested_skill_title = serializers.CharField(source="requested_skill.title", read_only=True)

    class Meta:
        model = SwapRequest
        fields = [
            "id", "sender_username", "receiver_username",
            "offered_skill", "offered_skill_title",
            "requested_skill", "requested_skill_title",
            "message", "status", "created_at", "updated_at",
        ]
        read_only_fields = ["status", "created_at", "updated_at"]


class SwapRequestDetailSerializer(serializers.ModelSerializer):
    sender = UserSerializer(read_only=True)
    receiver = UserSerializer(read_only=True)
    offered_skill = SkillSerializer(read_only=True)
    requested_skill = SkillSerializer(read_only=True)

    class Meta:
        model = SwapRequest
        fields = [
            "id", "sender", "receiver",
            "offered_skill", "requested_skill",
            "message", "status", "created_at", "updated_at",
        ]
        read_only_fields = ["status", "created_at", "updated_at"]


class SwapCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = SwapRequest
        fields = ["receiver", "offered_skill", "requested_skill", "message"]

    def validate(self, data):
        request = self.context["request"]
        if data["receiver"] == request.user:
            raise serializers.ValidationError("Özünüzə swap sorğusu göndərə bilməzsiniz.")
        if data["offered_skill"].owner != request.user:
            raise serializers.ValidationError("Yalnız öz bacarığınızı təklif edə bilərsiniz.")
        if data["requested_skill"].owner != data["receiver"]:
            raise serializers.ValidationError("Sorğu edilən bacarıq alıcıya məxsus deyil.")
        return data
