"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface BulletinPostDialogProps {
  onSubmit: (data: any) => Promise<void> | void;
  trigger: React.ReactNode;
  loading?: boolean;
  defaultAuthorName?: string;
  defaultAuthorAvatar?: string;
}

export default function BulletinPostDialog({
  onSubmit,
  trigger,
  loading = false,
  defaultAuthorName = "",
  defaultAuthorAvatar = "",
}: BulletinPostDialogProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!title.trim() || !content.trim()) {
      setError("All fields are required.");
      return;
    }
    setShowConfirm(true);
  };

  const handleConfirm = async () => {
    try {
      await onSubmit({
        title,
        content,
        author_name: defaultAuthorName,
        author_avatar: defaultAuthorAvatar,
        date: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }),
      });
      setOpen(false);
      setTitle("");
      setContent("");
      setError(null);
      setShowConfirm(false);
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to post bulletin.");
      setShowConfirm(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); setShowConfirm(false); }}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Post to Bulletin Board</DialogTitle>
          <DialogDescription>
            Fill out the form below to post a new bulletin. Only title and content are required.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            disabled={loading || showConfirm}
          />
          <Textarea
            placeholder="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            required
            disabled={loading || showConfirm}
          />
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading || showConfirm}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || showConfirm}>
              {loading ? "Posting..." : "Submit"}
            </Button>
          </DialogFooter>
        </form>
        {showConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg shadow-lg space-y-4 max-w-sm w-full">
              <div className="font-semibold text-lg">Are you sure you want to post a bulletin message?</div>
              <div className="flex gap-4 justify-end">
                <Button variant="outline" onClick={() => setShowConfirm(false)} disabled={loading}>Cancel</Button>
                <Button onClick={handleConfirm} disabled={loading}>Yes, Post</Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
