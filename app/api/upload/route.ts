import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(new Uint8Array(arrayBuffer));

  // Explicitly assign NextResponse generic constraint to the wrapping Promise instance
  return new Promise<NextResponse>((resolve) => {
    cloudinary.uploader
      .upload_stream({ folder: "prodigies_receipts" }, (error, result) => {
        if (error) {
          resolve(NextResponse.json({ error: error.message }, { status: 500 }));
          return;
        }
        resolve(NextResponse.json({ url: result?.secure_url }));
      })
      .end(buffer);
  });
}
