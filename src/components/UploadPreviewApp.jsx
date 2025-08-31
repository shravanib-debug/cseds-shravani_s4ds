import { useState } from "react";
import { Upload, Loader2 } from "lucide-react"; // Loader2 = spinner icon

export default function UploadPreviewApp() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [uploads, setUploads] = useState(() => {
    const saved = sessionStorage.getItem("uploads");
    return saved ? JSON.parse(saved) : [];
  });

  function handleFileChange(e) {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "application/pdf",
    ];
    const maxSize = 15 * 1024 * 1024; // 15 MB

    if (!allowedTypes.includes(selectedFile.type)) {
      setError("❌ Only JPEG, PNG, WebP, or PDF files are allowed.");
      setFile(null);
      return;
    }

    if (selectedFile.size > maxSize) {
      setError("❌ File size must be less than 15 MB.");
      setFile(null);
      return;
    }

    setError("");
    setFile(selectedFile);
     setTitle("");
    setDescription("");
    setStatus("idle");
   
  }

  function handleFileUpload() {
    if (!file) return;
    setStatus("uploading");

    setTimeout(() => {
      setStatus("success");

      const newUpload = {
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        title,
        description,
        fileObject: file,
        createdAt: new Date().toLocaleString(),
      };

      const updatedUploads = [...uploads, newUpload];
      setUploads(updatedUploads);
      sessionStorage.setItem("uploads", JSON.stringify(updatedUploads));
      // Reset current file and metadata
setFile(null);
      setTitle("");
      setDescription("");
    }, 2500);
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-indigo-100 via-white to-purple-100 p-6">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6">
        <h1 className="text-2xl font-bold text-center text-indigo-600 mb-6">
          Upload a File
        </h1>

        <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-indigo-400 rounded-xl cursor-pointer bg-indigo-50 hover:bg-indigo-100 transition">
          <Upload className="w-10 h-10 text-indigo-500 mb-2" />
          <p className="text-gray-600 text-sm">Click to choose a file</p>
          <input type="file" onChange={handleFileChange} className="hidden" />
        </label>

        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

        {file && (
          <div className="mt-6 p-4 border rounded-lg bg-gray-50 text-sm text-gray-700">
            <p>
              <span className="font-semibold">File:</span> {file.name}
            </p>
            <p>
              <span className="font-semibold">Size:</span>{" "}
              {(file.size / 1024).toFixed(2)} KB
            </p>
            <p>
              <span className="font-semibold">Type:</span> {file.type || "Unknown"}
            </p>
            <div className="mt-4">
              {file.type.startsWith("image/") ? (
                <img
                  src={URL.createObjectURL(file)}
                  alt="Preview"
                  className="max-h-48 rounded-lg border shadow-sm"
                />
              ) : file.type === "application/pdf" ? (
                <embed
                  src={URL.createObjectURL(file)}
                  type="application/pdf"
                  className="w-full h-48 border rounded-lg"
                />
              ) : (
                <p className="text-gray-500 text-sm">No preview available</p>
              )}
            </div>
          </div>
        )}

        {file && (
          <div className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter file title"
                className="mt-1 w-full border rounded-lg px-3 py-2 text-sm text-gray-900 focus:ring-2 focus:ring-indigo-400"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter file description"
                className="mt-1 w-full border rounded-lg px-3 py-2 text-sm text-gray-900 focus:ring-2 focus:ring-indigo-400"
                rows={3}
              />
            </div>
          </div>
        )}

        {file && (
          <div className="mt-6 flex justify-center">
            <button
              onClick={handleFileUpload}
              disabled={status === "uploading"}
              className={`flex items-center gap-2 px-6 py-2 font-medium rounded-lg shadow-md transition ${
                status === "uploading"
                  ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                  : "bg-indigo-600 text-white hover:bg-indigo-700"
              }`}
            >
              {status === "uploading" ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Uploading...
                </>
              ) : (
                "Upload"
              )}
            </button>
          </div>
        )}

        {status === "success" && (
          <p className="mt-6 text-green-600 text-center font-semibold">
            ✅ Upload complete!
          </p>
        )}
      </div>

      {/* Uploaded Files List */}
      {uploads.length > 0 && (
        <div className="w-full max-w-md mt-6">
          <h2 className="text-lg font-semibold mb-2">Uploaded Files</h2>
          {uploads.map((u, idx) => (
            <div
              key={idx}
              className="flex items-center p-3 mb-2 border rounded bg-gray-50 gap-4"
            >
              {/* Thumbnail */}
              {u.fileType.startsWith("image/") ? (
                <img
                  src={URL.createObjectURL(u.fileObject)}
                  className="w-12 h-12 object-cover rounded"
                />
              ) : u.fileType === "application/pdf" ? (
                <div className="w-12 h-12 flex items-center justify-center bg-red-200 text-red-800 font-bold rounded">
                  PDF
                </div>
              ) : (
                <div className="w-12 h-12 flex items-center justify-center bg-gray-200 rounded">
                  File
                </div>
              )}

              {/* File Info */}
              <div className="text-sm text-gray-700">
                <p>
                  <span className="font-semibold">Title:</span> {u.title}
                </p>
                <p>
                  <span className="font-semibold">Type:</span> {u.fileType}
                </p>
                <p>
                  <span className="font-semibold">Size:</span>{" "}
                  {(u.fileSize / 1024).toFixed(2)} KB
                </p>
                <p>
                  <span className="font-semibold">Created:</span> {u.createdAt}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

