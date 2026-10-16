import { extractText, getDocumentProxy } from "unpdf";

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("resume");

  if (!(file instanceof File)) {
    return Response.json({ error: "No file uploaded" }, { status: 400 });
  }
  if (file.type !== "application/pdf") {
    return Response.json({ error: "Please upload a PDF file" }, { status: 400 });
  }

  const buffer = new Uint8Array(await file.arrayBuffer());
  const pdf = await getDocumentProxy(buffer);
  const { text } = await extractText(pdf, { mergePages: true });

  return Response.json({ text });
}