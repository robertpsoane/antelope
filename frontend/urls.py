from django.urls import path, re_path
from . import views

urlpatterns = [
    path('', views.index),
    path('coder/', views.index),
    path('settings/', views.index),
    path('labelling_schema/', views.index),
    path('login/', views.index),
    path('modify_schema/', views.index),
    path('view/<int:path_name>/', views.index),
    path('label/<int:path_name>/', views.index),
    path('setup/', views.index)
]
