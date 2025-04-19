"use client";

import { Bell, Calendar, MessageCircle, PlusCircle, ThumbsUp, Vote } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, orderBy, addDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import BulletinPostDialog from "@/components/bulletin-post-dialog";
import CollegePollVote from "@/components/college-poll-vote";

const polls = [
  {
    id: 1,
    question: "When should we schedule the department picnic?",
    options: [
      { id: 1, text: "Next Saturday", votes: 45 },
      { id: 2, text: "Next Sunday", votes: 32 },
      { id: 3, text: "The following weekend", votes: 18 },
    ],
    totalVotes: 95,
    endDate: "Apr 25, 2023",
  },
  {
    id: 2,
    question: "Which guest speaker would you prefer for the technical symposium?",
    options: [
      { id: 1, text: "Dr. Jane Smith (AI Researcher)", votes: 78 },
      { id: 2, text: "Mr. John Doe (Industry Expert)", votes: 64 },
      { id: 3, text: "Prof. Alice Johnson (Academic)", votes: 42 },
    ],
    totalVotes: 184,
    endDate: "Apr 30, 2023",
  },
]

const bulletins = [
  {
    id: 1,
    title: "Selling Textbooks",
    content:
      "Selling Computer Networks and Database Management System textbooks. Both in excellent condition. Contact: 9876543210",
    author: {
      name: "Rahul Sharma",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    date: "Apr 19, 2023",
  },
  {
    id: 2,
    title: "Roommate Wanted",
    content: "Looking for a roommate to share an apartment near campus. Rent: ₹8000/month. Available from May 1st.",
    author: {
      name: "Priya Patel",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    date: "Apr 17, 2023",
  },
  {
    id: 3,
    title: "Coding Club Recruitment",
    content:
      "The Coding Club is recruiting new members. If you're passionate about programming, join us! Apply by April 30th.",
    author: {
      name: "Coding Club",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    date: "Apr 15, 2023",
  },
]

import ChatRoom from "@/components/ChatRoom";

function useGlobalNotices() {
  const [notices, setNotices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    setLoading(true);
    setError("");
    const q = query(collection(db, "GlobalNotices"), orderBy("datetime", "desc"));
    const unsub = onSnapshot(
      q,
      (snapshot) => {
        setNotices(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setLoading(false);
      },
      (err) => {
        setError("Failed to load notices: " + err.message);
        setLoading(false);
      }
    );
    return unsub;
  }, []);

  return { notices, loading, error };
}

function useGlobalEvents() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    setLoading(true);
    setError("");
    const q = query(collection(db, "GlobalEvents"), orderBy("datetime", "desc"));
    const unsub = onSnapshot(
      q,
      (snapshot) => {
        setEvents(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setLoading(false);
      },
      (err) => {
        setError("Failed to load events: " + err.message);
        setLoading(false);
      }
    );
    return unsub;
  }, []);

  return { events, loading, error };
}

function useGlobalBulletin() {
  const [bulletins, setBulletins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    setLoading(true);
    setError("");
    const q = query(collection(db, "GlobalBulletin"), orderBy("datetime", "desc"));
    const unsub = onSnapshot(
      q,
      (snapshot) => {
        setBulletins(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setLoading(false);
      },
      (err) => {
        setError("Failed to load bulletin: " + err.message);
        setLoading(false);
      }
    );
    return unsub;
  }, []);

  return { bulletins, loading, error };
}

function useGlobalPolls(pollsRefreshKey: number) {
  const [polls, setPolls] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    const q = query(collection(db, "GlobalPolls"), orderBy("endDate", "desc"));
    const unsub = onSnapshot(q, (snapshot) => {
      const fetched: any[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        fetched.push({
          id: doc.id,
          question: data.question ?? '',
          options: Array.isArray(data.options) ? data.options : [],
          totalVotes: data.totalVotes ?? data.options?.reduce((acc:number, o:any) => acc + (o.votes || 0), 0) ?? 0,
          endDate: data.endDate ?? '',
          voters: data.voters ?? {},
        });
      });
      setPolls(fetched);
      setLoading(false);
    }, (err) => {
      setError(err.message);
      setLoading(false);
    });
    return unsub;
  }, [pollsRefreshKey]);

  return { polls, loading, error };
}

