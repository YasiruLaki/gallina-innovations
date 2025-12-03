"use client";
import React, { useState, useRef, useEffect } from "react";
import { auth, db } from "../firebaseConfig";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { collection, addDoc, doc, getDoc, setDoc } from "firebase/firestore";

const categories = ["Residential", "Industrial", "Landscape"];

type UploadFile = {
  file: File;
  progress: number;
  url?: string;
  error?: string;
};

export default function EditorPanel() {
  const [user, setUser] = useState(auth.currentUser);

  // Project form state
  const [form, setForm] = useState({
    title: "",
    location: "",
    tags: "",
    category: categories[0],
    description: "",
    approach: "",
    catchline: "",
    imageUrls: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);

  // Project image uploads
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Landing slideshow state
  const [landingImages, setLandingImages] = useState<string[]>([]);
  const [landingUploadFiles, setLandingUploadFiles] = useState<UploadFile[]>(
    []
  );
  const landingFileInputRef = useRef<HTMLInputElement | null>(null);
  const [landingLoading, setLandingLoading] = useState(false);
  const [landingError, setLandingError] = useState("");
  const [landingSuccess, setLandingSuccess] = useState("");

  // Auth listeners
  useEffect(() => {
    const unsub = auth.onAuthStateChanged((u) => setUser(u));
    return () => unsub();
  }, []);

  // Fetch current landing images
  useEffect(() => {
    const fetchLanding = async () => {
      try {
        const ref = doc(db, "siteSettings", "landing");
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data();
          if (Array.isArray(data.images)) setLandingImages(data.images);
        }
      } catch {
        setLandingError("Failed to fetch landing images");
      }
    };
    fetchLanding();
  }, []);

  // ===== Upload Functions =====
  const uploadFile = (f: UploadFile, onComplete: (url?: string) => void) => {
    const formData = new FormData();
    formData.append("image", f.file);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "https://cdn.gallinainnovations.com/upload");

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 100);
        setUploadFiles((prev) =>
          prev.map((uf) =>
            uf.file === f.file ? { ...uf, progress: percent } : uf
          )
        );
        setLandingUploadFiles((prev) =>
          prev.map((uf) =>
            uf.file === f.file ? { ...uf, progress: percent } : uf
          )
        );
      }
    };

    xhr.onload = () => {
      const data = JSON.parse(xhr.responseText);
      if (xhr.status === 200 && data.url) {
        onComplete(data.url);
        setUploadFiles((prev) =>
          prev.map((uf) =>
            uf.file === f.file ? { ...uf, url: data.url, progress: 100 } : uf
          )
        );
        setLandingUploadFiles((prev) =>
          prev.map((uf) =>
            uf.file === f.file ? { ...uf, url: data.url, progress: 100 } : uf
          )
        );
      } else {
        const errMsg = data.error || xhr.statusText || "Upload failed";
        setUploadFiles((prev) =>
          prev.map((uf) =>
            uf.file === f.file ? { ...uf, error: errMsg, progress: 0 } : uf
          )
        );
        setLandingUploadFiles((prev) =>
          prev.map((uf) =>
            uf.file === f.file ? { ...uf, error: errMsg, progress: 0 } : uf
          )
        );
      }
    };

    xhr.onerror = () => {
      setUploadFiles((prev) =>
        prev.map((uf) =>
          uf.file === f.file
            ? { ...uf, error: "Upload failed", progress: 0 }
            : uf
        )
      );
      setLandingUploadFiles((prev) =>
        prev.map((uf) =>
          uf.file === f.file
            ? { ...uf, error: "Upload failed", progress: 0 }
            : uf
        )
      );
    };

    xhr.send(formData);
  };

  // Handle project files
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles = Array.from(files).map((file) => ({ file, progress: 0 }));
    setUploadFiles((prev) => [...prev, ...newFiles]);
    newFiles.forEach((f) =>
      uploadFile(f, (url) => {
        if (url) {
          setForm((prev) => {
            const urls = [...prev.imageUrls.split(",").filter(Boolean), url];
            return { ...prev, imageUrls: urls.join(",") };
          });
        }
      })
    );
  };

  const handleLandingFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const remainingSlots = 5 - landingImages.length - landingUploadFiles.length;
    if (remainingSlots <= 0) return; // no more files allowed

    const newFiles = Array.from(files)
      .slice(0, remainingSlots)
      .map((file) => ({ file, progress: 0 }));

    setLandingUploadFiles((prev) => [...prev, ...newFiles]);

    newFiles.forEach((f) => {
      uploadFile(f, (url) => {
        if (url) {
          setLandingImages((prev) => [...prev, url]);
          setLandingUploadFiles((prev) =>
            prev.map((uf) =>
              uf.file === f.file ? { ...uf, url, progress: 100 } : uf
            )
          );
        }
      });
    });
  };

  // Remove landing image
  const handleRemoveLandingImage = (index: number) => {
    setLandingImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Save landing images to Firestore
  const handleSaveLandingImages = async () => {
    setLandingLoading(true);
    setLandingError("");
    setLandingSuccess("");
    try {
      const ref = doc(db, "siteSettings", "landing");
      await setDoc(ref, { images: landingImages });
      setLandingSuccess("Landing images saved!");
    } catch (err: unknown) {
      if (typeof err === 'object' && err !== null && 'message' in err) {
        setLandingError((err as { message?: string }).message || "Failed to save landing images");
      } else {
        setLandingError("Failed to save landing images");
      }
    } finally {
      setLandingLoading(false);
    }
  };

  // ===== Auth Handlers =====
  const handleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
    } catch (err: unknown) {
      if (typeof err === 'object' && err !== null && 'message' in err) {
        setError((err as { message?: string }).message || "Sign in failed");
      } else {
        setError("Sign in failed");
      }
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = isSignUp
        ? await createUserWithEmailAndPassword(auth, email, password)
        : await signInWithEmailAndPassword(auth, email, password);
      setUser(result.user);
    } catch (err: unknown) {
      if (typeof err === 'object' && err !== null && 'message' in err) {
        setError((err as { message?: string }).message || "Auth failed");
      } else {
        setError("Auth failed");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
    setUser(null);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const tagsArr = form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
      const imageUrlsArr = form.imageUrls
        .split(",")
        .map((u) => u.trim())
        .filter(Boolean);

      await addDoc(collection(db, "projects"), {
        title: form.title,
        location: form.location,
        tags: tagsArr,
        category: form.category,
        description: form.description,
        approach: form.approach,
        catchline: form.catchline,
        imageUrls: imageUrlsArr,
        createdBy: user?.email || "anonymous",
        createdAt: new Date().toISOString(),
      });

      setSuccess("Project added successfully!");
      setForm({
        title: "",
        location: "",
        tags: "",
        category: categories[0],
        description: "",
        approach: "",
        catchline: "",
        imageUrls: "",
      });
      setUploadFiles([]);
    } catch (err: unknown) {
      if (typeof err === 'object' && err !== null && 'message' in err) {
        setError((err as { message?: string }).message || 'Project add failed');
      } else {
        setError('Project add failed');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black">
        <div className="w-full max-w-sm bg-zinc-900 rounded-xl shadow-lg p-8 flex flex-col items-center">
          <h2 className="text-3xl mb-6 text-white">Editor Login</h2>
          <form
            onSubmit={handleEmailAuth}
            className="flex flex-col gap-4 w-full"
          >
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="p-3 border border-zinc-700 rounded bg-zinc-800 text-white placeholder-zinc-400"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="p-3 border border-zinc-700 rounded bg-zinc-800 text-white placeholder-zinc-400"
              required
            />
            <button
              type="submit"
              className="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700"
              disabled={loading}
            >
              {loading
                ? isSignUp
                  ? "Signing up..."
                  : "Logging in..."
                : isSignUp
                ? "Sign Up"
                : "Log In"}
            </button>
          </form>
          <button
            onClick={handleSignIn}
            className="mt-6 px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 w-full"
          >
            Sign in with Google
          </button>
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="mt-4 text-sm text-blue-400 underline"
          >
            {isSignUp
              ? "Already have an account? Log In"
              : "Don't have an account? Sign Up"}
          </button>
          {error && (
            <p className="text-red-500 mt-4 w-full text-center">{error}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-full max-w-full bg-zinc-900 rounded-xl shadow-lg p-10">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-4xl font-bold text-white">Add New Project</h2>
          <button
            onClick={handleSignOut}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-black"
          >
            Sign Out
          </button>
        </div>

        <div className="flex md:flex-row-reverse gap-10">
          {/* Landing Slideshow Panel */}
          <div className="mb-10 p-6 rounded-xl bg-zinc-800 border border-zinc-700">
            <h3 className="text-2xl font-bold text-white mb-4">
              Landing Slideshow Images
            </h3>
            <div className="flex flex-wrap gap-4 mb-4">
              {landingImages.map((url, idx) => (
                <div
                  key={url + idx}
                  className="w-28 h-28 bg-zinc-900 rounded overflow-hidden flex items-center justify-center border border-zinc-700 relative"
                >
                  <img
                    src={url}
                    alt={`landing-${idx}`}
                    className="object-cover w-full h-full"
                  />
                  <button
                    onClick={() => handleRemoveLandingImage(idx)}
                    className="absolute top-1 right-1 bg-red-600 text-white text-xs px-1 rounded hover:bg-red-700"
                  >
                    X
                  </button>
                  <span className="absolute top-1 left-1 bg-black/60 text-xs text-white px-2 py-0.5 rounded">
                    {idx + 1}
                  </span>
                </div>
              ))}
            </div>

            <input
              type="file"
              accept="image/*"
              multiple
              ref={landingFileInputRef}
              onChange={handleLandingFileChange}
              className="block w-full text-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 mb-2"
              disabled={landingLoading}
            />
            {landingImages.length + landingUploadFiles.length >= 5 && (
              <div className="text-yellow-400 text-xs mt-1">
                Max 5 images reached. New uploads will replace images from the
                start.
              </div>
            )}
            <button
              type="button"
              onClick={handleSaveLandingImages}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 mt-2"
              disabled={
                landingLoading || landingUploadFiles.some((f) => !f.url)
              }
            >
              {landingLoading ? "Saving..." : "Save Slideshow Images"}
            </button>
            {landingError && (
              <div className="text-red-400 mt-2">{landingError}</div>
            )}
            {landingSuccess && (
              <div className="text-green-400 mt-2">{landingSuccess}</div>
            )}
            <div className="text-xs text-zinc-400 mt-2">
              Max 5 images. New uploads replace from the start.
            </div>
          </div>

          {/* Project Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Project Title"
              className="w-full p-3 border border-zinc-700 rounded bg-zinc-800 text-white placeholder-zinc-400"
              required
            />
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="Project Location"
              className="w-full p-3 border border-zinc-700 rounded bg-zinc-800 text-white placeholder-zinc-400"
              required
            />
            <input
              name="tags"
              value={form.tags}
              onChange={handleChange}
              placeholder="Tags (comma separated)"
              className="w-full p-3 border border-zinc-700 rounded bg-zinc-800 text-white placeholder-zinc-400"
            />
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full p-3 border border-zinc-700 rounded bg-zinc-800 text-white"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Project Description"
              className="w-full p-3 border border-zinc-700 rounded bg-zinc-800 text-white placeholder-zinc-400"
              rows={3}
            />
            <textarea
              name="approach"
              value={form.approach}
              onChange={handleChange}
              placeholder="Project Approach"
              className="w-full p-3 border border-zinc-700 rounded bg-zinc-800 text-white placeholder-zinc-400"
              rows={2}
            />
            <input
              name="catchline"
              value={form.catchline}
              onChange={handleChange}
              placeholder="Project Catchline"
              className="w-full p-3 border border-zinc-700 rounded bg-zinc-800 text-white placeholder-zinc-400"
            />
            <input
              type="file"
              accept="image/*"
              multiple
              ref={fileInputRef}
              onChange={handleFileChange}
              className="block w-full text-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
            />
            <div className="flex flex-wrap gap-2">
              {uploadFiles.map((f, idx) => (
                <div
                  key={f.file.name + idx}
                  className="w-24 h-24 bg-zinc-800 rounded overflow-hidden flex items-center justify-center border border-zinc-700 relative"
                >
                  <img
                    src={f.url || URL.createObjectURL(f.file)}
                    alt={f.file.name}
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute bottom-0 w-full text-center text-xs text-white bg-black/50">
                    {f.error ? "Error" : `${f.progress}%`}
                  </div>
                </div>
              ))}
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-green-600 text-white rounded hover:bg-green-700"
            >
              {loading ? "Saving..." : "Save Project"}
            </button>
            {error && <div className="text-red-400 mt-2">{error}</div>}
            {success && <div className="text-green-400 mt-2">{success}</div>}
          </form>
        </div>
      </div>
    </div>
  );
}
