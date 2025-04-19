import { Bell, Calendar, MessageCircle, PlusCircle, ThumbsUp, Vote } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Sample data - in a real app, this would come from your database
const notices = [
  {
    id: 1,
    title: "Semester Registration Deadline",
    content:
      "All students must complete their semester registration by April 30th. Late registrations will incur a penalty fee.",
    date: "Apr 20, 2023",
    author: "Academic Office",
    important: true,
  },
  {
    id: 2,
    title: "Campus Wi-Fi Maintenance",
    content: "The campus Wi-Fi network will be down for maintenance on Saturday from 2 AM to 5 AM.",
    date: "Apr 18, 2023",
    author: "IT Department",
    important: false,
  },
  {
    id: 3,
    title: "Library Extended Hours",
    content: "The central library will remain open until midnight during the exam period (May 1-15).",
    date: "Apr 15, 2023",
    author: "Library",
    important: false,
  },
]

const events = [
  {
    id: 1,
    title: "Annual Tech Fest",
    description: "Join us for the biggest tech festival of the year with workshops, competitions, and guest lectures.",
    date: "May 15-17, 2023",
    location: "Main Auditorium",
    image: "/placeholder.svg?height=100&width=200",
    organizer: "Technical Club",
  },
  {
    id: 2,
    title: "Career Fair 2023",
    description: "Meet recruiters from over 50 companies. Bring your resume and dress professionally.",
    date: "May 5, 2023",
    location: "Convention Center",
    image: "/placeholder.svg?height=100&width=200",
    organizer: "Placement Cell",
  },
  {
    id: 3,
    title: "Cultural Night",
    description: "An evening of music, dance, and drama performances by students.",
    date: "Apr 28, 2023",
    location: "Open Air Theater",
    image: "/placeholder.svg?height=100&width=200",
    organizer: "Cultural Committee",
  },
]

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

export default function GlobalFeedPage() {
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
                  Subscribe to Notifications
                </Button>
              </div>
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
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {events.map((event) => (
                  <Card key={event.id} className="overflow-hidden">
                    <img
                      src={event.image || "/placeholder.svg"}
                      alt={event.title}
                      className="w-full h-40 object-cover"
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
                      <div className="space-y-4">
                        {poll.options.map((option) => {
                          const percentage = Math.round((option.votes / poll.totalVotes) * 100)
                          return (
                            <div key={option.id} className="space-y-2">
                              <div className="flex justify-between">
                                <span>{option.text}</span>
                                <span>{percentage}%</span>
                              </div>
                              <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                                <div className="h-full bg-primary" style={{ width: `${percentage}%` }} />
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full">Vote Now</Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Chatroom Tab */}
            <TabsContent value="chatroom" className="mt-6">
              <Card className="h-[calc(100vh-16rem)]">
                <CardHeader>
                  <CardTitle>Global Chatroom</CardTitle>
                  <CardDescription>Chat with students from all colleges</CardDescription>
                </CardHeader>
                <CardContent className="h-[calc(100%-12rem)] overflow-y-auto border-y p-4">
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <Avatar>
                        <AvatarImage src="/placeholder.svg?height=40&width=40" />
                        <AvatarFallback>RS</AvatarFallback>
                      </Avatar>
                      <div className="rounded-lg bg-muted p-3">
                        <p className="font-semibold">Rahul Sharma</p>
                        <p>Has anyone started working on the OS assignment?</p>
                        <p className="mt-1 text-xs text-muted-foreground">10:30 AM</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Avatar>
                        <AvatarImage src="/placeholder.svg?height=40&width=40" />
                        <AvatarFallback>PP</AvatarFallback>
                      </Avatar>
                      <div className="rounded-lg bg-muted p-3">
                        <p className="font-semibold">Priya Patel</p>
                        <p>Yes, I've started. It's quite challenging!</p>
                        <p className="mt-1 text-xs text-muted-foreground">10:32 AM</p>
                      </div>
                    </div>
                    <div className="flex justify-end gap-3">
                      <div className="rounded-lg bg-primary p-3 text-primary-foreground">
                        <p>I can help you both. Let's meet in the library at 4 PM?</p>
                        <p className="mt-1 text-xs opacity-70">10:35 AM</p>
                      </div>
                      <Avatar>
                        <AvatarImage src="/placeholder.svg?height=40&width=40" />
                        <AvatarFallback>ME</AvatarFallback>
                      </Avatar>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="p-4">
                  <div className="flex w-full gap-2">
                    <input
                      type="text"
                      placeholder="Type your message..."
                      className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                    />
                    <Button>Send</Button>
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Bulletin Tab */}
            <TabsContent value="bulletin" className="mt-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Student Bulletin Board</h2>
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Post to Bulletin
                </Button>
              </div>
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
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
