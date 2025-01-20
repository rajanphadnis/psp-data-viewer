from firebase_functions import identity_fn
from firebase_admin import firestore, initialize_app
import os

os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "./application_default_credentials.json"
app = initialize_app()
db = firestore.client()


@identity_fn.before_user_created()
def beforeUserCreateClaims(
    event: identity_fn.AuthBlockingEvent,
) -> identity_fn.BeforeCreateResponse | None:
    doc = db.collection("access_control").document("users").get()
    if doc.exists:
        doc_info = doc.to_dict()
        print(f"Document data: {doc.to_dict()}")
        if event.data.email in doc_info:
            try:
                perms = doc_info[event.data.email]
                return identity_fn.BeforeSignInResponse(
                    custom_claims={"permissions": perms}
                )
            except Exception as e:
                print(e)
                return identity_fn.BeforeSignInResponse(
                    custom_claims={"permissions": []}
                )
        else:
            return identity_fn.BeforeSignInResponse(custom_claims={"permissions": []})
    else:
        print("access_control/users doc does not exist")
        return identity_fn.BeforeSignInResponse(custom_claims={"permissions": []})


# ANJALIISSOAWESOMEEEEEE
@identity_fn.before_user_signed_in()
def beforeSignInClaims(
    event: identity_fn.AuthBlockingEvent,
) -> identity_fn.BeforeSignInResponse | None:
    doc = db.collection("access_control").document("users").get()
    if doc.exists:
        doc_info = doc.to_dict()
        print(f"Document data: {doc.to_dict()}")
        if event.data.email in doc_info:
            try:
                perms = doc_info[event.data.email]
                return identity_fn.BeforeSignInResponse(
                    custom_claims={"permissions": perms}
                )
            except Exception as e:
                print(e)
                return identity_fn.BeforeSignInResponse(
                    custom_claims={"permissions": []}
                )
        else:
            return identity_fn.BeforeSignInResponse(custom_claims={"permissions": []})
    else:
        print("access_control/users doc does not exist")
        return identity_fn.BeforeSignInResponse(custom_claims={"permissions": []})
