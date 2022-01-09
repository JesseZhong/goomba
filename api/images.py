from os import getenv
from dotenv import load_dotenv
from typing import Dict
from flask_restful import Resource, abort
from boto3 import client
from botocore.exceptions import ClientError
from api.authorization import admin_required
import re


load_dotenv()
IMAGE_BUCKET = getenv('IMAGE_BUCKET')

# Time in seconds. How long upload URL is valid for.
IMAGE_UPLOAD_EXPIRY = getenv(
    'IMAGE_UPLOAD_EXPIRY',
    60
)

IMAGE_KEY_REGEX = '^[a-z0-9_-]+\.(png|gif|jpeg|jpg)$'


class ImageUpload(Resource):

    @admin_required
    def get(self, args: Dict[str, str]):
        """
            Provide a presigned URL for uploading am image.
        """

        if not args or 'image_key' not in args:
            abort(400, 'Missing image key.')
        image_key = args['image_key']

        if not re.match(
            IMAGE_KEY_REGEX,
            image_key,
            re.RegexFlag.IGNORECASE
        ):
            abort(400, 'Invalid key.')

        s3 = client('s3')
        try:
            response = s3.generate_presigned_post(
                IMAGE_BUCKET,
                'images/' + image_key,
                ExpiresIn=IMAGE_UPLOAD_EXPIRY
            )

            return response, 200
        
        except ClientError as e:
            print(e)
            abort(500)