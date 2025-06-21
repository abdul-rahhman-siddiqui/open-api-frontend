import { useState } from "react";
import api from "../api/api";

export default function Upload() {
  const [uploadMode, setUploadMode] = useState("file"); // 'file' or 'url'
  const [file, setFile] = useState(null);
  const [oasUrl, setOasUrl] = useState("");
  const [baseUrl, setBaseUrl] = useState("https://petstore.swagger.io/v2");
  const [summaryId, setSummaryId] = useState("");

  const handleSubmit = async () => {
    const fd = new FormData();
    fd.append("baseURL", baseUrl);

    if (uploadMode === "file") {
      if (!file) return alert("Please upload a file");
      fd.append("oas", file);
    } else {
      if (!oasUrl) return alert("Please paste a URL");
      fd.append("oasUrl", oasUrl); // send this instead of file
    }

    const { data } = await api.post("/upload", fd);
    setSummaryId(data.summaryId);
  };

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-bold">Upload or Link OpenAPI Spec</h2>

      <div className="flex gap-6 items-center">
        <label>
          <input
            type="radio"
            value="file"
            checked={uploadMode === "file"}
            onChange={() => setUploadMode("file")}
          />{" "}
          Upload File
        </label>
        <label>
          <input
            type="radio"
            value="url"
            checked={uploadMode === "url"}
            onChange={() => setUploadMode("url")}
          />{" "}
          Paste URL
        </label>
      </div>

      {uploadMode === "file" ? (
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      ) : (
        <input
          type="text"
          className="border p-2 w-full"
          placeholder="Paste Swagger JSON URL"
          value={oasUrl}
          onChange={(e) => setOasUrl(e.target.value)}
        />
      )}

      <input
        className="border p-2 w-full"
        placeholder="Override baseURL (optional)"
        value={baseUrl}
        onChange={(e) => setBaseUrl(e.target.value)}
      />

      <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={handleSubmit}>
        Run Test
      </button>

      {summaryId && (
        <p className="mt-4">
          ✅ Done. <a className="underline" href={`/summary/${summaryId}`}>View Summary →</a>
        </p>
      )}
    </div>
  );
}
