"use client";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";

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
          const userDoc = await getDoc(doc(db, "Students", user.uid));
          if (userDoc.exists()) {
            setUserData({ uid: user.uid, ...userDoc.data() });
          } else {
            setUserData({ uid: user.uid, email: user.email ?? undefined });
          }
        } catch (err: any) {
          setError(err?.message || "Failed to fetch user profile");
          setUserData({ uid: user.uid, email: user.email ?? undefined });
        }
      } else {
        setUserData(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [refreshKey]);

  return { userData, loading, error };
}
