from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from ..models import User


class LoginTestCase(TestCase):
    def setUp(self):
        self.login_url = reverse("login")

        self.correct_password = "1234!@#$qweR"
        self.incorrect_password = "123412341aA!"

        self.user = User.objects.create_user(
            username="vitor",
            email="vitor@gmail.com",
            password=self.correct_password,
        )

    def test_login_with_username(self):
        data = {
            "username_or_email": self.user.get_username(),
            "password": self.correct_password,
        }

        response = self.client.post(self.login_url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
    
    def test_login_with_email(self):
        data = {
            "username_or_email": str(self.user.email),
            "password": self.correct_password,
        }

        response = self.client.post(self.login_url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_login_username_error(self):
        data = {
            "username_or_email": "victor",
            "password": self.correct_password,
        }

        response = self.client.post(self.login_url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_login_password_error(self):
        data = {
            "username_or_email": "vitor",
            "password": self.incorrect_password
        }

        response = self.client.post(self.login_url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
