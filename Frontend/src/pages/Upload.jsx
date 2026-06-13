import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UploadCloud, FileVideo, Image as ImageIcon, X, AlertCircle } from "lucide-react";
import { uploadVideo } from "../services/videoService";
import PageHeader from "../components/PageHeader";
import { formatDuration } from "../utils/format";

// Read a video file's duration (seconds) from its metadata, client-side.
const readDuration = (videoFile) =>
  new Promise((resolve) => {
    try {
      const url = URL.createObjectURL(videoFile);
      const v = document.createElement("video");
      v.preload = "metadata";
      v.onloadedmetadata = () => {
        URL.revokeObjectURL(url);
        resolve(Math.round(v.duration) || 0);
      };
      v.onerror = () => {
        URL.revokeObjectURL(url);
        resolve(0);
      };
      v.src = url;
    } catch {
      resolve(0);
    }
  });

const Upload = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [duration, setDuration] = useState(0);
  const [thumb, setThumb] = useState(null);
  const [thumbPreview, setThumbPreview] = useState("");
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const pickVideo = async (f) => {
    if (f && f.type.startsWith("video/")) {
      setFile(f);
      setError("");
      setDuration(await readDuration(f));
    } else if (f) {
      setError("Please choose a valid video file.");
    }
  };

  const pickThumb = (f) => {
    if (f && f.type.startsWith("image/")) {
      setThumb(f);
      setThumbPreview(URL.createObjectURL(f));
      setError("");
    } else if (f) {
      setError("Thumbnail must be an image file.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!title || !description || !file || !thumb) {
      setError("Add a title, description, video file and thumbnail image.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("duration", String(duration || 1)); // backend requires a duration
    formData.append("videoFile", file); // multer field name
    formData.append("thumbnail", thumb); // multer field name

    try {
      setLoading(true);
      await uploadVideo(formData);
      navigate("/");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fmtSize = (b) =>
    b > 1e6 ? `${(b / 1e6).toFixed(1)} MB` : `${Math.round(b / 1e3)} KB`;

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader
        icon={UploadCloud}
        title="Upload a video"
        subtitle="Share your content with the VideoTube community."
      />

      <form onSubmit={handleSubmit} className="space-y-6 animate-fade-up">
        {error && (
          <div className="flex items-center gap-2 rounded-xl border border-brand/30 bg-brand/10 px-4 py-3 text-sm text-brand">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        {/* Video dropzone */}
        {!file ? (
          <label
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              pickVideo(e.dataTransfer.files?.[0]);
            }}
            className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-6 py-14 text-center transition ${
              dragging
                ? "border-brand bg-brand/5"
                : "border-line bg-panel/50 hover:border-white/20 hover:bg-panel"
            }`}
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-panel-2">
              <UploadCloud className="h-7 w-7 text-brand" />
            </span>
            <div>
              <p className="font-semibold text-zinc-100">Drag &amp; drop your video</p>
              <p className="mt-1 text-sm text-muted">
                or <span className="text-brand">browse</span> to choose a file · MP4, WebM
              </p>
            </div>
            <input
              type="file"
              accept="video/*"
              onChange={(e) => pickVideo(e.target.files?.[0])}
              className="sr-only"
            />
          </label>
        ) : (
          <div className="surface flex items-center gap-4 p-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-panel-2">
              <FileVideo className="h-6 w-6 text-brand" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium text-zinc-100">{file.name}</p>
              <p className="text-sm text-muted">
                {fmtSize(file.size)}
                {duration > 0 ? ` · ${formatDuration(duration)}` : ""}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setFile(null);
                setDuration(0);
              }}
              className="grid h-9 w-9 place-items-center rounded-full text-zinc-400 transition hover:bg-white/5 hover:text-white"
              aria-label="Remove video"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}

        {/* Thumbnail */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-300">
            Thumbnail
          </label>
          <label className="group flex cursor-pointer items-center gap-4 rounded-2xl border border-line bg-panel/50 p-3 transition hover:border-white/20">
            <span className="flex h-[72px] w-32 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-panel-2">
              {thumbPreview ? (
                <img src={thumbPreview} alt="Thumbnail preview" className="h-full w-full object-cover" />
              ) : (
                <ImageIcon className="h-6 w-6 text-zinc-500" />
              )}
            </span>
            <span className="text-sm">
              <span className="font-medium text-zinc-100">
                {thumb ? "Change thumbnail" : "Choose a thumbnail"}
              </span>
              <span className="mt-0.5 block text-muted">JPG or PNG · 16:9 looks best</span>
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => pickThumb(e.target.files?.[0])}
              className="sr-only"
            />
          </label>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-300">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="field"
            placeholder="Give your video a catchy title"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-300">
            Description
          </label>
          <textarea
            rows="4"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="field resize-none"
            placeholder="Tell viewers what your video is about…"
          />
        </div>

        <button type="submit" disabled={loading} className="btn btn-primary w-full py-3">
          {loading ? "Uploading…" : "Publish video"}
        </button>
      </form>
    </div>
  );
};

export default Upload;
