import { MessageCircle, Plus, Search, ThumbsUp, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Sample data - in a real app, this would come from your database
const discussions = [
  {
    id: 1,
    title: "Tips for cracking technical interviews",
    content:
      "I have interviews coming up with several tech companies. Any advice on how to prepare effectively? What resources would you recommend for DSA practice?",
    author: {
      name: "Rahul Sharma",
      college: "NIT Trichy",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    category: "Career",
    tags: ["Interviews", "Preparation", "Tech"],
    createdAt: "2 hours ago",
    views: 120,
    replies: 8,
    likes: 24,
    isAnonymous: false,
  },
  {
    id: 2,
    title: "Which electives should I choose for my 6th semester?",
    content:
      "I'm a Computer Science student in my 3rd year. I need to select electives for the upcoming semester. What are some good options that will help in placements?",
    author: {
      name: "Anonymous",
      college: "BITS Pilani",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    category: "Academic",
    tags: ["Electives", "Computer Science", "Placements"],
    createdAt: "5 hours ago",
    views: 85,
    replies: 12,
    likes: 18,
    isAnonymous: true,
  },
  {
    id: 3,
    title: "Best hostels in IIT Delhi for first-year students",
    content:
      "I'll be joining IIT Delhi this year. Can someone guide me on which hostel to choose? What are the pros and cons of different hostels?",
    author: {
      name: "Priya Patel",
      college: "Delhi University",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    category: "Campus Life",
    tags: ["Hostels", "IIT Delhi", "First Year"],
    createdAt: "8 hours ago",
    views: 210,
    replies: 15,
    likes: 32,
    isAnonymous: false,
  },
  {
    id: 4,
    title: "Looking for teammates for the upcoming hackathon",
    content:
      "I'm looking for 2-3 teammates for the National Hackathon 2023. I'm good at backend development and ML. Need people with frontend and UI/UX skills.",
    author: {
      name: "Amit Kumar",
      college: "IIT Bombay",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    category: "Events",
    tags: ["Hackathon", "Team Formation", "Coding"],
    createdAt: "1 day ago",
    views: 150,
    replies: 10,
    likes: 15,
    isAnonymous: false,
  },
  {
    id: 5,
    title: "Best food joints near campus",
    content:
      "Let's create a list of the best affordable food places near our campuses. I'll start with some recommendations near NIT Trichy.",
    author: {
      name: "Sneha Gupta",
      college: "NIT Trichy",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    category: "Lifestyle",
    tags: ["Food", "Campus Life", "Recommendations"],
    createdAt: "2 days ago",
    views: 320,
    replies: 25,
    likes: 45,
    isAnonymous: false,
  },
]

// Sample thread data
const threadData = {
  id: 1,
  title: "Tips for cracking technical interviews",
  content:
    "I have interviews coming up with several tech companies. Any advice on how to prepare effectively? What resources would you recommend for DSA practice?",
  author: {
    name: "Rahul Sharma",
    college: "NIT Trichy",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  category: "Career",
  tags: ["Interviews", "Preparation", "Tech"],
  createdAt: "2 hours ago",
  views: 120,
  replies: [
    {
      id: 101,
      content:
        "I'd recommend practicing on LeetCode and HackerRank. Start with easy problems and gradually move to medium and hard. Also, read 'Cracking the Coding Interview' book, it's really helpful.",
      author: {
        name: "Priya Patel",
        college: "BITS Pilani",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      createdAt: "1 hour ago",
      likes: 12,
      isAnonymous: false,
    },
    {
      id: 102,
      content:
        "Don't just focus on coding problems. Make sure you understand system design concepts too, especially if you're applying for senior roles. Also, prepare for behavioral questions.",
      author: {
        name: "Amit Kumar",
        college: "IIT Delhi",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      createdAt: "45 minutes ago",
      likes: 8,
      isAnonymous: false,
      replies: [
        {
          id: 1021,
          content:
            "Agreed! System design is often overlooked but very important. Any good resources you'd recommend for that?",
          author: {
            name: "Rahul Sharma",
            college: "NIT Trichy",
            avatar: "/placeholder.svg?height=40&width=40",
          },
          createdAt: "30 minutes ago",
          likes: 4,
          isAnonymous: false,
        },
        {
          id: 1022,
          content:
            "Check out 'System Design Interview' by Alex Xu. Also, there are some great YouTube channels like 'Tech Dummies' that explain system design concepts really well.",
          author: {
            name: "Amit Kumar",
            college: "IIT Delhi",
            avatar: "/placeholder.svg?height=40&width=40",
          },
          createdAt: "20 minutes ago",
          likes: 6,
          isAnonymous: false,
        },
      ],
    },
    {
      id: 103,
      content:
        "Make sure to practice mock interviews with friends or use platforms like Pramp. It helps a lot with the actual interview experience.",
      author: {
        name: "Anonymous",
        college: "Anonymous",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      createdAt: "30 minutes ago",
      likes: 5,
      isAnonymous: true,
    },
  ],
}

export default function ForumsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex h-16 items-center gap-4 border-b bg-background px-6">
        <SidebarTrigger />
        <div>
          <h1 className="font-semibold">Discussion Forums</h1>
          <p className="text-xs text-muted-foreground">Connect and discuss with students across colleges</p>
        </div>
      </header>

      <main className="flex-1 p-6 md:p-10">
        <div className="mx-auto max-w-7xl">
          <Tabs defaultValue="all" className="w-full">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <TabsList>
                <TabsTrigger value="all">All Discussions</TabsTrigger>
                <TabsTrigger value="academic">Academic</TabsTrigger>
                <TabsTrigger value="career">Career</TabsTrigger>
                <TabsTrigger value="campus">Campus Life</TabsTrigger>
                <TabsTrigger value="events">Events</TabsTrigger>
                <TabsTrigger value="my">My Discussions</TabsTrigger>
              </TabsList>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search discussions..."
                    className="w-full rounded-md pl-8 md:w-[200px] lg:w-[300px]"
                  />
                </div>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  New Discussion
                </Button>
              </div>
            </div>

            <TabsContent value="all" className="mt-0">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-3/4">
                  <div className="space-y-4">
                    {discussions.map((discussion) => (
                      <Card key={discussion.id}>
                        <CardHeader className="pb-3">
                          <div className="flex justify-between">
                            <div>
                              <CardTitle className="text-lg hover:text-primary">
                                <a href={`/forums/${discussion.id}`}>{discussion.title}</a>
                              </CardTitle>
                              <CardDescription>
                                Posted by{" "}
                                {discussion.isAnonymous ? (
                                  <span>Anonymous</span>
                                ) : (
                                  <span className="font-medium text-foreground">{discussion.author.name}</span>
                                )}{" "}
                                from {discussion.author.college} • {discussion.createdAt}
                              </CardDescription>
                            </div>
                            <Badge>{discussion.category}</Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="line-clamp-2">{discussion.content}</p>
                          <div className="mt-3 flex flex-wrap gap-2">
                            {discussion.tags.map((tag) => (
                              <Badge key={tag} variant="outline">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                        <CardFooter className="flex justify-between border-t pt-3">
                          <div className="flex gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center">
                              <MessageCircle className="mr-1 h-4 w-4" />
                              {discussion.replies} replies
                            </div>
                            <div className="flex items-center">
                              <ThumbsUp className="mr-1 h-4 w-4" />
                              {discussion.likes} likes
                            </div>
                            <div className="flex items-center">
                              <User className="mr-1 h-4 w-4" />
                              {discussion.views} views
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">
                            <MessageCircle className="mr-2 h-4 w-4" />
                            Reply
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
                {discussions.slice(0, 2).map((discussion) => (
                  <Card key={discussion.id}>
                    <CardHeader className="pb-3">
                      <div className="flex justify-between">
                        <div>
                          <CardTitle className="text-lg hover:text-primary">
                            <a href={`/forums/${discussion.id}`}>{discussion.title}</a>
                          </CardTitle>
                          <CardDescription>Posted by you • {discussion.createdAt}</CardDescription>
                        </div>
                        <Badge>{discussion.category}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="line-clamp-2">{discussion.content}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {discussion.tags.map((tag) => (
                          <Badge key={tag} variant="outline">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between border-t pt-3">
                      <div className="flex gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <MessageCircle className="mr-1 h-4 w-4" />
                          {discussion.replies} replies
                        </div>
                        <div className="flex items-center">
                          <ThumbsUp className="mr-1 h-4 w-4" />
                          {discussion.likes} likes
                        </div>
                        <div className="flex items-center">
                          <User className="mr-1 h-4 w-4" />
                          {discussion.views} views
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MessageCircle className="mr-2 h-4 w-4" />
                          View Replies
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
  )
}
