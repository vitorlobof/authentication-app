import re
from django.core.exceptions import ValidationError
from django.utils.translation import gettext as _


class MaximumLengthValidator:
    def __init__(self, max_length=16):
        self.max_length = max_length

    def validate(self, password, user=None):
        if len(password) > self.max_length:
            raise ValidationError(
                _("This password must contain at most %(max_length)d characters."),
                code="password_too_long",
                params={"max_length": self.max_length},
            )

    def get_help_text(self):
        return _(
            "Your password must contain at most %(max_length)d characters."
            % {"max_length": self.max_length}
        )


class ContainsLowerCase:
    def validate(self, password, user=None):
        if not re.search(r'[a-z]', password):
            raise ValidationError(
                _('Password must contain at least one lowercase letter.'),
                code='password does not contain lowercase',
            )

    def get_help_text(self):
        return _('Your password must contain at least one lowercase letter.')


class ContainsUpperCase:
    def validate(self, password, user=None):
        if not re.search(r'[A-Z]', password):
            raise ValidationError(
                _('Password must contain at least one uppercase letter.'),
                code='password does not contain uppercase',
            )

    def get_help_text(self):
        return _('Your password must contain at least one uppercase letter.')
    
class ContainsNumericDigit:
    def validate(self, password, user=None):
        if not re.search(r'\d', password):
            raise ValidationError(
                _('Password must contain at least one numeric digit.'),
                code='password does not contain numeric digit',
            )

    def get_help_text(self):
        return _('Your password must contain at least one numeric digit.')
