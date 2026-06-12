from django.contrib.auth.models import User
from rest_framework import serializers
from .models import UserProfile


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["username", "email", "password", "password2", "first_name", "last_name"]
        extra_kwargs = {
            "username": {"error_messages": {"unique": "Bu istifadəçi adı artıq mövcuddur."}},
            "email": {"error_messages": {"unique": "Bu e-poçt artıq mövcuddur."}},
        }

    def validate_first_name(self, value):
        if value and len(value) < 3:
            raise serializers.ValidationError("Ad ən az 3 hərf olmalıdır.")
        if value and not value.replace(" ", "").isalpha():
            raise serializers.ValidationError("Ad yalnız hərflərdən ibarət ola bilər.")
        return value

    def validate_last_name(self, value):
        if value and len(value) < 3:
            raise serializers.ValidationError("Soyad ən az 3 hərf olmalıdır.")
        if value and not value.replace(" ", "").isalpha():
            raise serializers.ValidationError("Soyad yalnız hərflərdən ibarət ola bilər.")
        return value

    def validate_email(self, value):
        if "@" not in value:
            raise serializers.ValidationError("E-poçtda @ işarəsi olmalıdır.")
        return value

    def validate(self, data):
        if data["password"] != data["password2"]:
            raise serializers.ValidationError({"password": "Parollar uyğun deyil."})
        return data

    def create(self, validated_data):
        validated_data.pop("password2")
        user = User.objects.create_user(**validated_data)
        UserProfile.objects.create(user=user)
        return user


from django.contrib.auth import authenticate

class CustomTokenObtainPairSerializer(serializers.Serializer):
    username = serializers.CharField(write_only=True, required=False)
    email = serializers.EmailField(write_only=True, required=False)
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        username = data.get("username")
        email = data.get("email")
        password = data.get("password")

        if not username and not email:
            raise serializers.ValidationError("İstifadəçi adı və ya e-poçt tələb olunur.")

        user = None
        if username:
            user = authenticate(username=username, password=password)
        if not user and email:
            try:
                user_obj = User.objects.get(email=email)
                user = authenticate(username=user_obj.username, password=password)
            except User.DoesNotExist:
                pass

        if not user:
            raise serializers.ValidationError("İstifadəçi adı/e-poçt və ya şifrə yanlışdır.")

        from rest_framework_simplejwt.tokens import RefreshToken
        refresh = RefreshToken.for_user(user)
        return {
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        }


class LogoutSerializer(serializers.Serializer):
    refresh = serializers.CharField(help_text="Blacklistə salınacaq refresh token.")


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ["avatar", "bio", "city", "rating", "total_swaps"]
        read_only_fields = ["rating", "total_swaps"]


class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(read_only=True)
    followers_count = serializers.SerializerMethodField()
    following_count = serializers.SerializerMethodField()

    def get_followers_count(self, obj):
        return obj.followers.count()

    def get_following_count(self, obj):
        return obj.following.count()

    class Meta:
        model = User
        fields = ["id", "username", "email", "first_name", "last_name", "profile", "followers_count", "following_count"]
        read_only_fields = ["id"]


class UserUpdateSerializer(serializers.ModelSerializer):
    avatar = serializers.ImageField(source="profile.avatar", required=False)
    bio = serializers.CharField(source="profile.bio", required=False, allow_blank=True)
    city = serializers.CharField(source="profile.city", required=False, allow_blank=True)

    class Meta:
        model = User
        fields = ["first_name", "last_name", "email", "avatar", "bio", "city"]

    def update(self, instance, validated_data):
        profile_data = validated_data.pop("profile", {})
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        profile = instance.profile
        for attr, value in profile_data.items():
            setattr(profile, attr, value)
        profile.save()
        return instance
