import { promises as fs } from "fs";
import path from "path";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async () => {
  try {
    const directoryPath = path.join("static", "uploads");
    const files = await fs.readdir(directoryPath);

    if (files.length === 0) {
      return json({ message: "No files found." }, { status: 404 });
    }

    const fileUrls = files.map((file) => ({
      name: file,
      url: `/uploads/${file}`,
    }));

    return json({ files: fileUrls }, { status: 200 });
  } catch (error) {
    console.error("Error reading directory:", error);
    return json({ error: "Failed to list files" }, { status: 500 });
  }
};

export const POST: RequestHandler = async ({ request }) => {
  try {
    const data = await request.formData();
    const file = data.get("file") as File;

    if (!file) {
      return json({ error: "No file uploaded" }, { status: 400 });
    }

    const filename = `${Date.now()}-${file.name}`;
    const uploadPath = path.join("static/uploads", filename);

    const buffer = await file.arrayBuffer();
    await fs.writeFile(uploadPath, Buffer.from(buffer));

    return json({ fileUrl: `/uploads/${filename}` }, { status: 200 });
  } catch (error) {
    console.error("File upload error:", error);
    return json({ error: "Failed to upload file" }, { status: 500 });
  }
};