export default function GlobalFeedPage() {
  const { notices, loading: noticesLoading, error: noticesError } = useGlobalNotices();
  const { events, loading: eventsLoading, error: eventsError } = useGlobalEvents();
  const { bulletins: globalBulletins, loading: globalBulletinLoading, error: globalBulletinError } = useGlobalBulletin();
  const [pollsRefreshKey, setPollsRefreshKey] = useState(0);
  const { polls: globalPolls, loading: globalPollsLoading, error: globalPollsError } = useGlobalPolls(pollsRefreshKey);

  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex h-16 items-center gap-4 border-b bg-background px-6">
        <SidebarTrigger />
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Global" />
            <AvatarFallback>GLB</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="font-semibold">Global Feed</h1>
            <p className="text-xs text-muted-foreground">All Colleges – Unified Events & Messages</p>
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
                <h2 className="text-2xl font-bold">Global Notices</h2>
                <Button>
                  <Bell className="mr-2 h-4 w-4" />
                  Post Notice
                </Button>
              </div>
              <div className="grid gap-6">
                {noticesLoading ? (
                  <div className="text-muted-foreground text-center">Loading notices...</div>
                ) : noticesError ? (
                  <div className="text-red-500 text-center">{noticesError}</div>
                ) : notices.length === 0 ? (
                  <div className="text-muted-foreground text-center">No notices yet.</div>
                ) : (
                  notices.map((notice) => {
                    // Format date (no time)
                    let dateStr = "";
                    if (notice.datetime) {
                      try {
                        if (typeof notice.datetime.toDate === 'function') {
                          const d = notice.datetime.toDate();
                          dateStr = d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
                        } else {
                          dateStr = new Date(notice.datetime).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
                        }
                      } catch {
                        dateStr = String(notice.datetime);
                      }
                    }
                    return (
                      <Card key={notice.id}>
                        <CardHeader>
                          <CardTitle>{notice.title}</CardTitle>
                          <CardDescription>
                            {notice.collegename ? `By ${notice.collegename}` : null}
                            {dateStr ? ` • ${dateStr}` : null}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p>{notice.content}</p>
                        </CardContent>
                      </Card>
                    );
                  })
                )}
              </div>
            </TabsContent>

            {/* Events Tab */}
            <TabsContent value="events" className="mt-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Global Events</h2>
                <Button>
                  <Calendar className="mr-2 h-4 w-4" />
                  Add to Calendar
                </Button>
              </div>
              {eventsLoading ? (
                <div className="text-muted-foreground text-center">Loading events...</div>
              ) : eventsError ? (
                <div className="text-red-500 text-center">{eventsError}</div>
              ) : events.length === 0 ? (
                <div className="text-muted-foreground text-center">No events yet.</div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {events.map((event) => {
                    // Format date (no time)
                    let dateStr = "";
                    if (event.datetime) {
                      try {
                        if (typeof event.datetime.toDate === 'function') {
                          const d = event.datetime.toDate();
                          dateStr = d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
                        } else {
                          dateStr = new Date(event.datetime).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
                        }
                      } catch {
                        dateStr = String(event.datetime);
                      }
                    }
                    const imageUrl = event.image && typeof event.image === 'string' && event.image.trim() !== ''
                      ? event.image
                      : '/placeholder.svg?height=100&width=200';
                    return (
                      <Card key={event.id} className="overflow-hidden">
                        <img
                          src={imageUrl}
                          alt={event.title || "Event image"}
                          className="w-full h-40 object-cover bg-muted"
                          onError={(e) => { e.currentTarget.src = "/placeholder.svg?height=100&width=200"; }}
                        />
                        <CardHeader>
                          <CardTitle>{event.title}</CardTitle>
                          <CardDescription>
                            {event.collegename ? `By ${event.collegename}` : null}
                            {dateStr ? ` • ${dateStr}` : null}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p>{event.content}</p>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </TabsContent>

            {/* Polls Tab */}
            <TabsContent value="polls" className="mt-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Global Polls</h2>
              </div>
              {globalPollsLoading ? (
                <div className="text-muted-foreground text-center">Loading polls…</div>
              ) : globalPollsError ? (
                <div className="text-red-500 text-center">{globalPollsError}</div>
              ) : globalPolls.length === 0 ? (
                <div className="text-muted-foreground text-center">No polls yet.</div>
              ) : (
                <div className="grid gap-6">
                  {globalPolls.map((poll) => (
                    <Card key={poll.id}>
                      <CardHeader>
                        <CardTitle>{poll.question}</CardTitle>
                        <CardDescription>
                          {poll.totalVotes} votes • Ends on {poll.endDate}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <CollegePollVote poll={poll} collegeId={"Global"} onVoted={() => setPollsRefreshKey((k) => k + 1)} />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Chatroom Tab */}
            <TabsContent value="chatroom" className="mt-6">
              <ChatRoom roomId="global" />
            </TabsContent>

            {/* Bulletin Tab */}
            <TabsContent value="bulletin" className="mt-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Global Bulletin Board</h2>
                <BulletinPostDialog
                  trigger={
                    <Button>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Post to Bulletin
                    </Button>
                  }
                  onSubmit={async (data) => {
                    // Adapt to GlobalBulletin schema
                    await addDoc(collection(db, "GlobalBulletin"), {
                      title: data.title,
                      content: data.content,
                      author_name: data.author_name || "Anonymous",
                      author_avatar: data.author_avatar || "",
                      datetime: new Date(),
                    });
                  }}
                  defaultAuthorName={"Anonymous"}
                  defaultAuthorAvatar={""}
                />
              </div>
              {globalBulletinLoading ? (
                <div className="text-muted-foreground text-center">Loading bulletin…</div>
              ) : globalBulletinError ? (
                <div className="text-red-500 text-center">{globalBulletinError}</div>
              ) : globalBulletins.length === 0 ? (
                <div className="text-muted-foreground text-center">No bulletin posts yet.</div>
              ) : (
                <div className="grid gap-6">
                  {globalBulletins.map((bulletin) => {
                    // Format date (no time)
                    let dateStr = "";
                    if (bulletin.datetime) {
                      try {
                        if (typeof bulletin.datetime.toDate === 'function') {
                          const d = bulletin.datetime.toDate();
                          dateStr = d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
                        } else {
                          dateStr = new Date(bulletin.datetime).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
                        }
                      } catch {
                        dateStr = String(bulletin.datetime);
                      }
                    }
                    const avatarUrl = bulletin.author_avatar && typeof bulletin.author_avatar === 'string' && bulletin.author_avatar.trim() !== ''
                      ? bulletin.author_avatar
                      : '/placeholder.svg?height=40&width=40';
                    return (
                      <Card key={bulletin.id}>
                        <CardHeader>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={avatarUrl} alt={bulletin.author_name || 'Avatar'} />
                              <AvatarFallback>{bulletin.author_name ? bulletin.author_name.charAt(0) : '?'}</AvatarFallback>
                            </Avatar>
                            <div>
                              <CardTitle className="text-base">{bulletin.title}</CardTitle>
                              <CardDescription>
                                Posted by {bulletin.author_name || 'Unknown'}{dateStr ? ` • ${dateStr}` : ''}
                              </CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p>{bulletin.content}</p>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
