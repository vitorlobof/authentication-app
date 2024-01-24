from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from ..models import User


class UserChangePasswordTestCase(TestCase):
    def setUp(self):
        self.password = '1234!@#$qweR'

        self.user = User.objects.create_user(
            username="vitor",
            email="vitor@gmail.com",
            password=self.password,
            first_name='Vítor',
            last_name='Lobo'
        )

    def test_password_change(self):
        data = {
            "username_or_email": self.user.get_username(),
            "password": self.password,
        }

        login_url = reverse('login')
        response = self.client.post(login_url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        token = response.data.get('token')
        password_update = {
            'old_password': self.password,
            'new_password': '1234!@#$Qwer',
            'confirm_new_password': '1234!@#$Qwer',
        }

        change_password_url = reverse('change_password')
        response = self.client.patch(
            change_password_url,
            password_update,
            content_type='application/json',
            HTTP_AUTHORIZATION=f'Bearer {token.get("access")}'
        )

        self.user.refresh_from_db()

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(
            self.user.check_password(password_update.get('new_password')))
