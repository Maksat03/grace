from django.contrib.auth.models import User
from django.contrib.auth import login as auth_login
from rest_framework import serializers

from rest_framework.request import Request

from typing import Mapping


class ChangePasswordSerializer(serializers.ModelSerializer):
    old_password = serializers.CharField(max_length=50)
    new_password1 = serializers.CharField(max_length=50)
    new_password2 = serializers.CharField(max_length=50)

    class Meta:
        model = User
        fields = ["old_password", "new_password1", "new_password2"]

    def validate_old_password(self, old_password: str) -> str:
        if self.instance:
            if not self.instance.check_password(old_password):
                raise serializers.ValidationError({"old_password": "Старый пароль неверный"})
        return old_password

    def validate(self, attrs: Mapping) -> Mapping:
        if attrs["new_password1"] != attrs["new_password2"]:
            raise serializers.ValidationError({"new_password2": "Указанные пароли не совпадают"})
        elif attrs["new_password1"] == attrs["old_password"]:
            raise serializers.ValidationError({"new_password1": "Новый пароль совпадает со старым паролем"})
        return attrs

    def update(self, user: User, validated_data: Mapping) -> User:
        user.set_password(validated_data.get("new_password1"))
        user.save(update_fields=["password"])

        if hasattr(user, "client"):
            user.client.password = validated_data.get("new_password1")
            user.client.save(update_fields=["password"])

        return user


def change_password(request: Request, user: User, data: Mapping) -> None:
    serializer = ChangePasswordSerializer(user, data=data)
    serializer.is_valid(raise_exception=True)
    user = serializer.save()
    auth_login(request, user)
