"use client";
import { useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { auth } from "@/lib/firebase";

interface EditProfileDialogProps {
  userData: any;
  onProfileUpdated: () => void;
}

export default function EditProfileDialog({ userData, onProfileUpdated }: EditProfileDialogProps) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    username: userData.username || "",
    college: userData.college || "",
    year: userData.year || "",
    branch: userData.branch || "",
    bio: userData.bio || "",
    location: userData.location || "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("User not authenticated");
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid: user.uid, ...form }),
      });
      if (!res.ok) throw new Error("Failed to update profile");
      setSuccess("Profile updated!");
      onProfileUpdated();
      setOpen(false);
    } catch (err: any) {
      setError(err.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="absolute top-4 right-4">
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="Name"
            required
          />
          <Input
            name="college"
            value={form.college}
            onChange={handleChange}
            placeholder="College"
            required
          />
          <Input
            name="year"
            value={form.year}
            onChange={handleChange}
            placeholder="Year"
          />
          <Input
            name="branch"
            value={form.branch}
            onChange={handleChange}
            placeholder="Branch"
          />
          <Input
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="Location"
          />
          <Textarea
            name="bio"
            value={form.bio}
            onChange={handleChange}
            placeholder="Bio"
            rows={3}
          />
          {error && <div className="text-red-500 text-sm">{error}</div>}
          {success && <div className="text-green-600 text-sm">{success}</div>}
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
