from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView
from rest_framework_simplejwt.views import TokenRefreshView
from users.views import RegisterApiView, LogoutApiView, MeApiView, UserDetailApiView, UserSearchApiView, CustomTokenObtainPairView

urlpatterns = [
    path("admin/", admin.site.urls),

    # API Schema / Docs
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path("api/docs/", SpectacularSwaggerView.as_view(url_name="schema"), name="swagger-ui"),

    # Auth endpoints
    path("api/auth/register/", RegisterApiView.as_view(), name="auth_register"),
    path("api/auth/login/", CustomTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/auth/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("api/auth/logout/", LogoutApiView.as_view(), name="auth_logout"),
    path("api/auth/me/", MeApiView.as_view(), name="auth_me"),

    # Users
    path("api/users/<int:pk>/", UserDetailApiView.as_view(), name="user_detail"),
    path("api/users/search/", UserSearchApiView.as_view(), name="user_search"),

    # Feature apps
    path("api/", include("skills.urls")),
    path("api/", include("swaps.urls")),
    path("api/", include("reviews.urls")),
    path("api/", include("notifications.urls")),
    path("api/", include("follows.urls")),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
