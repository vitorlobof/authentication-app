from rest_framework import permissions


class IsProfileOwner(permissions.BasePermission):
    '''
    Makes sure an user can only alter it's own profile.
    '''

    def has_object_permission(self, request, view, obj):
        match request.method:
            case 'GET':
                return True
            case 'PATCH':
                return request.user == obj

        return False
