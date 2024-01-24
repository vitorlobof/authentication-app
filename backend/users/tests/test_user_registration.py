from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from ..models import User


class UserRegistrationTestCase(TestCase):
    def setUp(self):
        self.register_url = reverse('register')

    def test_valid_register(self):
        data = {
            'username': 'justfortest',
            'email': 'test@gmail.com',
            'password': '1234!@#$qweR',
            'confirm_password': '1234!@#$qweR',
        }

        response = self.client.post(self.register_url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        user = User.objects.filter(username=data['username']).first()
        self.assertIsNotNone(user)
        self.assertEqual(user.username, data['username'])
        self.assertEqual(user.email, data['email'])
        self.assertNotEqual(user.password, data['password'])

    def test_confirm_password_error(self):
        data = {
            "username": "justfortest",
            "email": "test@gmail.com",
            "password": '1234!@#$qweR',
            "confirm_password": "1234",
        }

        response = self.client.post(self.register_url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_short_password(self):
        data = {
            "username": "justfortest",
            "email": "test@gmail.com",
            "password": "1234",
            "confirm_password": "1234",
        }

        response = self.client.post(self.register_url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_email_validation(self):
        data = {
            "username": "vitor",
            "email": "bla",
            "password": "1234!@#$qweR",
            "confirm_password": "1234!@#$qweR",
        }

        response = self.client.post(self.register_url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_username_already_registered(self):
        data = {
            "username": "vitor",
            "email": "vitor@gmail.com",
            "password": "1234!@#$qweR",
            "confirm_password": "1234!@#$qweR",
        }

        response = self.client.post(self.register_url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        data = {
            "username": "vitor",
            "email": "victor@gmail.com",
            "password": "1234!@#$qweR",
            "confirm_password": "1234!@#$qweR",
        }

        response = self.client.post(self.register_url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
