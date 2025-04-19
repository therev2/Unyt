"use client";

import { Bell, Calendar, MessageCircle, PlusCircle, ThumbsUp, Vote } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { db } from "@/lib/firebase";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import BulletinPostDialog from "@/components/bulletin-post-dialog";
import CollegePollVote from "@/components/college-poll-vote";

function useFirestoreEvents(collegeId: string | undefined) {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!collegeId) return;
    setLoading(true);
    setError(null);
    getDocs(collection(db, `Colleges/${collegeId}/Events`))
      .then((querySnapshot) => {
        const fetched: any[] = [];
        querySnapshot.forEach((doc) => {
          fetched.push({ id: doc.id, ...doc.data() });
        });
        setEvents(fetched);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [collegeId]);

  return { events, loading, error };
}

function useFirestoreBulletins(collegeId: string | undefined) {
  const [bulletins, setBulletins] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!collegeId) return;
    setLoading(true);
    setError(null);
    getDocs(collection(db, `Colleges/${collegeId}/Bulletin`))
      .then((querySnapshot) => {
        const fetched: any[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          fetched.push({
            id: data.id ?? doc.id,
            title: data.title ?? '',
            content: data.content ?? '',
            date: data.date ?? '',
            author: {
              name: data.author_name ?? '',
              avatar: data.author_avatar ?? '/placeholder.svg?height=40&width=40',
            },
          });
        });
        setBulletins(fetched);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [collegeId]);

  return { bulletins, loading, error };
}

function useFirestoreNotices(collegeId: string | undefined) {
  const [notices, setNotices] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!collegeId) return;
    setLoading(true);
    setError(null);
    getDocs(collection(db, `Colleges/${collegeId}/Notices`))
      .then((querySnapshot) => {
        const fetched: any[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          fetched.push({
            id: data.id ?? doc.id,
            title: data.title ?? '',
            content: data.content ?? '',
            date: data.date ?? '',
            author: data.author ?? '',
            important: data.important ?? false,
          });
        });
        setNotices(fetched);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [collegeId]);

  return { notices, loading, error };
}

function useFirestorePolls(collegeId: string | undefined, pollsRefreshKey: number) {
  const [polls, setPolls] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!collegeId) return;
    setLoading(true);
    setError(null);
    getDocs(collection(db, `Colleges/${collegeId}/Polls`))
      .then((querySnapshot) => {
        const fetched: any[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          fetched.push({
            id: data.id ?? doc.id,
            question: data.question ?? '',
            options: Array.isArray(data.options) ? data.options : [],
            totalVotes: data.totalVotes ?? 0,
            endDate: data.endDate ?? '',
            voters: data.voters ?? [],
          });
        });
        setPolls(fetched);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [collegeId, pollsRefreshKey]);

  return { polls, loading, error };
}

import ChatRoom from "@/components/ChatRoom";
import { useUserProfile } from "@/components/useUserProfile";

const polls = []

