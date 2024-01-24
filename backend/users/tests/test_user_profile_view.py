from django.test import TestCase
from django.urls import reverse
from django.utils.http import urlencode
from rest_framework import status
from ..models import User


class UserProfileViewTestCase(TestCase):
    def setUp(self):
        self.password = '1234!@#$qweR'

        self.user = User.objects.create_user(
            username="vitor",
            email="vitor@gmail.com",
            password=self.password,
        )

    def test_user_retrieve(self):
        data = {
            "username_or_email": self.user.get_username(),
            "password": self.password,
        }

        login_url = reverse('login')
        response = self.client.post(login_url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        token = response.data.get('token')

        profile_url = reverse(
            'profile',
            kwargs={'username': self.user.get_username()}
        )
        response = self.client.get(
            profile_url,
            format="json",
            HTTP_AUTHORIZATION=f'Bearer {token.get("access")}',
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data.get("username"),
                         self.user.get_username())
        self.assertEqual(response.data.get("first_name"),
                         self.user.get_short_name())
        self.assertEqual(response.data.get('profile_picture'),
                         self.user.get_profile_picture())
        self.assertEqual(response.data.get('bio'), self.user.get_bio())

    def test_user_update(self):
        data = {
            "username_or_email": self.user.get_username(),
            "password": self.password,
        }

        login_url = reverse('login')
        response = self.client.post(login_url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        token = response.data.get('token')
        profile_url = reverse(
            'profile',
            kwargs={'username': self.user.get_username()}
        )
        updated_profile = {
            'first_name': 'Victor',
            'last_name': 'Lopes',
            'bio': 'Hello, everyone.'
        }

        response = self.client.patch(
            profile_url,
            updated_profile,
            content_type='application/json',
            HTTP_AUTHORIZATION=f'Bearer {token.get("access")}',
        )

        self.user.refresh_from_db()

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(self.user.first_name,
                         updated_profile.get('first_name'))
        self.assertEqual(self.user.last_name, updated_profile.get('last_name'))
        self.assertEqual(self.user.get_bio(), updated_profile.get('bio'))

    def test_user_partial_update(self):
        data = {
            "username_or_email": self.user.get_username(),
            "password": self.password,
        }

        login_url = reverse('login')
        response = self.client.post(login_url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        token = response.data.get('token')
        profile_url = reverse(
            'profile',
            kwargs={'username': self.user.get_username()}
        )
        updated_profile = {
            'first_name': 'Victor',
            'bio': 'Hello, everyone.'
        }
        last_name = self.user.last_name

        response = self.client.patch(
            profile_url,
            updated_profile,
            content_type='application/json',
            HTTP_AUTHORIZATION=f'Bearer {token.get("access")}',
        )

        self.user.refresh_from_db()

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(self.user.first_name,
                         updated_profile.get('first_name'))
        self.assertEqual(self.user.last_name, last_name)
        self.assertEqual(self.user.get_bio(), updated_profile.get('bio'))

    def test_attempt_to_update_an_unrecognized_parameter(self):
        data = {
            "username_or_email": self.user.get_username(),
            "password": self.password,
        }

        login_url = reverse('login')
        response = self.client.post(login_url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        token = response.data.get('token')
        profile_url = reverse(
            'profile',
            kwargs={'username': self.user.get_username()}
        )
        updated_profile = {
            'first_name': 'Victor',
            'last_name': 'Lopes',
            'bio': 'Hello, everyone.',
            'unknown': 'Unrecognized parameter'
        }

        response = self.client.patch(
            profile_url,
            updated_profile,
            content_type='application/json',
            HTTP_AUTHORIZATION=f'Bearer {token.get("access")}',
        )

        self.user.refresh_from_db()

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertNotEqual(self.user.first_name,
                         updated_profile.get('first_name'))
        self.assertNotEqual(self.user.last_name, updated_profile.get('last_name'))
        self.assertNotEqual(self.user.get_bio(), updated_profile.get('bio'))
