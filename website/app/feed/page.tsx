import { MessageCircle, Share2, ThumbsUp, Filter, Calendar, MapPin, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Sample data - in a real app, this would come from your database
const events = [
  {
    id: 1,
    title: "National Hackathon 2023",
    description:
      "A 48-hour coding marathon to build innovative solutions for real-world problems. Open to all college students across the country.",
    date: "May 20-22, 2023",
    location: "IIT Delhi",
    category: "Tech",
    image: "/placeholder.svg?height=200&width=400",
    hostCollege: {
      name: "IIT Delhi",
      logo: "/placeholder.svg?height=40&width=40",
    },
    attendees: 342,
    comments: [
      {
        id: 1,
        author: {
          name: "Rahul Sharma",
          college: "NIT Trichy",
          avatar: "/placeholder.svg?height=40&width=40",
        },
        content: "Looking forward to this! Anyone from NIT Trichy planning to attend?",
        timestamp: "2 hours ago",
        likes: 15,
        replies: [
          {
            id: 101,
            author: {
              name: "Priya Patel",
              college: "NIT Trichy",
              avatar: "/placeholder.svg?height=40&width=40",
            },
            content: "Yes, I'm planning to go. Let's form a team!",
            timestamp: "1 hour ago",
            likes: 5,
          },
        ],
      },
      {
        id: 2,
        author: {
          name: "Amit Kumar",
          college: "BITS Pilani",
          avatar: "/placeholder.svg?height=40&width=40",
        },
        content: "Is there any pre-registration required?",
        timestamp: "1 hour ago",
        likes: 3,
      },
    ],
  },
  {
    id: 2,
    title: "Inter-College Cultural Festival",
    description:
      "The biggest cultural festival featuring music, dance, drama, and art competitions. Showcase your talent and win exciting prizes.",
    date: "June 5-8, 2023",
    location: "BITS Pilani",
    category: "Cultural",
    image: "/placeholder.svg?height=200&width=400",
    hostCollege: {
      name: "BITS Pilani",
      logo: "/placeholder.svg?height=40&width=40",
    },
    attendees: 520,
    comments: [
      {
        id: 3,
        author: {
          name: "Sneha Gupta",
          college: "NIT Trichy",
          avatar: "/placeholder.svg?height=40&width=40",
        },
        content: "The dance competition last year was amazing! Can't wait for this year's event.",
        timestamp: "3 hours ago",
        likes: 24,
      },
    ],
  },
  {
    id: 3,
    title: "National Business Case Competition",
    description:
      "Present your business solutions to real-world problems. Judges from top companies will evaluate your ideas.",
    date: "May 15, 2023",
    location: "IIM Ahmedabad",
    category: "Business",
    image: "/placeholder.svg?height=200&width=400",
    hostCollege: {
      name: "IIM Ahmedabad",
      logo: "/placeholder.svg?height=40&width=40",
    },
    attendees: 210,
    comments: [],
  },
]

export default function GlobalFeedPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex h-16 items-center gap-4 border-b bg-background px-6">
        <SidebarTrigger />
        <div>
          <h1 className="font-semibold">Global Event Feed</h1>
          <p className="text-xs text-muted-foreground">Discover events from colleges across the country</p>
        </div>
      </header>

      <main className="flex-1 p-6 md:p-10">
        <div className="mx-auto max-w-4xl">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <Tabs defaultValue="all" className="w-full">
                <TabsList>
                  <TabsTrigger value="all">All Events</TabsTrigger>
                  <TabsTrigger value="tech">Tech</TabsTrigger>
                  <TabsTrigger value="cultural">Cultural</TabsTrigger>
                  <TabsTrigger value="sports">Sports</TabsTrigger>
                  <TabsTrigger value="academic">Academic</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
              <Button size="sm">
                <Calendar className="mr-2 h-4 w-4" />
                This Month
              </Button>
            </div>
          </div>

          <div className="space-y-6">
            {events.map((event) => (
              <Card key={event.id} className="overflow-hidden">
                <img src={event.image || "/placeholder.svg"} alt={event.title} className="h-48 w-full object-cover" />
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar>
                        <AvatarImage src={event.hostCollege.logo || "/placeholder.svg"} alt={event.hostCollege.name} />
                        <AvatarFallback>{event.hostCollege.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle>{event.title}</CardTitle>
                        <CardDescription>Hosted by {event.hostCollege.name}</CardDescription>
                      </div>
                    </div>
                    <Badge>{event.category}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">{event.description}</p>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Calendar className="mr-1 h-4 w-4" />
                      {event.date}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="mr-1 h-4 w-4" />
                      {event.location}
                    </div>
                    <div className="flex items-center">
                      <Users className="mr-1 h-4 w-4" />
                      {event.attendees} attending
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between border-t p-4">
                  <div className="flex gap-4">
                    <Button variant="ghost" size="sm">
                      <ThumbsUp className="mr-2 h-4 w-4" />
                      Interested
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Comment
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Share2 className="mr-2 h-4 w-4" />
                      Share
                    </Button>
                  </div>
                  <Button>Register</Button>
                </CardFooter>

                {/* Comment Section */}
                {event.comments.length > 0 && (
                  <div className="border-t p-4">
                    <h3 className="mb-4 font-medium">Comment Wall</h3>
                    <div className="space-y-4">
                      {event.comments.map((comment) => (
                        <div key={comment.id} className="space-y-4">
                          <div className="flex gap-3">
                            <Avatar>
                              <AvatarImage
                                src={comment.author.avatar || "/placeholder.svg"}
                                alt={comment.author.name}
                              />
                              <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="rounded-lg bg-muted p-3">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="font-semibold">{comment.author.name}</p>
                                    <p className="text-xs text-muted-foreground">{comment.author.college}</p>
                                  </div>
                                  <p className="text-xs text-muted-foreground">{comment.timestamp}</p>
                                </div>
                                <p className="mt-2">{comment.content}</p>
                              </div>
                              <div className="mt-1 flex gap-4 pl-3">
                                <Button variant="ghost" size="sm">
                                  <ThumbsUp className="mr-1 h-3 w-3" />
                                  {comment.likes}
                                </Button>
                                <Button variant="ghost" size="sm">
                                  Reply
                                </Button>
                              </div>
                            </div>
                          </div>

                          {/* Replies */}
                          {comment.replies && comment.replies.length > 0 && (
                            <div className="ml-12 space-y-4">
                              {comment.replies.map((reply) => (
                                <div key={reply.id} className="flex gap-3">
                                  <Avatar className="h-8 w-8">
                                    <AvatarImage
                                      src={reply.author.avatar || "/placeholder.svg"}
                                      alt={reply.author.name}
                                    />
                                    <AvatarFallback>{reply.author.name.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                  <div className="flex-1">
                                    <div className="rounded-lg bg-muted p-3">
                                      <div className="flex items-center justify-between">
                                        <div>
                                          <p className="font-semibold">{reply.author.name}</p>
                                          <p className="text-xs text-muted-foreground">{reply.author.college}</p>
                                        </div>
                                        <p className="text-xs text-muted-foreground">{reply.timestamp}</p>
                                      </div>
                                      <p className="mt-2">{reply.content}</p>
                                    </div>
                                    <div className="mt-1 flex gap-4 pl-3">
                                      <Button variant="ghost" size="sm">
                                        <ThumbsUp className="mr-1 h-3 w-3" />
                                        {reply.likes}
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 flex gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Your Avatar" />
                        <AvatarFallback>YA</AvatarFallback>
                      </Avatar>
                      <Input placeholder="Write a comment..." className="flex-1" />
                      <Button size="sm">Post</Button>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
