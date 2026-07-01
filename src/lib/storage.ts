import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { env } from "@/lib/env";

let client: S3Client | undefined;
function s3() { const e = env(); return client ??= new S3Client({ region: e.S3_REGION, endpoint: e.S3_ENDPOINT, forcePathStyle: e.S3_FORCE_PATH_STYLE, credentials: e.S3_ACCESS_KEY_ID && e.S3_SECRET_ACCESS_KEY ? { accessKeyId: e.S3_ACCESS_KEY_ID, secretAccessKey: e.S3_SECRET_ACCESS_KEY } : undefined }); }
export async function createUploadUrl(key: string, contentType: string) { const e = env(); return getSignedUrl(s3(), new PutObjectCommand({ Bucket: e.S3_BUCKET, Key: key, ContentType: contentType }), { expiresIn: 900 }); }
export async function createDownloadUrl(key: string) { const e = env(); return getSignedUrl(s3(), new GetObjectCommand({ Bucket: e.S3_BUCKET, Key: key }), { expiresIn: 900 }); }
export async function putObject(key: string, body: Uint8Array, contentType: string) { const e = env(); await s3().send(new PutObjectCommand({ Bucket: e.S3_BUCKET, Key: key, Body: body, ContentType: contentType })); }
