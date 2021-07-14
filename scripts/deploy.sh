#!/bin/bash

S3_BUCKET_URI=$1

if [ -z "$S3_BUCKET_URI" ]
then
   echo "Usage: $0 <S3 bucket uri>";
   exit 0;
fi

echo "Building app..."
npm run build

echo "Deploying changes to S3..."
aws s3 sync --acl public-read --sse --delete ./build/ "$S3_BUCKET_URI"
