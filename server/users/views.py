import random
from django.http import HttpRequest
from rest_framework.views import APIView
from rest_framework.throttling import UserRateThrottle
from rest_framework import generics
from rest_framework.authtoken.models import Token
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from core.firebase.firebase_service import FirebaseService
from users.models import User
from rest_framework import status
from users.serializers import UserPublicSerializer, UserCreateSerializer


random_jokes = [
    "I’m not like the other people, I’m like a machine. I can be programmed to do anything I want.",
    "My psychiatrist says I have an unhealthy obsession with revenge."
    "My printer's name is Bob Marley. \n Because it's always jammin'.",
    "Sorry, I was all up in your grill about cooking yesterday.",
    "What did the first plate say to the second plate? Dinner's on me.",
    "The inventor of the throat lozenge has died. There will be no coffin at his funeral.",
    "What's Forrest Gump’s Gmail password? 1forrest1",
    "What do you get when you cross a snowman with a vampire? Frostbite.",
    "What lies at the bottom of the sea shaking? A nervous wreck.",
    "An Italian chef has died. He pasta way.",
    "Why is corn such a good listener? Because it's all ears.",
    "What did the football coach say to the broken vending machine? Give me my quarterback.",
    "Why did the pig get hired by the restaurant? He was really good at bacon.",
    "What did the policeman say to his belly button? You're under a vest.",
    "Where do beef burgers go to dance? The meatball.",
    "Why can't you trust the king of the jungle? Because he's always lion."
]

class UserMeView(APIView):
    def get(self, request: HttpRequest) -> Response:
        res = FirebaseService.get_custom_token_for_user(user=request.user)
        user = UserPublicSerializer(request.user).data
        data = {
            "fb_token": res,
            "user": user
        }
        return Response(data=data, status=200)


class NotificationBurstThrottle(UserRateThrottle):
    scope = 'test-notifications'
    rate = '10/minute'

class NotificationSustainedThrottle(UserRateThrottle):
    scope = 'test-notifications'
    rate = '200/day'

class TestNotificationView(APIView):
    permission_classes = (AllowAny,)
    throttle_classes = (NotificationBurstThrottle, NotificationSustainedThrottle)

    def post(self, request: HttpRequest) -> Response:
        FirebaseService.send_notification_to_user(user=request.user, message=random.choice(random_jokes))
        return Response(status=status.HTTP_200_OK)


class UserCreateAPIView(generics.CreateAPIView):
    serializer_class = UserCreateSerializer
    permission_classes = (AllowAny,)
    
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        user = User.objects.get(username=serializer.data['username'])
        token = Token.objects.create(user=user).key
        return Response({"token": token}, status=status.HTTP_201_CREATED, headers=headers)
