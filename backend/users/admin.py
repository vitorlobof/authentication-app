from django.contrib import admin
from django.contrib.auth import admin as auth_admin
from django.contrib.auth.models import Permission
from django.contrib.contenttypes.models import ContentType
from .models import User
from .forms import UserChangeForm, UserCreationForm


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    form = UserChangeForm
    add_form = UserCreationForm
    model = User
    # fieldsets = auth_admin.UserAdmin.fieldsets
    list_display = ("__str__", "first_name", "last_name",
                    "email", "last_login", "date_joined")


@admin.register(Permission)
class PermissionAdmin(admin.ModelAdmin):
    list_display = ['name', 'content_type', 'codename']
    search_fields = ['name', 'content_type__app_label', 'content_type__model']
    list_filter = ['content_type']


@admin.register(ContentType)
class ContentTypeAdmin(admin.ModelAdmin):
    list_display = ["__str__", "id"]
