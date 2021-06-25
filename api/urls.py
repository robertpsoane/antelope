"""altl URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.urls import path
from .views import default_api, CodingSessionsListView, TurnsListView
from .views import (CodingClassesListView, CodingsListView, 
    CodingSessionsInstanceView, TurnsInstanceView, CodingClassesInstanceView,
    CodingsInstanceView, UserList, UserDetail, user_login, user_logout,
    get_login_data)

urlpatterns = [
    path('sessions/', CodingSessionsListView.as_view()),
    path('turns/', TurnsListView.as_view()),
    path('coding_classes/', CodingClassesListView.as_view()),
    path('codings/', CodingsListView.as_view()),
    path('sessions/<int:pk>/', CodingSessionsInstanceView.as_view()),
    path('turns/<int:pk>/', TurnsInstanceView.as_view()),
    path('coding_classes/<int:pk>/', CodingClassesInstanceView.as_view()),
    path('codings/<int:pk>/', CodingsInstanceView.as_view()),
    path('users/', UserList.as_view()),
    path('users/<int:pk>/', UserDetail.as_view()),
    path('auth/', user_login),
    path('auth_logout/', user_logout),
    path('auth_check/', get_login_data),
    path('', default_api)
]
