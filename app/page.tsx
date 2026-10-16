"use client";

import { useState } from "react";

export default function Home() {
  const [analysis, setAnalysis] = useState<unknown>(null);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setStatus("Reading your resume...");
    setError("");
    setAnalysis(null);

    const formData = new FormData();
    formData.append("resume", file);

    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error);
      setStatus("");
      return;
    }

    setStatus("Analyzing with AI...");
    const aRes = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: data.text }),
    });
    const aData = await aRes.json();

    if (!aRes.ok) setError(aData.error);
    else setAnalysis(aData.analysis);
    setStatus("");
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

      {status && <p className="mt-4">{status}</p>}
      {error && <p className="mt-4 text-red-600">{error}</p>}
      {analysis !== null && (
        <pre className="mt-6 whitespace-pre-wrap rounded border p-4 text-sm">
          {JSON.stringify(analysis, null, 2)}
        </pre>
      )}
    </main>
  );
}