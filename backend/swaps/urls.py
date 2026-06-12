from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register("swaps", views.SwapRequestViewSet, basename="swap")

urlpatterns = router.urls
