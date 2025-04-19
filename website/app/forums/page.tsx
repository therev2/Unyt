'use client';

import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy, doc, updateDoc, arrayUnion, arrayRemove, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { MessageCircle, ThumbsUp, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUserProfile } from "@/components/useUserProfile";

// Forum topic type
interface ForumTopic {
  id: string;
  title: string;
  description: string;
  category: string;
  author: {
    name: string;
    college: string;
    avatar: string;
  };
  createdAt: string;
  lastActivity: string;
  views: number;
  comments: number;
  isSticky: boolean;
  upvotes: number;
  upvotedBy?: string[];
}

const categoryTabs = [
  { key: 'all', label: 'All' },
  { key: 'Academics', label: 'Academics' },
  { key: 'Career', label: 'Career' },
  { key: 'Technology', label: 'Technology' },
  { key: 'Campus Life', label: 'Campus Life' },
];

export default function ForumsPage() {
  const { userData } = useUserProfile();
  const currentUserId = userData?.uid;
  const [topics, setTopics] = useState<ForumTopic[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Move fetchTopics to outer scope so it can be reused
  const fetchTopics = async () => {
    setLoading(true);
    const q = query(collection(db, "Discussion"), orderBy("lastActivity", "desc"));
    const snapshot = await getDocs(q);
    let data: ForumTopic[] = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }) as ForumTopic);

    // For topics missing the comments field, fetch the count from Firestore
    await Promise.all(data.map(async (topic, i) => {
      if (typeof topic.comments !== 'number') {
        const commentsCol = collection(db, "Discussion", topic.id, "Comments");
        const commentsSnap = await getDocs(commentsCol);
        data[i].comments = commentsSnap.size;
      }
    }));

    setTopics(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchTopics();
  }, []);

  const filteredTopics = selectedCategory === 'all'
    ? topics
    : topics.filter(t => t.category === selectedCategory);

  // Stats
  const stats = {
    topics: topics.length,
    posts: topics.reduce((acc, t) => acc + (t.comments || 0) + 1, 0),
  };

  // Upvote handler (guard against undefined userId)
  const handleUpvote = async (topicId: string, userId?: string) => {
    if (!userId) return; // Prevent upvote if not logged in
    const topicRef = doc(db, "Discussion", topicId);
    const topicSnap = await getDoc(topicRef);
    if (topicSnap.exists()) {
      const data = topicSnap.data();
      const upvotedBy: string[] = data.upvotedBy || [];
      let newUpvotes = data.upvotes || 0;
      if (!upvotedBy.includes(userId)) {
        await updateDoc(topicRef, {
          upvotes: newUpvotes + 1,
          upvotedBy: arrayUnion(userId),
        });
      } else {
        await updateDoc(topicRef, {
          upvotes: Math.max(newUpvotes - 1, 0),
          upvotedBy: arrayRemove(userId),
        });
      }
      fetchTopics(); // Refresh topics
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="flex h-16 items-center gap-4 border-b bg-background px-6">
        <div>
          <h1 className="font-semibold">Discussion Forums</h1>
          <p className="text-xs text-muted-foreground">Connect and discuss with students across colleges</p>
        </div>
      </header>

      <main className="flex-1 p-6 md:p-10">
        <div className="mx-auto max-w-7xl">
          <Tabs defaultValue="all" value={selectedCategory} onValueChange={setSelectedCategory}>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <TabsList>
                {categoryTabs.map(tab => (
                  <TabsTrigger key={tab.key} value={tab.key}>{tab.label}</TabsTrigger>
                ))}
              </TabsList>
              <div className="flex gap-2">
                <div className="relative">
                  <Input
                    type="search"
                    placeholder="Search discussions..."
                    className="w-full rounded-md pl-8 md:w-[200px] lg:w-[300px]"
                  />
                </div>
                <Button>
                  New Discussion
                </Button>
              </div>
            </div>

            <TabsContent value="all" className="mt-0">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-3/4">
                  <div className="space-y-4">
                    {filteredTopics.map(topic => (
                      <Card key={topic.id}>
                        <CardHeader className="pb-3 flex flex-row items-center justify-between">
                          <div>
                            <CardTitle className="text-lg hover:text-primary">
                              <a href={`/forums/${topic.id}`}>{topic.title}</a>
                            </CardTitle>
                            <CardDescription>by {topic.author?.name || 'Anonymous'} • {topic.createdAt}</CardDescription>
                          </div>
                          <Badge>{topic.category}</Badge>
                        </CardHeader>
                        <CardContent>
                          <p className="line-clamp-2">{topic.description}</p>
                        </CardContent>
                        <CardFooter className="flex justify-between border-t pt-3">
                          <div className="flex gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center">
                              <MessageCircle className="mr-1 h-4 w-4" />
                              {topic.comments !== undefined ? topic.comments : '0'} comments
                            </div>
                            <Button
                              variant="ghost"
                              onClick={() => handleUpvote(topic.id, currentUserId)}
                              size="icon"
                              aria-label={topic.upvotedBy?.includes(currentUserId ?? "") ? "Remove upvote" : "Upvote"}
                              disabled={!currentUserId}
                            >
                              <ThumbsUp className={topic.upvotedBy?.includes(currentUserId ?? "") ? "h-4 w-4 text-blue-600" : "h-4 w-4 text-muted-foreground"} />
                              <span className="ml-1">{topic.upvotes || 0}</span>
                            </Button>
                            <div className="flex items-center">
                              <User className="mr-1 h-4 w-4" />
                              {topic.views} views
                            </div>
                          </div>
                          <Button asChild variant="ghost" size="sm">
                            <a href={`/forums/${topic.id}`}>View</a>
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </div>

                <div className="md:w-1/4">
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Forum Categories</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex justify-between">
                          <span>Academic</span>
                          <Badge variant="outline">125</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Career</span>
                          <Badge variant="outline">98</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Campus Life</span>
                          <Badge variant="outline">210</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Events</span>
                          <Badge variant="outline">75</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Lifestyle</span>
                          <Badge variant="outline">120</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Technology</span>
                          <Badge variant="outline">150</Badge>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Popular Tags</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="secondary">Placements</Badge>
                          <Badge variant="secondary">Interviews</Badge>
                          <Badge variant="secondary">Coding</Badge>
                          <Badge variant="secondary">Hackathon</Badge>
                          <Badge variant="secondary">Internships</Badge>
                          <Badge variant="secondary">Projects</Badge>
                          <Badge variant="secondary">Campus Life</Badge>
                          <Badge variant="secondary">Food</Badge>
                          <Badge variant="secondary">Hostels</Badge>
                          <Badge variant="secondary">Exams</Badge>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Top Contributors</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Avatar>
                              <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Rahul Sharma" />
                              <AvatarFallback>RS</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">Rahul Sharma</p>
                              <p className="text-xs text-muted-foreground">NIT Trichy</p>
                            </div>
                          </div>
                          <Badge variant="outline">250 pts</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Avatar>
                              <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Priya Patel" />
                              <AvatarFallback>PP</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">Priya Patel</p>
                              <p className="text-xs text-muted-foreground">BITS Pilani</p>
                            </div>
                          </div>
                          <Badge variant="outline">220 pts</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Avatar>
                              <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Amit Kumar" />
                              <AvatarFallback>AK</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">Amit Kumar</p>
                              <p className="text-xs text-muted-foreground">IIT Delhi</p>
                            </div>
                          </div>
                          <Badge variant="outline">185 pts</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="my" className="mt-0">
              <div className="flex justify-between mb-6">
                <h2 className="text-2xl font-bold">My Discussions</h2>
                <div className="flex gap-2">
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Discussions</SelectItem>
                      <SelectItem value="created">Created by me</SelectItem>
                      <SelectItem value="participated">Participated</SelectItem>
                      <SelectItem value="saved">Saved</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                {filteredTopics.slice(0, 2).map(topic => (
                  <Card key={topic.id}>
                    <CardHeader className="pb-3 flex flex-row items-center justify-between">
                      <div>
                        <CardTitle className="text-lg hover:text-primary">
                          <a href={`/forums/${topic.id}`}>{topic.title}</a>
                        </CardTitle>
                        <CardDescription>Posted by you • {topic.createdAt}</CardDescription>
                      </div>
                      <Badge>{topic.category}</Badge>
                    </CardHeader>
                    <CardContent>
                      <p className="line-clamp-2">{topic.description}</p>
                    </CardContent>
                    <CardFooter className="flex justify-between border-t pt-3">
                      <div className="flex gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <MessageCircle className="mr-1 h-4 w-4" />
                          {topic.comments !== undefined ? topic.comments : '0'} comments
                        </div>
                        <Button
                          variant="ghost"
                          onClick={() => handleUpvote(topic.id, currentUserId)}
                          size="icon"
                          aria-label={topic.upvotedBy?.includes(currentUserId ?? "") ? "Remove upvote" : "Upvote"}
                          disabled={!currentUserId}
                        >
                          <ThumbsUp className={topic.upvotedBy?.includes(currentUserId ?? "") ? "h-4 w-4 text-blue-600" : "h-4 w-4 text-muted-foreground"} />
                          <span className="ml-1">{topic.upvotes || 0}</span>
                        </Button>
                        <div className="flex items-center">
                          <User className="mr-1 h-4 w-4" />
                          {topic.views} views
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MessageCircle className="mr-2 h-4 w-4" />
                          View Comments
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
