"use client";

import { Bell, Key, Shield, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState, ChangeEvent } from "react";
import { db, auth } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";

export default function SettingsPage() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState({ name: "", email: "", bio: "", avatar: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        const docRef = doc(db, "Students", firebaseUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setProfile({
            name: data.name || "",
            email: data.email || firebaseUser.email || "",
            bio: data.bio || "",
            avatar: data.avatar || ""
          });
        } else {
          setProfile({
            name: firebaseUser.displayName || "",
            email: firebaseUser.email || "",
            bio: "",
            avatar: firebaseUser.photoURL || ""
          });
        }
        setLoading(false);
      } else {
        setUser(null);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setProfile({ ...profile, [e.target.id]: e.target.value });

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const docRef = doc(db, "Students", user.uid);
    await updateDoc(docRef, { name: profile.name, bio: profile.bio });
    setSaving(false);
    alert("Profile updated!");
  };

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex h-16 items-center gap-4 border-b bg-background px-6">
        <SidebarTrigger />
        <div>
          <h1 className="font-semibold">Settings</h1>
          <p className="text-xs text-muted-foreground">Manage your account settings and preferences</p>
        </div>
      </header>

      <main className="flex-1 p-6 md:p-10">
        <div className="mx-auto max-w-5xl">
          <Tabs defaultValue="profile" className="w-full">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="sm:w-1/4">
                <TabsList className="flex flex-col h-auto p-0 bg-transparent">
                  <TabsTrigger value="profile" className="justify-start px-4 py-2 h-10 data-[state=active]:bg-muted">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </TabsTrigger>
                  <TabsTrigger value="account" className="justify-start px-4 py-2 h-10 data-[state=active]:bg-muted">
                    <Key className="mr-2 h-4 w-4" />
                    Account
                  </TabsTrigger>
                  <TabsTrigger value="notifications" className="justify-start px-4 py-2 h-10 data-[state=active]:bg-muted">
                    <Bell className="mr-2 h-4 w-4" />
                    Notifications
                  </TabsTrigger>
                  <TabsTrigger value="privacy" className="justify-start px-4 py-2 h-10 data-[state=active]:bg-muted">
                    <Shield className="mr-2 h-4 w-4" />
                    Privacy
                  </TabsTrigger>
                </TabsList>
              </div>

              <div className="sm:w-3/4">
                <TabsContent value="profile" className="mt-0">
                  <Card>
                    <CardHeader>
                      <CardTitle>Profile Settings</CardTitle>
                      <CardDescription>
                        Update your profile information and how it appears to others
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                          <div className="sm:w-1/3">
                            <Label htmlFor="avatar">Profile Picture</Label>
                          </div>
                          <div className="sm:w-2/3 flex items-center gap-4">
                            <Avatar className="h-16 w-16">
                              <AvatarImage src={profile.avatar || "/placeholder.svg?height=64&width=64"} alt="Profile" />
                              <AvatarFallback>{profile.name ? profile.name.split(" ").map(n => n[0]).join("") : "U"}</AvatarFallback>
                            </Avatar>
                            {/* Avatar upload/change can be implemented here */}
                          </div>
                        </div>

                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                          <div className="sm:w-1/3">
                            <Label htmlFor="name">Full Name</Label>
                          </div>
                          <div className="sm:w-2/3">
                            <Input id="name" value={profile.name} onChange={handleChange} />
                          </div>
                        </div>

                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                          <div className="sm:w-1/3">
                            <Label htmlFor="email">Email</Label>
                          </div>
                          <div className="sm:w-2/3">
                            <Input id="email" value={profile.email} disabled />
                          </div>
                        </div>

                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start">
                          <div className="sm:w-1/3">
                            <Label htmlFor="bio">Bio</Label>
                          </div>
                          <div className="sm:w-2/3">
                            <Textarea
                              id="bio"
                              value={profile.bio}
                              onChange={handleChange}
                              rows={3}
                            />
                          </div>
                        </div>
                        <div className="flex justify-end">
                          <Button onClick={handleSave} disabled={saving}>
                            {saving ? "Saving..." : "Save Changes"}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </div>
            </div>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
