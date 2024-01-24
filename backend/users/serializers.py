import os
from django.urls import reverse
from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.encoding import smart_str, force_bytes, DjangoUnicodeDecodeError
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from rest_framework import serializers
from .models import User


class UserRegistrationSerializer(serializers.ModelSerializer):
    '''
    Receives the data for the registration of a new user, validates the data and creates the user.
    '''
    confirm_password = serializers.CharField(
        max_length=16, style={'input_type': 'password'}, write_only=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'confirm_password')

    def validate(self, data):
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        confirm_password = data.pop('confirm_password')

        if User.objects.filter(username=data.get('username')).exists():
            raise serializers.ValidationError('Username already taken.')

        if User.objects.filter(email=data.get('email')).exists():
            raise serializers.ValidationError('Email already registered.')

        if password != confirm_password:
            raise serializers.ValidationError(
                "Password and password confirmation don't match.")

        validate_password(password)
        return data

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)


class UserLoginSerializer(serializers.Serializer):
    '''
    Validates login data.
    '''

    username_or_email = serializers.CharField(max_length=255)
    password = serializers.CharField(max_length=255, write_only=True)

    def validate(self, data):
        '''
        Checks if the user gave an username or an email. Then,
        checks if it is registed.
        '''
        username_or_email = data.get('username_or_email')
        password = data.get('password')

        if '@' in username_or_email:
            user = User.objects.filter(email=username_or_email).first()
        else:
            user = User.objects.filter(username=username_or_email).first()

        if user is None:
            raise serializers.ValidationError(
                {"username_or_email": 'Username or email is not registered.'})

        if not user.check_password(password):
            raise serializers.ValidationError({"password": "Senha incorreta."})

        return {'username': user.get_username(), 'password': password}


class UserChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(
        max_length=16, style={'input_type': 'password'}, write_only=True)
    new_password = serializers.CharField(
        max_length=16, style={'input_type': 'password'}, write_only=True)
    confirm_new_password = serializers.CharField(
        max_length=16, style={'input_type': 'password'}, write_only=True)

    class Meta:
        fields = ('old_password', 'new_password', 'confirm_new_password')

    def validate(self, data):
        new_password = data.get('new_password')
        confirm_new_password = data.get('confirm_new_password')

        if new_password != confirm_new_password:
            serializers.ValidationError(
                "New password and the confirmation of the new password don't match.")

        validate_password(new_password)
        return data

    def update(self, instance, validated_data):
        old_password = validated_data.get('old_password')
        new_password = validated_data.get('new_password')

        if not instance.check_password(old_password):
            raise serializers.ValidationError('Old password is not correct.')

        instance.set_password(new_password)
        instance.save()
        return instance


class UserProfileSerializer(serializers.ModelSerializer):
    '''
    Will convert a users profile data into a json.
    '''

    profile_picture = serializers.SerializerMethodField()
    bio = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ('username', 'first_name',
                  'last_name', 'profile_picture', 'bio')

    def get_profile_picture(self, obj):
        return obj.get_profile_picture()

    def get_bio(self, obj):
        return obj.get_bio()


class UserProfileUpdateSerializer(serializers.ModelSerializer):
    '''
    Receives the updates on the user profile, validates and
    saves the changes.
    '''

    profile_picture = serializers.ImageField(required=False)
    bio = serializers.CharField(max_length=200, required=False)

    class Meta:
        model = User
        fields = ('first_name', 'last_name', 'profile_picture', 'bio')

    def to_internal_value(self, data):
        self.raw_data = data
        return super().to_internal_value(data)

    def validate(self, data):
        recognized_parameters = set(self.fields)

        for key in self.raw_data.keys():
            if key not in recognized_parameters:
                raise serializers.ValidationError(
                    f'Parameter {key} is not recognized.')

        return data

    def update(self, instance, validated_data):
        instance.first_name = validated_data.get(
            'first_name', instance.first_name)
        instance.last_name = validated_data.get(
            'last_name', instance.last_name)
        instance.profile.img = validated_data.get(
            'profile_picture', instance.profile.img)
        instance.profile.bio = validated_data.get('bio', instance.profile.bio)
        instance.profile.save()
        instance.save()
        return instance


class SendPasswordResetEmailSerializer(serializers.Serializer):
    email = serializers.EmailField(max_length=255)

    class Meta:
        fields = ['email']

    def validate(self, data):
        email = data.get('email')

        if not User.objects.filter(email=email).exists():
            raise serializers.ValidationError('This email is not registered.')

        user = User.objects.get(email=email)

        kwargs = {
            'user_id': user.id,
            'token': PasswordResetTokenGenerator().make_token(user)
        }

        data['link'] = f"{os.environ['ROOT']}{reverse('reset-password', kwargs=kwargs)}"
        return data


class UserPasswordResetSerializer(serializers.Serializer):
    new_password = serializers.CharField(
        max_length=16, style={'input_type': 'password'}, write_only=True)
    confirm_new_password = serializers.CharField(
        max_length=16, style={'input_type': 'password'}, write_only=True)

    class Meta:
        fields = ['new_password', 'confirm_new_password']

    def validate(self, data):
        password = attrs.get('new_password')
        confirm = attrs.get('confirm_new_password')
        user_id = self.context.get('user_id')
        token = self.context.get('token')

        if password != confirm:
            raise serializers.ValidationError(
                {'confirm_new_password': 'Passwords must match.'})

        try:
            user = User.objects.get(id=user_id)
        except (ValueError, DjangoUnicodeDecodeError, User.DoesNotExist):
            raise serializers.ValidationError("Server error. Try again later.")

        if not PasswordResetTokenGenerator().check_token(user, token):
            raise serializers.ValidationError("Token is not valid or expired")

        user.set_password(password)
        user.save()

        return attrs
