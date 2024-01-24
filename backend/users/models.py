from typing import Union
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.safestring import mark_safe
from django.dispatch import receiver


class User(AbstractUser):
    def get_profile_picture(self) -> Union[str, None]:
        '''
        If the user provided a profile picture returns it's
        url, else returns returns None.
        '''
        if hasattr(self, "profile") and self.profile.img:
            return self.profile.img.url

    def get_bio(self) -> Union[str, None]:
        '''
        If the user provided a bio returns it, else returns
        None.
        '''
        if hasattr(self, 'profile'):
            return self.profile.bio


@receiver(models.signals.post_save, sender=User)
def post_user_save(sender, instance, created, **kw) -> None:
    '''
    When an user is created, his/her profile is created right
    after.
    '''
    if created:
        Profile.objects.create(user=instance)



class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    img = models.ImageField(
        upload_to="users_profile_pictures",
        blank=True,
        null=True,
    )
    bio = models.CharField(max_length=200, blank=True)
