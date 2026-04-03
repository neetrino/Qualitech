import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "node:crypto";

import type { R2Config } from "@/features/admin/r2/r2.config";
import type { AdminPresignUploadBody } from "@/features/admin/r2/r2.schemas";
import {
  R2_CONTENT_TYPE_TO_EXTENSION,
  R2_KEY_PREFIX_BY_SCOPE,
  R2_PRESIGN_EXPIRES_SECONDS,
  type R2AllowedContentType,
  type R2UploadScope,
} from "@/features/admin/r2/r2.constants";

export type PresignedR2UploadResult = {
  uploadUrl: string;
  publicUrl: string;
  key: string;
  expiresIn: number;
};

function createR2S3Client(config: R2Config): S3Client {
  return new S3Client({
    region: "auto",
    endpoint: `https://${config.accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
  });
}

function stripTrailingSlashes(base: string): string {
  return base.replace(/\/+$/, "");
}

export function buildR2PublicObjectUrl(publicBase: string, key: string): string {
  return `${stripTrailingSlashes(publicBase)}/${key}`;
}

function buildObjectKey(scope: R2UploadScope, contentType: R2AllowedContentType): string {
  const prefix = R2_KEY_PREFIX_BY_SCOPE[scope];
  const ext = R2_CONTENT_TYPE_TO_EXTENSION[contentType];
  return `${prefix}/${randomUUID()}.${ext}`;
}

/**
 * Issues a presigned PUT URL bound to `Content-Type` and `Content-Length` so size and type match admin policy.
 */
export async function createPresignedR2Upload(
  config: R2Config,
  body: AdminPresignUploadBody,
): Promise<PresignedR2UploadResult> {
  const client = createR2S3Client(config);
  const key = buildObjectKey(body.scope, body.contentType);
  const command = new PutObjectCommand({
    Bucket: config.bucketName,
    Key: key,
    ContentType: body.contentType,
    ContentLength: body.byteLength,
  });
  const uploadUrl = await getSignedUrl(client, command, { expiresIn: R2_PRESIGN_EXPIRES_SECONDS });
  const publicUrl = buildR2PublicObjectUrl(config.publicUrl, key);
  return {
    uploadUrl,
    publicUrl,
    key,
    expiresIn: R2_PRESIGN_EXPIRES_SECONDS,
  };
}
