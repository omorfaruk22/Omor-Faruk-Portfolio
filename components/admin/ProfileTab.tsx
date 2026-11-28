"use client";
import { useEffect, useState } from "react";
import { Loader2, Save, User } from "lucide-react";
import { adminFetch } from "./api";
import {
  MediaUploadField,
  StringListEditor,
  inputCls,
  labelCls,
  textareaCls,
} from "./ui";
import type { PortfolioData, ProfileData } from "@/types/portfolio";

export default function ProfileTab({
  data,
  onDataChange,
  onNotify,
}: {
  data: PortfolioData;
  onDataChange: (next: PortfolioData) => void;
  onNotify: (type: "success" | "error" | "info", text: string) => void;
}) {
  const [form, setForm] = useState<ProfileData>(data.profile);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm(data.profile);
  }, [data.profile]);

  const setField = <K extends keyof ProfileData>(key: K, value: ProfileData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await adminFetch<PortfolioData>("/api/portfolio", {
        method: "PUT",
        body: JSON.stringify({ profile: form }),
      });
      onDataChange(updated);
      onNotify("success", "Profile & About information updated!");
    } catch (err) {
      onNotify("error", err instanceof Error ? err.message : "Failed to save profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="glass-card flex flex-col justify-between gap-4 border-brand/25 p-5 sm:flex-row sm:items-center">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-bold text-fg">
            <User size={18} className="text-brand" /> Profile, Bio &amp; Contact Info
          </h2>
          <p className="mt-1 text-xs text-muted">
            Updates Hero, About, Terminal, CodeEditor, Connect, Contact, Footer, Resume Modal &amp; SEO metadata.
          </p>
        </div>
        <button type="submit" disabled={saving} className="btn-primary shrink-0 font-mono !text-xs">
          {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
          Save Profile
        </button>
      </div>

      {/* Identity & Hero */}
      <div className="glass-card p-6">
        <h3 className="font-mono text-xs uppercase tracking-wider text-brand">
          Identity &amp; Hero Content
        </h3>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <label className={labelCls}>Full Name *</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setField("name", e.target.value)}
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Professional Title *</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => setField("title", e.target.value)}
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Current Status Headline</label>
            <input
              type="text"
              value={form.status}
              onChange={(e) => setField("status", e.target.value)}
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Status Subtitle</label>
            <input
              type="text"
              value={form.statusSubtitle}
              onChange={(e) => setField("statusSubtitle", e.target.value)}
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Hero Badge</label>
            <input
              type="text"
              value={form.heroBadge}
              onChange={(e) => setField("heroBadge", e.target.value)}
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Portfolio Version Badge</label>
            <input
              type="text"
              value={form.portfolioVersion}
              onChange={(e) => setField("portfolioVersion", e.target.value)}
              className={`${inputCls} font-mono text-xs`}
            />
          </div>
          <div className="md:col-span-2">
            <label className={labelCls}>Hero Tagline</label>
            <textarea
              rows={3}
              value={form.tagline}
              onChange={(e) => setField("tagline", e.target.value)}
              className={textareaCls}
            />
          </div>
        </div>
      </div>

      {/* Media: Profile Photo & Resume */}
      <div className="glass-card p-6">
        <h3 className="font-mono text-xs uppercase tracking-wider text-brand">
          Profile Photo &amp; Resume PDF
        </h3>
        <div className="mt-4 grid gap-6 md:grid-cols-2">
          <div>
            <label className={labelCls}>Profile Photo</label>
            <MediaUploadField
              value={form.photo}
              onChange={(url) => setField("photo", url)}
              kind="image"
              onNotify={onNotify}
            />
          </div>
          <div>
            <label className={labelCls}>Resume PDF</label>
            <MediaUploadField
              value={form.resumeUrl}
              onChange={(url) => setField("resumeUrl", url)}
              accept="application/pdf"
              kind="pdf"
              onNotify={onNotify}
            />
          </div>
        </div>
      </div>

      {/* About Bio */}
      <div className="glass-card p-6">
        <h3 className="font-mono text-xs uppercase tracking-wider text-brand">
          About Bio Paragraphs
        </h3>
        <p className="mt-1 text-xs text-muted">
          Each entry renders as a paragraph in your About section (the first paragraph also appears in your Resume).
        </p>
        <div className="mt-4">
          <StringListEditor
            items={form.bio}
            onChange={(bio) => setField("bio", bio)}
            multiline
            placeholder="Write a bio paragraph..."
            addLabel="Add paragraph"
          />
        </div>
      </div>

      {/* Contact, GitHub & SEO */}
      <div className="glass-card p-6">
        <h3 className="font-mono text-xs uppercase tracking-wider text-brand">
          Contact Details, GitHub &amp; SEO
        </h3>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <label className={labelCls}>Email Address</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setField("email", e.target.value)}
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>GitHub Username (for Contribution Chart)</label>
            <input
              type="text"
              value={form.githubUser}
              onChange={(e) => setField("githubUser", e.target.value)}
              className={`${inputCls} font-mono text-xs`}
            />
          </div>
          <div>
            <label className={labelCls}>Current Location</label>
            <input
              type="text"
              value={form.location}
              onChange={(e) => setField("location", e.target.value)}
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Permanent Address</label>
            <input
              type="text"
              value={form.permanentAddress}
              onChange={(e) => setField("permanentAddress", e.target.value)}
              className={inputCls}
            />
          </div>
          <div className="md:col-span-2">
            <label className={labelCls}>Phone Numbers</label>
            <StringListEditor
              items={form.phones}
              onChange={(phones) => setField("phones", phones)}
              placeholder="+8801XXXXXXXXX"
              addLabel="Add phone"
            />
          </div>
          <div>
            <label className={labelCls}>Site URL (SEO &amp; Sitemap)</label>
            <input
              type="url"
              value={form.siteUrl}
              onChange={(e) => setField("siteUrl", e.target.value)}
              className={`${inputCls} font-mono text-xs`}
            />
          </div>
          <div>
            <label className={labelCls}>Formspree Endpoint URL</label>
            <input
              type="url"
              value={form.formspreeUrl}
              onChange={(e) => setField("formspreeUrl", e.target.value)}
              className={`${inputCls} font-mono text-xs`}
            />
          </div>
          <div className="md:col-span-2">
            <label className={labelCls}>SEO Meta Description</label>
            <textarea
              rows={2}
              value={form.seoDescription}
              onChange={(e) => setField("seoDescription", e.target.value)}
              className={textareaCls}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button type="submit" disabled={saving} className="btn-primary !px-6 !py-3 font-mono">
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          Save All Profile Changes
        </button>
      </div>
    </form>
  );
}
