from firebase_admin import initialize_app
import os

os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "./application_default_credentials.json"
app = initialize_app()

from src.stripe import *  # noqa: E402, F403
from src.auth import *  # noqa: E402, F403
from src.db_management import *  # noqa: E402, F403
from src.azure_cli import *  # noqa: E402, F403
from src.create_new_customer import *  # noqa: E402, F403
from src.azure_auth import *  # noqa: E402, F403
from src.create_new_dataset import *  # noqa: E402, F403
from src.permissions_request import *  # noqa: E402, F403
from src.stripe_webhooks import *  # noqa: E402, F403