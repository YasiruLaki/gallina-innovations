"use client";
import React, { useState } from "react";
import { auth, db } from "../firebaseConfig";
import { GoogleAuthProvider, signInWithPopup, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";

const categories = ["Residential", "Industrial", "Landscape"];

export default function EditorPanel() {
  const [user, setUser] = useState(auth.currentUser);
  const [form, setForm] = useState({
    title: "",
    location: "",
    tags: "",
    category: categories[0],
    description: "",
    approach: "",
    catchline: "",
    clientFeedback: "",
    imageUrls: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);

  // Auth handlers
  const handleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
    } catch (err) {
      if (err instanceof Error) setError(err.message);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      let result;
      if (isSignUp) {
        result = await createUserWithEmailAndPassword(auth, email, password);
      } else {
        result = await signInWithEmailAndPassword(auth, email, password);
      }
      setUser(result.user);
    } catch (err) {
      if (err instanceof Error) setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
    setUser(null);
  };

  // Form handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      // Prepare tags and imageUrls as arrays
      const tagsArr = form.tags.split(",").map((t) => t.trim()).filter(Boolean);
      const imageUrlsArr = form.imageUrls.split(",").map((u) => u.trim()).filter(Boolean);
      await addDoc(collection(db, "projects"), {
        title: form.title,
        location: form.location,
        tags: tagsArr,
        category: form.category,
        description: form.description,
        approach: form.approach,
        catchline: form.catchline,
        clientFeedback: form.clientFeedback,
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
        clientFeedback: "",
        imageUrls: "",
      });
    } catch (err) {
      if (err instanceof Error) setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Listen for auth state changes
  React.useEffect(() => {
    const unsub = auth.onAuthStateChanged((u) => setUser(u));
    return () => unsub();
  }, []);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black">
        <div className="w-full max-w-sm bg-zinc-900 rounded-xl shadow-lg p-8 flex flex-col items-center">
          <h2 className="text-3xl mb-6 text-white">Editor Login</h2>
          <form onSubmit={handleEmailAuth} className="flex flex-col gap-4 w-full">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="p-3 border border-zinc-700 rounded bg-zinc-800 text-white placeholder-zinc-400"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="p-3 border border-zinc-700 rounded bg-zinc-800 text-white placeholder-zinc-400"
              required
            />
            <button
              type="submit"
              className="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700"
              disabled={loading}
            >
              {loading ? (isSignUp ? "Signing up..." : "Logging in...") : (isSignUp ? "Sign Up" : "Log In")}
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
            {isSignUp ? "Already have an account? Log In" : "Don't have an account? Sign Up"}
          </button>
          {error && <p className="text-red-500 mt-4 w-full text-center">{error}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-full max-w-2xl bg-zinc-900 rounded-xl shadow-lg p-10">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-4xl font-bold text-white">Add New Project</h2>
          <button
            onClick={handleSignOut}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-black"
          >
            Sign Out
          </button>
        </div>
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
              <option key={cat} value={cat}>{cat}</option>
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
          <textarea
            name="clientFeedback"
            value={form.clientFeedback}
            onChange={handleChange}
            placeholder="Client Feedback"
            className="w-full p-3 border border-zinc-700 rounded bg-zinc-800 text-white placeholder-zinc-400"
            rows={2}
          />
          <input
            name="imageUrls"
            value={form.imageUrls}
            onChange={handleChange}
            placeholder="Image URLs (comma separated)"
            className="w-full p-3 border border-zinc-700 rounded bg-zinc-800 text-white placeholder-zinc-400"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-green-600 text-white rounded hover:bg-green-700"
          >
            {loading ? "Saving..." : "Add Project"}
          </button>
          {success && <p className="text-green-600 mt-2">{success}</p>}
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </form>
      </div>
    </div>
  );
}
