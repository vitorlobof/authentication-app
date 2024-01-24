from django.contrib import auth
from django.contrib.auth.models import update_last_login
from django.shortcuts import get_object_or_404
from django.core.mail import send_mail
from rest_framework import status, generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .utils.tokens import get_tokens_for_user
from .models import User
from .serializers import UserRegistrationSerializer, UserLoginSerializer, UserProfileSerializer, UserProfileUpdateSerializer, UserChangePasswordSerializer, SendPasswordResetEmailSerializer, UserPasswordResetSerializer
from .permissions import IsProfileOwner


class UserRegistrationView(APIView):
    serializer_class = UserRegistrationSerializer

    def post(self, request, format=None):
        serializer = self.serializer_class(data=request.data)

        serializer.is_valid(raise_exception=True)

        user = serializer.save()
        token = get_tokens_for_user(user)
        update_last_login(None, user)
        return Response({'token': token, 'detail': f'{user.get_username()} successfully registered.'}, status=status.HTTP_201_CREATED)


class UserLoginView(APIView):
    serializer_class = UserLoginSerializer

    def post(self, request, format=None):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = auth.authenticate(**serializer.validated_data)

        if user is None:
            return Response(
                {'non_field_error': "Estamos com problemas para atendê-lo agora, tente novamente mais tarde."},
                status=status.HTTP_400_BAD_REQUEST
            )

        token = get_tokens_for_user(user)
        update_last_login(None, user)
        return Response({'token': token, 'detail': f'{user.get_username()} logged in.'}, status=status.HTTP_200_OK)


class UserProfileView(generics.RetrieveUpdateAPIView):
    queryset = User.objects.all()
    permission_classes = [IsAuthenticated, IsProfileOwner]

    def get_serializer_class(self):
        match self.request.method:
            case 'PATCH':
                return UserProfileUpdateSerializer
            case _:
                return UserProfileSerializer

    def get_object(self):
        return self.request.user

    def retrieve(self, request, *args, **kwargs):
        obj = self.get_object()
        serializer_class = self.get_serializer_class()
        serializer = serializer_class(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def partial_update(self, request, *args, **kwargs):
        obj = self.get_object()
        serializer_class = self.get_serializer_class()
        serializer = serializer_class(obj, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({'detail': f"{obj.get_username()}'s profile was successfully updated."}, status=status.HTTP_200_OK)


class UserChangePasswordView(generics.UpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserChangePasswordSerializer
    permission_classes = [IsAuthenticated, IsProfileOwner]

    def update(self, request, *args, **kwargs):
        serializer_class = self.get_serializer_class()
        serializer = serializer_class(request.user, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({'detail': f"{request.user.get_username()}'s password was successfully altered."})


class SendPasswordResetEmailView(APIView):
    serializer = SendPasswordResetEmailSerializer

    def post(self, request, format=None):
        serializer = self.serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data['email']
        link = serializer.validated_data['link']

        send_mail(
            'Password reset',
            f'Click the link to reset your password.\n\n{link}',
            None,
            [email]
        )

        return Response({'detail': 'Password reset link sent. Check your email.'}, status=status.HTTP_200_OK)


class UserPasswordResetView(APIView):
    serializer = UserPasswordResetSerializer

    def post(self, request, user_id, token, format=None):
        serializer = self.serializer(
            data=request.data,
            context={'user_id': user_id, 'token': token}
        )
        serializer.is_valid(raise_exception=True)
        return Response({'detail': 'Password reset successfull.'}, status=status.HTTP_200_OK)
