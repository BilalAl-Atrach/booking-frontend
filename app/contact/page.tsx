"use client";
import { useState } from "react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Message sent! (You can hook this to your backend)");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:py-20">
        {/* Header */}
        <h2 className="text-3xl sm:text-5xl font-bold text-center mb-6 sm:mb-12 animate-fadeInUp">
          Get in <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Touch</span>
        </h2>
        <p className="text-center text-slate-300 mb-10 sm:mb-16 max-w-2xl mx-auto">
          Have questions, feedback, or need support? We’d love to hear from you. Fill out the form below and our team will get back to you.
        </p>

        {/* Contact Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-slate-800/70 backdrop-blur-md rounded-2xl shadow-2xl p-5 sm:p-10 border border-slate-700/50 transform hover:scale-[1.02] transition-transform duration-500"
        >
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-slate-900/50 border border-slate-700 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500 outline-none transition"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-slate-900/50 border border-slate-700 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500 outline-none transition"
              required
            />
          </div>
          <textarea
            name="message"
            placeholder="Your Message"
            value={formData.message}
            onChange={handleChange}
            rows={6}
            className="w-full px-4 py-3 rounded-lg bg-slate-900/50 border border-slate-700 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500 outline-none transition mb-6"
            required
          ></textarea>
          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 font-semibold text-white transition transform hover:scale-105"
          >
            Send Message
          </button>
        </form>

        {/* Contact Info */}
        <div className="mt-10 sm:mt-16 text-center space-y-4 text-sm sm:text-base">
          <p className="text-slate-400">📍 Beirut, Lebanon</p>
          <p className="text-slate-400">📞 +961 81020427</p>
          <p className="text-slate-400">✉️ support@bookai.com</p>
        </div>
      </div>
    </div>
  );
}
