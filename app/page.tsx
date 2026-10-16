"use client";

import { useState } from "react";

export default function Home() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError("");
    setText("");

    const formData = new FormData();
    formData.append("resume", file);

    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const data = await res.json();

    if (!res.ok) setError(data.error);
    else setText(data.text);
    setLoading(false);
  }

  return (
    <main className="mx-auto max-w-2xl p-10">
      <h1 className="text-3xl font-bold">Resume Analyzer</h1>
      <p className="mt-2 text-gray-600">
        Upload your resume and get instant feedback.
      </p>

      <input
        type="file"
        accept="application/pdf"
        onChange={handleUpload}
        className="mt-6 block"
      />

      {loading && <p className="mt-4">Reading your resume...</p>}
      {error && <p className="mt-4 text-red-600">{error}</p>}
      {text && (
        <pre className="mt-6 whitespace-pre-wrap rounded border p-4 text-sm">
          {text}
        </pre>
      )}
    </main>
  );
}