import { useState } from "react";
import { uploadVideo } from "../services/videoService";
import { useNavigate } from "react-router-dom";

const Upload = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description || !file) {
      return alert("Please fill all fields and select a video file.");
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("video", file);

    try {
      setLoading(true);
      await uploadVideo(formData);
      alert("Video uploaded successfully!");
      navigate("/"); // redirect to Home or any page
    } catch (err) {
      console.error(err);
      alert("Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-white p-6 flex justify-center items-start">
      <div className="bg-zinc-800 p-8 rounded-2xl w-full max-w-xl shadow-xl">
        <h1 className="text-2xl font-bold mb-6 text-center">Upload Video</h1>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 rounded bg-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Enter video title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              rows="4"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 rounded bg-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Write a description..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Video File</label>
            <input
              type="file"
              accept="video/*"
              onChange={(e) => setFile(e.target.files[0])}
              className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-red-600 file:text-white hover:file:bg-red-700"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded text-white font-semibold w-full"
          >
            {loading ? "Uploading..." : "Upload"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Upload;
