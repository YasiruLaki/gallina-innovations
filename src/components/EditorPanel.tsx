"use client";
/* eslint-disable @next/next/no-img-element */
import React, { useState, useRef, useEffect } from "react";
import { auth, db } from "../firebaseConfig";
import {
  signOut,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { collection, addDoc, doc, getDoc, setDoc } from "firebase/firestore";

const categories = ["Residential", "Hospitality", "Commercial"];

type UploadFile = {
  file: File;
  progress: number;
  url?: string;
  error?: string;
};

export default function EditorPanel() {
  const [user, setUser] = useState(auth.currentUser);

  // Project type toggle
  const [projectType, setProjectType] = useState<"done" | "proposed">("done");

  // Done project form state
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

  // Proposed project form state
  const [proposedForm, setProposedForm] = useState({
    title: "",
    category: categories[0],
    imageUrls: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");

  // Done project image uploads
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Proposed project image uploads
  const [proposedUploadFiles, setProposedUploadFiles] = useState<UploadFile[]>([]);
  const proposedFileInputRef = useRef<HTMLInputElement | null>(null);

  // Landing slideshow state
  const [landingImages, setLandingImages] = useState<string[]>([]);
  const [landingUploadFiles, setLandingUploadFiles] = useState<UploadFile[]>(
    []
  );
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
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
  const uploadFile = (f: UploadFile, onComplete: (url?: string) => void, type: 'done' | 'proposed' | 'landing') => {
    const formData = new FormData();
    formData.append("image", f.file);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "https://cdn.gallinainnovations.com/upload");

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 100);
        if (type === 'done') {
          setUploadFiles((prev) =>
            prev.map((uf) =>
              uf.file === f.file ? { ...uf, progress: percent } : uf
            )
          );
        } else if (type === 'proposed') {
          setProposedUploadFiles((prev) =>
            prev.map((uf) =>
              uf.file === f.file ? { ...uf, progress: percent } : uf
            )
          );
        } else if (type === 'landing') {
          setLandingUploadFiles((prev) =>
            prev.map((uf) =>
              uf.file === f.file ? { ...uf, progress: percent } : uf
            )
          );
        }
      }
    };

    xhr.onload = () => {
      const data = JSON.parse(xhr.responseText);
      if (xhr.status === 200 && data.url) {
        onComplete(data.url);
        if (type === 'done') {
          setUploadFiles((prev) =>
            prev.map((uf) =>
              uf.file === f.file ? { ...uf, url: data.url, progress: 100 } : uf
            )
          );
        } else if (type === 'proposed') {
          setProposedUploadFiles((prev) =>
            prev.map((uf) =>
              uf.file === f.file ? { ...uf, url: data.url, progress: 100 } : uf
            )
          );
        } else if (type === 'landing') {
          setLandingUploadFiles((prev) =>
            prev.map((uf) =>
              uf.file === f.file ? { ...uf, url: data.url, progress: 100 } : uf
            )
          );
        }
      } else {
        const errMsg = data.error || xhr.statusText || "Upload failed";
        if (type === 'done') {
          setUploadFiles((prev) =>
            prev.map((uf) =>
              uf.file === f.file ? { ...uf, error: errMsg, progress: 0 } : uf
            )
          );
        } else if (type === 'proposed') {
          setProposedUploadFiles((prev) =>
            prev.map((uf) =>
              uf.file === f.file ? { ...uf, error: errMsg, progress: 0 } : uf
            )
          );
        } else if (type === 'landing') {
          setLandingUploadFiles((prev) =>
            prev.map((uf) =>
              uf.file === f.file ? { ...uf, error: errMsg, progress: 0 } : uf
            )
          );
        }
      }
    };

    xhr.onerror = () => {
      if (type === 'done') {
        setUploadFiles((prev) =>
          prev.map((uf) =>
            uf.file === f.file
              ? { ...uf, error: "Upload failed", progress: 0 }
              : uf
          )
        );
      } else if (type === 'proposed') {
        setProposedUploadFiles((prev) =>
          prev.map((uf) =>
            uf.file === f.file
              ? { ...uf, error: "Upload failed", progress: 0 }
              : uf
          )
        );
      } else if (type === 'landing') {
        setLandingUploadFiles((prev) =>
          prev.map((uf) =>
            uf.file === f.file
              ? { ...uf, error: "Upload failed", progress: 0 }
              : uf
          )
        );
      }
    };

    xhr.send(formData);
  };

  // Handle done project files
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
      }, 'done')
    );
  };

  // Handle proposed project files
  const handleProposedFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles = Array.from(files).map((file) => ({ file, progress: 0 }));
    setProposedUploadFiles((prev) => [...prev, ...newFiles]);
    newFiles.forEach((f) =>
      uploadFile(f, (url) => {
        if (url) {
          setProposedForm((prev) => {
            const urls = [...prev.imageUrls.split(",").filter(Boolean), url];
            return { ...prev, imageUrls: urls.join(",") };
          });
        }
      }, 'proposed')
    );
  };

  const handleLandingFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const remainingSlots = 6 - landingImages.length - landingUploadFiles.length;
    if (remainingSlots <= 0) {
      setLandingError("Maximum 6 images reached. Delete images to add new ones.");
      return;
    }

    const newFiles = Array.from(files)
      .slice(0, remainingSlots)
      .map((file) => ({ file, progress: 0 }));

    setLandingUploadFiles((prev) => [...prev, ...newFiles]);
    setLandingError("");

    newFiles.forEach((f) => {
      uploadFile(f, (url) => {
        // Just update the upload progress, don't add to landingImages yet
      }, 'landing');
    });
  };

  // Remove landing image
  const handleRemoveLandingImage = (index: number) => {
    setLandingImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Drag handlers for reordering
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (targetIndex: number) => {
    if (draggedIndex === null || draggedIndex === targetIndex) return;
    
    const newImages = [...landingImages];
    const draggedImage = newImages[draggedIndex];
    newImages.splice(draggedIndex, 1);
    newImages.splice(targetIndex, 0, draggedImage);
    setLandingImages(newImages);
    setDraggedIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  // Save landing images to Firestore
  const handleSaveLandingImages = async () => {
    setLandingLoading(true);
    setLandingError("");
    setLandingSuccess("");
    try {
      // Get all uploaded URLs from landingUploadFiles
      const newUploadedUrls = landingUploadFiles
        .filter((f) => f.url)
        .map((f) => f.url!);

      // Merge existing images with newly uploaded ones, maintaining order
      const updatedImages = [...landingImages, ...newUploadedUrls].slice(0, 6);

      const ref = doc(db, "siteSettings", "landing");
      await setDoc(ref, { images: updatedImages }, { merge: false }); // Rewrite the entire array
      
      // Update local state with the saved images
      setLandingImages(updatedImages);
      setLandingUploadFiles([]); // Clear upload files after saving
      if (landingFileInputRef.current) {
        landingFileInputRef.current.value = ""; // Reset file input
      }
      
      setLandingSuccess("Landing images saved successfully!");
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
  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      setUser(result.user);
      setSuccess("Logged in successfully!");
    } catch (err: unknown) {
      if (typeof err === 'object' && err !== null && 'message' in err) {
        setError((err as { message?: string }).message || "Login failed");
      } else {
        setError("Login failed");
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, resetEmail);
      setSuccess("Password reset email sent! Check your inbox.");
      setResetEmail("");
      setTimeout(() => {
        setShowResetPassword(false);
      }, 2000);
    } catch (err: unknown) {
      if (typeof err === 'object' && err !== null && 'message' in err) {
        setError((err as { message?: string }).message || "Failed to send reset email");
      } else {
        setError("Failed to send reset email");
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

  const handleProposedChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) => {
    setProposedForm({ ...proposedForm, [e.target.name]: e.target.value });
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

  const handleProposedSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const imageUrlsArr = proposedForm.imageUrls
        .split(",")
        .map((u) => u.trim())
        .filter(Boolean);

      await addDoc(collection(db, "proposed"), {
        title: proposedForm.title,
        category: proposedForm.category,
        imageUrls: imageUrlsArr,
        createdBy: user?.email || "anonymous",
        createdAt: new Date().toISOString(),
      });

      setSuccess("Proposed project added successfully!");
      setProposedForm({
        title: "",
        category: categories[0],
        imageUrls: "",
      });
      setProposedUploadFiles([]);
    } catch (err: unknown) {
      if (typeof err === 'object' && err !== null && 'message' in err) {
        setError((err as { message?: string }).message || 'Proposed project add failed');
      } else {
        setError('Proposed project add failed');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black px-4">
        <div className="w-full max-w-md">
          {/* Logo/Header */}
          <div className="text-center mb-8">
            <div className="inline-block p-4 bg-zinc-800 rounded-2xl mb-4 shadow-2xl">
              <span className="text-4xl">🔐</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2">Admin Login</h2>
            <p className="text-zinc-400 text-sm">Sign in to access the admin panel</p>
          </div>

          {/* Login Card */}
          <div className="bg-zinc-900/80 backdrop-blur-sm rounded-2xl shadow-2xl p-6 sm:p-8 border border-zinc-800">
            {!showResetPassword ? (
              <>
                <form onSubmit={handleEmailAuth} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">Email</label>
                    <input
                      type="email"
                      placeholder="admin@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full p-3 sm:p-4 border border-zinc-700 rounded-xl bg-zinc-800/50 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all duration-200"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">Password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full p-3 sm:p-4 border border-zinc-700 rounded-xl bg-zinc-800/50 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all duration-200"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 sm:py-4 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-lg transform hover:scale-105"
                    disabled={loading}
                  >
                    {loading ? "⏳ Logging in..." : "🔓 Log In"}
                  </button>
                </form>

                <button
                  onClick={() => {
                    setShowResetPassword(true);
                    setError("");
                    setSuccess("");
                  }}
                  className="mt-6 w-full text-sm text-blue-400 hover:text-blue-300 transition-colors duration-200 underline"
                >
                  Forgot Password?
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    setShowResetPassword(false);
                    setError("");
                    setSuccess("");
                    setResetEmail("");
                  }}
                  className="mb-4 text-sm text-zinc-400 hover:text-white transition-colors duration-200 flex items-center gap-2"
                >
                  ← Back to Login
                </button>
                
                <form onSubmit={handlePasswordReset} className="space-y-4">
                  <p className="text-sm text-zinc-400 mb-4">
                    Enter your email address and we'll send you a link to reset your password.
                  </p>
                  
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">Email Address</label>
                    <input
                      type="email"
                      placeholder="admin@example.com"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      className="w-full p-3 sm:p-4 border border-zinc-700 rounded-xl bg-zinc-800/50 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all duration-200"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 sm:py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-lg transform hover:scale-105"
                    disabled={loading}
                  >
                    {loading ? "⏳ Sending..." : "📧 Send Reset Link"}
                  </button>
                </form>
              </>
            )}

            {error && (
              <div className="mt-4 p-4 bg-red-400/10 border border-red-400/20 rounded-xl text-red-400 text-sm text-center animate-pulse">
                {error}
              </div>
            )}
            {success && (
              <div className="mt-4 p-4 bg-green-400/10 border border-green-400/20 rounded-xl text-green-400 text-sm text-center">
                {success}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="text-center mt-6 text-xs text-zinc-500">
            Protected Admin Area • Gallina Innovations
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black py-4 px-4 sm:py-8 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-zinc-900/80 backdrop-blur-sm rounded-2xl shadow-2xl p-4 sm:p-6 lg:p-8 mb-4 sm:mb-6 border border-zinc-800">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-1">Admin Panel</h2>
              <p className="text-sm text-zinc-400">Manage projects and content</p>
            </div>
            <button
              onClick={handleSignOut}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg text-sm sm:text-base"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Project Type Toggle */}
        <div className="bg-zinc-900/80 backdrop-blur-sm rounded-2xl shadow-2xl p-4 sm:p-6 mb-4 sm:mb-6 border border-zinc-800">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
            <span className="text-white font-semibold text-sm sm:text-base">Project Type:</span>
            <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
              <button
                onClick={() => setProjectType("done")}
                className={`flex-1 sm:flex-none px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg font-medium transition-all duration-300 transform text-sm sm:text-base ${
                  projectType === "done"
                    ? "bg-green-600 text-white shadow-lg shadow-green-600/50 scale-105"
                    : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                }`}
              >
                Done Project
              </button>
              <button
                onClick={() => setProjectType("proposed")}
                className={`flex-1 sm:flex-none px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg font-medium transition-all duration-300 transform text-sm sm:text-base ${
                  projectType === "proposed"
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/50 scale-105"
                    : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                }`}
              >
                Proposed Project
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
          {/* Landing Slideshow Panel */}
          <div className="lg:w-80 xl:w-96 order-first lg:order-last">
            <div className="bg-zinc-900/80 backdrop-blur-sm rounded-2xl shadow-2xl p-4 sm:p-6 border border-zinc-800 sticky top-4">
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">
                Landing Slideshow
              </h3>
              
              {/* Image Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-3 mb-4">
                {/* Existing saved images */}
                {landingImages.map((url, idx) => (
                  <div
                    key={url + idx}
                    draggable
                    onDragStart={() => handleDragStart(idx)}
                    onDragOver={handleDragOver}
                    onDrop={() => handleDrop(idx)}
                    onDragEnd={handleDragEnd}
                    className={`aspect-square bg-zinc-800 rounded-xl overflow-hidden flex items-center justify-center border border-zinc-700 relative group transition-all duration-200 ${
                      draggedIndex === idx
                        ? "opacity-50 scale-95 border-yellow-500"
                        : "hover:scale-105 cursor-move"
                    }`}
                  >
                    <img
                      src={url}
                      alt={`landing-${idx}`}
                      className="object-cover w-full h-full pointer-events-none"
                    />
                    <button
                      onClick={() => handleRemoveLandingImage(idx)}
                      className="absolute top-2 right-2 bg-red-600 text-white text-xs p-1.5 rounded-lg hover:bg-red-700 transition-all duration-200 opacity-0 group-hover:opacity-100 shadow-lg"
                    >
                      ✕
                    </button>
                    <span className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm text-xs text-white px-2 py-1 rounded-lg font-medium">
                      {idx + 1}
                    </span>
                    <span className="absolute bottom-2 left-2 bg-blue-600/80 backdrop-blur-sm text-xs text-white px-2 py-1 rounded-lg font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      🔄 Drag
                    </span>
                  </div>
                ))}
                {/* Uploading files preview */}
                {landingUploadFiles.map((f, idx) => (
                  <div
                    key={f.file.name + idx}
                    className="aspect-square bg-zinc-800 rounded-xl overflow-hidden flex items-center justify-center border border-yellow-600 relative group transition-transform duration-200"
                  >
                    <img
                      src={URL.createObjectURL(f.file)}
                      alt={f.file.name}
                      className="object-cover w-full h-full"
                    />
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <span className="text-white text-xs font-bold">
                        {f.error ? "❌" : f.url ? "✓" : `${f.progress}%`}
                      </span>
                    </div>
                    <span className="absolute top-2 left-2 bg-yellow-600/90 backdrop-blur-sm text-xs text-white px-2 py-1 rounded-lg font-medium">
                      {landingImages.length + idx + 1}
                    </span>
                  </div>
                ))}
              </div>

              {/* File Input */}
              <div className="mb-4">
                {landingImages.length + landingUploadFiles.length >= 6 ? (
                  <div className="border-2 border-dashed border-red-500/50 rounded-xl p-4 text-center bg-red-500/5">
                    <div className="text-red-400 text-sm">
                      <span className="block mb-1 text-lg">🚫</span>
                      <span className="block font-medium">Maximum 6 images reached</span>
                      <span className="block text-xs mt-1">Delete one or more images to add new ones</span>
                    </div>
                  </div>
                ) : (
                  <label className="block w-full cursor-pointer">
                    <div className="border-2 border-dashed border-zinc-700 rounded-xl p-4 hover:border-green-600 transition-colors duration-200 text-center">
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        ref={landingFileInputRef}
                        onChange={handleLandingFileChange}
                        className="hidden"
                        disabled={landingLoading}
                      />
                      <div className="text-zinc-400 text-sm">
                        <span className="block mb-1">📁</span>
                        <span className="block font-medium">Click to upload images</span>
                        <span className="block text-xs mt-1">
                          {6 - landingImages.length - landingUploadFiles.length} slot(s) available
                        </span>
                      </div>
                    </div>
                  </label>
                )}
              </div>

              {/* Save Button */}
              <button
                type="button"
                onClick={handleSaveLandingImages}
                disabled={landingLoading || landingUploadFiles.some((f) => !f.url)}
                className="w-full py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-lg transform hover:scale-105 text-sm sm:text-base"
              >
                {landingLoading ? "Saving..." : "💾 Save Slideshow"}
              </button>

              {/* Messages */}
              {landingError && (
                <div className="mt-3 text-red-400 text-xs bg-red-400/10 p-3 rounded-lg animate-pulse">
                  ❌ {landingError}
                </div>
              )}
              {landingSuccess && (
                <div className="mt-3 text-green-400 text-xs bg-green-400/10 p-3 rounded-lg">
                  ✓ {landingSuccess}
                </div>
              )}
            </div>
          </div>

          {/* Main Form Content */}
          <div className="flex-1">
            {projectType === "done" ? (
              <form onSubmit={handleSubmit} className="bg-zinc-900/80 backdrop-blur-sm rounded-2xl shadow-2xl p-4 sm:p-6 lg:p-8 border border-zinc-800">
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-6">Add Done Project</h3>
                
                <div className="space-y-4">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">Project Title *</label>
                    <input
                      name="title"
                      value={form.title}
                      onChange={handleChange}
                      placeholder="Enter project title"
                      className="w-full p-3 sm:p-4 border border-zinc-700 rounded-xl bg-zinc-800/50 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                      required
                    />
                  </div>

                  {/* Location and Category Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-zinc-400 mb-2">Location *</label>
                      <input
                        name="location"
                        value={form.location}
                        onChange={handleChange}
                        placeholder="Project location"
                        className="w-full p-3 sm:p-4 border border-zinc-700 rounded-xl bg-zinc-800/50 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-400 mb-2">Category *</label>
                      <select
                        name="category"
                        value={form.category}
                        onChange={handleChange}
                        className="w-full p-3 sm:p-4 border border-zinc-700 rounded-xl bg-zinc-800/50 text-white focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                      >
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">Tags</label>
                    <input
                      name="tags"
                      value={form.tags}
                      onChange={handleChange}
                      placeholder="tag1, tag2, tag3"
                      className="w-full p-3 sm:p-4 border border-zinc-700 rounded-xl bg-zinc-800/50 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                    />
                  </div>

                  {/* Catchline */}
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">Catchline</label>
                    <input
                      name="catchline"
                      value={form.catchline}
                      onChange={handleChange}
                      placeholder="Brief project catchline"
                      className="w-full p-3 sm:p-4 border border-zinc-700 rounded-xl bg-zinc-800/50 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">Description</label>
                    <textarea
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      placeholder="Detailed project description"
                      className="w-full p-3 sm:p-4 border border-zinc-700 rounded-xl bg-zinc-800/50 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all duration-200 resize-none text-sm sm:text-base"
                      rows={4}
                    />
                  </div>

                  {/* Approach */}
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">Approach</label>
                    <textarea
                      name="approach"
                      value={form.approach}
                      onChange={handleChange}
                      placeholder="Project approach and methodology"
                      className="w-full p-3 sm:p-4 border border-zinc-700 rounded-xl bg-zinc-800/50 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all duration-200 resize-none text-sm sm:text-base"
                      rows={3}
                    />
                  </div>

                  {/* File Upload */}
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">Project Images</label>
                    <label className="block cursor-pointer">
                      <div className="border-2 border-dashed border-zinc-700 rounded-xl p-6 hover:border-green-600 transition-colors duration-200 text-center bg-zinc-800/30">
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          ref={fileInputRef}
                          onChange={handleFileChange}
                          className="hidden"
                        />
                        <div className="text-zinc-400 text-sm">
                          <span className="block text-2xl mb-2">📸</span>
                          <span className="block font-medium">Click to upload images</span>
                          <span className="block text-xs mt-1">Multiple files supported</span>
                        </div>
                      </div>
                    </label>
                  </div>

                  {/* Image Preview Grid */}
                  {uploadFiles.length > 0 && (
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
                      {uploadFiles.map((f, idx) => (
                        <div
                          key={f.file.name + idx}
                          className="aspect-square bg-zinc-800 rounded-xl overflow-hidden flex items-center justify-center border border-zinc-700 relative group"
                        >
                          <img
                            src={f.url || URL.createObjectURL(f.file)}
                            alt={f.file.name}
                            className="object-cover w-full h-full"
                          />
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <span className="text-white text-xs font-bold">
                              {f.error ? "❌" : `${f.progress}%`}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 sm:py-4 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-lg transform hover:scale-105 text-sm sm:text-base"
                  >
                    {loading ? "⏳ Saving..." : "💾 Save Done Project"}
                  </button>

                  {/* Messages */}
                  {error && (
                    <div className="text-red-400 text-sm bg-red-400/10 p-4 rounded-xl animate-pulse">
                      ❌ {error}
                    </div>
                  )}
                  {success && (
                    <div className="text-green-400 text-sm bg-green-400/10 p-4 rounded-xl">
                      ✓ {success}
                    </div>
                  )}
                </div>
              </form>
            ) : (
              <form onSubmit={handleProposedSubmit} className="bg-zinc-900/80 backdrop-blur-sm rounded-2xl shadow-2xl p-4 sm:p-6 lg:p-8 border border-zinc-800">
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-6">Add Proposed Project</h3>
                
                <div className="space-y-4">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">Project Title *</label>
                    <input
                      name="title"
                      value={proposedForm.title}
                      onChange={handleProposedChange}
                      placeholder="Enter proposed project title"
                      className="w-full p-3 sm:p-4 border border-zinc-700 rounded-xl bg-zinc-800/50 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                      required
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">Category *</label>
                    <select
                      name="category"
                      value={proposedForm.category}
                      onChange={handleProposedChange}
                      className="w-full p-3 sm:p-4 border border-zinc-700 rounded-xl bg-zinc-800/50 text-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  {/* File Upload */}
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">Project Images</label>
                    <label className="block cursor-pointer">
                      <div className="border-2 border-dashed border-zinc-700 rounded-xl p-6 hover:border-blue-600 transition-colors duration-200 text-center bg-zinc-800/30">
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          ref={proposedFileInputRef}
                          onChange={handleProposedFileChange}
                          className="hidden"
                        />
                        <div className="text-zinc-400 text-sm">
                          <span className="block text-2xl mb-2">📸</span>
                          <span className="block font-medium">Click to upload images</span>
                          <span className="block text-xs mt-1">Multiple files supported</span>
                        </div>
                      </div>
                    </label>
                  </div>

                  {/* Image Preview Grid */}
                  {proposedUploadFiles.length > 0 && (
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
                      {proposedUploadFiles.map((f, idx) => (
                        <div
                          key={f.file.name + idx}
                          className="aspect-square bg-zinc-800 rounded-xl overflow-hidden flex items-center justify-center border border-zinc-700 relative group"
                        >
                          <img
                            src={f.url || URL.createObjectURL(f.file)}
                            alt={f.file.name}
                            className="object-cover w-full h-full"
                          />
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <span className="text-white text-xs font-bold">
                              {f.error ? "❌" : `${f.progress}%`}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 sm:py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-lg transform hover:scale-105 text-sm sm:text-base"
                  >
                    {loading ? "⏳ Saving..." : "💾 Save Proposed Project"}
                  </button>

                  {/* Messages */}
                  {error && (
                    <div className="text-red-400 text-sm bg-red-400/10 p-4 rounded-xl animate-pulse">
                      ❌ {error}
                    </div>
                  )}
                  {success && (
                    <div className="text-green-400 text-sm bg-green-400/10 p-4 rounded-xl">
                      ✓ {success}
                    </div>
                  )}
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
