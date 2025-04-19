"use client";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";

export interface UserProfile {
  uid?: string;
  name?: string;
  username?: string;
  email?: string;
  college?: string;
  collegeId?: string;
  regNo?: string;
  avatar?: string;
  default_avatar?: string;
  year?: string;
  branch?: string;
  bio?: string;
  location?: string;
  joinedDate?: string;
  socialLinks?: {
    linkedin?: string;
    github?: string;
    instagram?: string;
  };
  stats?: {
    points?: number;
    rank?: number;
    eventsParticipated?: number;
    quizzesTaken?: number;
    discussionsCreated?: number;
    badges?: number;
  };
}

export function useUserProfile(refreshKey = 0) {
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const res = await fetch(`/api/profile?uid=${user.uid}`);
          if (!res.ok) throw new Error("Failed to fetch profile");
          const data = await res.json();
          setUserData({ ...data, uid: user.uid });
        } catch (e: any) {
          setError(e.message || "Failed to load profile");
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [refreshKey]);

  return { userData, loading, error };
}
