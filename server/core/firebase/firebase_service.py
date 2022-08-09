import logging
from typing import Any, Dict
from uuid import uuid4
from django.conf import settings

import firebase_admin
from firebase_admin import credentials, auth, firestore

from users.models import User

cred = credentials.Certificate(settings.GOOGLE_APPLICATION_CREDENTIALS)

firebase_app = firebase_admin.initialize_app(cred)
auth_client = auth.Client(app=firebase_app)
firestore_client = firestore.client(app=firebase_app)

logger = logging.getLogger(__name__)

class FirebaseService:
  @staticmethod
  def get_custom_token_for_user(user: User):
    auth_claims = {
      'uid': user.id,
    }
    return auth_client.create_custom_token(uid=user.id, developer_claims=auth_claims)
  
  @staticmethod
  def send_notification_to_user(user: User, message: Dict[str, Any]):
    msg_id = str(uuid4())
    notification_ref = firestore_client.collection(u'app-notifications') \
      .document(u'{}'.format(user.id)).collection("user-notifications").document(u'{}'.format(msg_id))
      
    notification_ref.set({
      u'message': message,
      'id': msg_id
    })
    logger.info(u'Notification sent to user {}'.format(user.id))