export default function CollegePage() {
  const { userData, loading: profileLoading, error: profileError } = useUserProfile();
  const [pollsRefreshKey, setPollsRefreshKey] = useState(0);
  const collegeId = userData?.collegeId || userData?.college || "NIT_Trichy"; // fallback for demo
  const { events, loading: eventsLoading, error: eventsError } = useFirestoreEvents(collegeId);
  const { bulletins, loading: bulletinsLoading, error: bulletinsError } = useFirestoreBulletins(collegeId);
  const { notices, loading: noticesLoading, error: noticesError } = useFirestoreNotices(collegeId);
  const { polls, loading: pollsLoading, error: pollsError } = useFirestorePolls(collegeId, pollsRefreshKey);
  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex h-16 items-center gap-4 border-b bg-background px-6">
        <SidebarTrigger />
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder.svg?height=32&width=32" alt={userData?.college || "College"} />
            <AvatarFallback>{userData?.college ? userData.college.slice(0, 3).toUpperCase() : "COL"}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="font-semibold">{userData?.college || "Your College"}</h1>
            <p className="text-xs text-muted-foreground">Your College Homepage</p>
          </div>
        </div>
      </header>

      <main className="flex-1 p-6 md:p-10">
        <div className="mx-auto max-w-7xl">
          <Tabs defaultValue="notices" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="notices" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                <span className="hidden sm:inline">Notices</span>
              </TabsTrigger>
              <TabsTrigger value="events" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span className="hidden sm:inline">Events</span>
              </TabsTrigger>
              <TabsTrigger value="polls" className="flex items-center gap-2">
                <Vote className="h-4 w-4" />
                <span className="hidden sm:inline">Polls</span>
              </TabsTrigger>
              <TabsTrigger value="chatroom" className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                <span className="hidden sm:inline">Chatroom</span>
              </TabsTrigger>
              <TabsTrigger value="bulletin" className="flex items-center gap-2">
                <PlusCircle className="h-4 w-4" />
                <span className="hidden sm:inline">Bulletin</span>
              </TabsTrigger>
            </TabsList>

            {/* Notices Tab */}
            <TabsContent value="notices" className="mt-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">College Notices</h2>
                <Button>
                  <Bell className="mr-2 h-4 w-4" />
                  Subscribe to Notifications
                </Button>
              </div>
              {noticesLoading ? (
                <div>Loading notices…</div>
              ) : noticesError ? (
                <div className="text-red-500">Error loading notices: {noticesError}</div>
              ) : (
                <div className="grid gap-6">
                  {notices.map((notice) => (
                    <Card key={notice.id}>
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">{notice.title}</CardTitle>
                            <CardDescription>
                              Posted by {notice.author} • {notice.date}
                            </CardDescription>
                          </div>
                          {notice.important && <Badge variant="destructive">Important</Badge>}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p>{notice.content}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Events Tab */}
            <TabsContent value="events" className="mt-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Upcoming Events</h2>
                <Button>
                  <Calendar className="mr-2 h-4 w-4" />
                  Add to Calendar
                </Button>
              </div>
              {eventsLoading ? (
                <div>Loading events…</div>
              ) : eventsError ? (
                <div className="text-red-500">Error loading events: {eventsError}</div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {events.map((event) => (
                    <Card key={event.id} className="overflow-hidden">
                      <img
                        src={event.image ? event.image : "/placeholder.svg?height=100&width=200"}
                        alt={event.title || "Event image"}
                        className="w-full h-40 object-cover bg-muted"
                        onError={(e) => { e.currentTarget.src = "/placeholder.svg?height=100&width=200"; }}
                      />
                      <CardHeader>
                        <CardTitle>{event.title}</CardTitle>
                        <CardDescription>
                          {event.date} • {event.location}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">{event.description}</p>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <p className="text-sm text-muted-foreground">By {event.organizer}</p>
                        <Button size="sm">Register</Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Polls Tab */}
            <TabsContent value="polls" className="mt-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Active Polls</h2>
                <Button>
                  <Vote className="mr-2 h-4 w-4" />
                  Create Poll
                </Button>
              </div>
              {pollsLoading ? (
                <div>Loading polls…</div>
              ) : pollsError ? (
                <div className="text-red-500">Error loading polls: {pollsError}</div>
              ) : (
                <div className="grid gap-6">
                  {polls.map((poll) => (
                    <Card key={poll.id}>
                      <CardHeader>
                        <CardTitle>{poll.question}</CardTitle>
                        <CardDescription>
                          {poll.totalVotes} votes • Ends on {poll.endDate}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <CollegePollVote poll={poll} collegeId={collegeId} onVoted={() => setPollsRefreshKey((k) => k + 1)} />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Chatroom Tab */}
            <TabsContent value="chatroom" className="mt-6">
              {profileLoading ? (
                <div>Loading chatroom…</div>
              ) : profileError || !userData?.college ? (
                <div className="text-red-500 text-sm">
                  Unable to load college chatroom<br />
                  College value: {userData?.college || "undefined"}<br />
                  Error: {profileError}
                </div>
              ) : (
                <ChatRoom roomId={userData.college} />
              )}
            </TabsContent>

            {/* Bulletin Tab */}
            <TabsContent value="bulletin" className="mt-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Student Bulletin Board</h2>
                <BulletinPostDialog
                  trigger={
                    <Button>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Post to Bulletin
                    </Button>
                  }
                  onSubmit={async (data) => {
                    if (!collegeId) throw new Error("No college ID");
                    await addDoc(collection(db, `Colleges/${collegeId}/Bulletin`), data);
                  }}
                  defaultAuthorName={userData?.name || ""}
                  defaultAuthorAvatar={userData?.default_avatar || "/placeholder.svg?height=40&width=40"}
                />
              </div>
              {bulletinsLoading ? (
                <div>Loading bulletins…</div>
              ) : bulletinsError ? (
                <div className="text-red-500">Error loading bulletins: {bulletinsError}</div>
              ) : (
                <div className="grid gap-6">
                  {bulletins.map((bulletin) => (
                    <Card key={bulletin.id}>
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={bulletin.author.avatar || "/placeholder.svg"} alt={bulletin.author.name} />
                            <AvatarFallback>{bulletin.author.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="text-base">{bulletin.title}</CardTitle>
                            <CardDescription>
                              Posted by {bulletin.author.name} • {bulletin.date}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p>{bulletin.content}</p>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <Button variant="ghost" size="sm">
                          <ThumbsUp className="mr-2 h-4 w-4" />
                          Like
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MessageCircle className="mr-2 h-4 w-4" />
                          Comment
                        </Button>
                        <Button variant="ghost" size="sm">
                          Share
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>

    </div>
  )
}
