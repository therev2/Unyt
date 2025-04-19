"use client";
import { Award, Calendar, Edit, Mail, MapPin, MessageCircle, School, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import EditProfileDialog from "./EditProfileDialog";

interface UserProfile {
  name?: string;
  username?: string;
  email?: string;
  college?: string;
  regNo?: string;
  avatar?: string;
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

function useUserProfile(refreshKey = 0) {
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
          setUserData(data);
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


// Sample activity data
const activities = [
  {
    id: 1,
    type: "event",
    title: "Registered for National Hackathon 2023",
    date: "May 15, 2023",
    icon: <Calendar className="h-4 w-4" />,
  },
  {
    id: 2,
    type: "quiz",
    title: "Completed Tech Trivia Quiz with 85% score",
    date: "May 12, 2023",
    icon: <Award className="h-4 w-4" />,
  },
  {
    id: 3,
    type: "badge",
    title: "Earned 'Quiz Master' badge",
    date: "May 10, 2023",
    icon: <Award className="h-4 w-4" />,
  },
  {
    id: 4,
    type: "discussion",
    title: "Started a discussion: 'Tips for cracking technical interviews'",
    date: "May 8, 2023",
    icon: <MessageCircle className="h-4 w-4" />,
  },
  {
    id: 5,
    type: "event",
    title: "Participated in Business Case Competition",
    date: "May 5, 2023",
    icon: <Calendar className="h-4 w-4" />,
  },
]

// Sample badges data
const badges = [
  {
    id: 1,
    name: "Quiz Master",
    description: "Won 10+ quizzes",
    icon: <Award className="h-6 w-6" />,
    color: "bg-yellow-500",
  },
  {
    id: 2,
    name: "Event Champion",
    description: "Won 5+ events",
    icon: <Award className="h-6 w-6" />,
    color: "bg-blue-500",
  },
  {
    id: 3,
    name: "Community Builder",
    description: "Created 10+ discussions with 50+ replies",
    icon: <Users className="h-6 w-6" />,
    color: "bg-green-500",
  },
]

export default function ProfilePage() {
  const [profileRefreshKey, setProfileRefreshKey] = useState(0);
  const { userData, loading, error } = useUserProfile(profileRefreshKey);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center">
        <span className="text-lg">Loading profile...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center text-red-500">
        <span className="text-lg">{error}</span>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center">
        <span className="text-lg">No profile data found.</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex h-16 items-center gap-4 border-b bg-background px-6">
        <SidebarTrigger />
        <div>
          <h1 className="font-semibold">My Profile</h1>
          <p className="text-xs text-muted-foreground">View and manage your profile</p>
        </div>
      </header>

      <main className="flex-1 p-6 md:p-10">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-1">
              <Card>
                <CardHeader className="text-center relative">
                  <EditProfileDialog userData={userData} onProfileUpdated={() => setProfileRefreshKey(k => k + 1)} />
                  <div className="flex flex-col items-center">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={userData.avatar || "/placeholder.svg"} alt={userData.name} />
                      <AvatarFallback>{userData.name?.charAt(0) || userData.username?.charAt(0) || "U"}</AvatarFallback>
                    </Avatar>
                    <CardTitle className="mt-4">{userData.name}</CardTitle>
                    <CardDescription>{userData.college}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{userData.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <School className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {userData.year}, {userData.branch}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{userData.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Joined {userData.joinedDate}</span>
                  </div>

                  <div className="pt-4">
                    <p className="text-sm font-medium">Bio</p>
                    <p className="mt-1 text-sm text-muted-foreground">{userData.bio}</p>
                  </div>

                  <div className="pt-4">
                    <p className="text-sm font-medium">Social Links</p>
                    <div className="mt-2 flex gap-2">
                      {userData.socialLinks?.linkedin && (
                        <Button variant="outline" size="icon" asChild>
                          <a href={userData.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                            {/* LinkedIn SVG */}
                            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                            </svg>
                          </a>
                        </Button>
                      )}
                      {userData.socialLinks?.github && (
                        <Button variant="outline" size="icon" asChild>
                          <a href={userData.socialLinks.github} target="_blank" rel="noopener noreferrer">
                            {/* GitHub SVG */}
                            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                            </svg>
                          </a>
                        </Button>
                      )}
                      {userData.socialLinks?.instagram && (
                        <Button variant="outline" size="icon" asChild>
                          <a href={userData.socialLinks.instagram} target="_blank" rel="noopener noreferrer">
                            {/* Instagram SVG */}
                            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" />
                            </svg>
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="md:col-span-2">
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="activity">Activity</TabsTrigger>
                  <TabsTrigger value="achievements">Achievements</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="mt-6 space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Stats Overview</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4 sm:grid-cols-3">
                        {userData.stats?.points !== undefined && (
                          <div className="space-y-2 rounded-lg border p-4 text-center">
                            <p className="text-sm text-muted-foreground">Total Points</p>
                            <p className="text-3xl font-bold">{userData.stats.points}</p>
                          </div>
                        )}
                        {userData.stats?.rank !== undefined && (
                          <div className="space-y-2 rounded-lg border p-4 text-center">
                            <p className="text-sm text-muted-foreground">Current Rank</p>
                            <p className="text-3xl font-bold">#{userData.stats.rank}</p>
                          </div>
                        )}
                        {userData.stats?.badges !== undefined && (
                          <div className="space-y-2 rounded-lg border p-4 text-center">
                            <p className="text-sm text-muted-foreground">Badges Earned</p>
                            <p className="text-3xl font-bold">{userData.stats.badges}</p>
                          </div>
                        )}
                      </div>

                      <div className="mt-6 space-y-4">
  {userData.stats?.eventsParticipated !== undefined && (
    <div className="space-y-2">
      <div className="flex justify-between">
        <p className="text-sm">Events Participated</p>
        <p className="text-sm font-medium">{userData.stats.eventsParticipated}</p>
      </div>
      <Progress value={(userData.stats.eventsParticipated / 20) * 100} className="h-2" />
    </div>
  )}
  {userData.stats?.quizzesTaken !== undefined && (
    <div className="space-y-2">
      <div className="flex justify-between">
        <p className="text-sm">Quizzes Taken</p>
        <p className="text-sm font-medium">{userData.stats.quizzesTaken}</p>
      </div>
      <Progress value={(userData.stats.quizzesTaken / 30) * 100} className="h-2" />
    </div>
  )}
  {userData.stats?.discussionsCreated !== undefined && (
    <div className="space-y-2">
      <div className="flex justify-between">
        <p className="text-sm">Discussions Created</p>
        <p className="text-sm font-medium">{userData.stats.discussionsCreated}</p>
      </div>
      <Progress value={(userData.stats.discussionsCreated / 15) * 100} className="h-2" />
    </div>
  )}
</div>
                    </CardContent>
                  </Card>

                  <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                      <CardHeader>
                        <CardTitle>Upcoming Events</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center gap-4 rounded-lg border p-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                              <Calendar className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">National Hackathon 2023</p>
                              <p className="text-sm text-muted-foreground">May 20-22, 2023 • IIT Delhi</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 rounded-lg border p-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                              <Calendar className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">Debate Championship</p>
                              <p className="text-sm text-muted-foreground">June 10, 2023 • Delhi University</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" className="w-full">
                          View All Events
                        </Button>
                      </CardFooter>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>My Teams</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center gap-4 rounded-lg border p-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                              <Users className="h-6 w-6 text-primary" />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium">Code Ninjas</p>
                              <p className="text-sm text-muted-foreground">For CodeCraft 2023 • 3 members</p>
                            </div>
                            <Badge>Active</Badge>
                          </div>
                          <div className="flex items-center gap-4 rounded-lg border p-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                              <Users className="h-6 w-6 text-primary" />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium">Debate Masters</p>
                              <p className="text-sm text-muted-foreground">For Debate Championship • 2 members</p>
                            </div>
                            <Badge variant="outline">Pending</Badge>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" className="w-full">
                          View All Teams
                        </Button>
                      </CardFooter>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="activity" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-8">
                        {activities.map((activity) => (
                          <div key={activity.id} className="flex gap-4">
                            <div className="relative flex flex-col items-center">
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                                {activity.icon}
                              </div>
                              {activity.id !== activities.length && <div className="mt-2 h-full w-0.5 bg-border"></div>}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-medium">{activity.title}</p>
                                <Badge variant="outline">{activity.date}</Badge>
                              </div>
                              {activity.type === "event" && (
                                <p className="mt-2 text-sm">
                                  You've successfully registered for this event. Don't forget to prepare!
                                </p>
                              )}
                              {activity.type === "quiz" && (
                                <p className="mt-2 text-sm">
                                  Great job on completing the quiz! You scored above average.
                                </p>
                              )}
                              {activity.type === "badge" && (
                                <p className="mt-2 text-sm">
                                  Congratulations on earning this badge! Keep up the good work.
                                </p>
                              )}
                              {activity.type === "discussion" && (
                                <p className="mt-2 text-sm">
                                  Your discussion has received 8 replies so far. Check them out!
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full">
                        View All Activity
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>

                <TabsContent value="achievements" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>My Badges</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                        {badges.map((badge) => (
                          <div key={badge.id} className="flex flex-col items-center gap-2 rounded-lg border p-4">
                            <div
                              className={`flex h-16 w-16 items-center justify-center rounded-full text-white ${badge.color}`}
                            >
                              {badge.icon}
                            </div>
                            <p className="font-medium">{badge.name}</p>
                            <p className="text-center text-sm text-muted-foreground">{badge.description}</p>
                          </div>
                        ))}
                        {Array.from({ length: 3 }).map((_, index) => (
                          <div
                            key={index}
                            className="flex flex-col items-center gap-2 rounded-lg border border-dashed p-4"
                          >
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                              <Award className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <p className="font-medium">Locked Badge</p>
                            <p className="text-center text-sm text-muted-foreground">
                              Keep participating to unlock more badges
                            </p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full">
                        View All Badges
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
