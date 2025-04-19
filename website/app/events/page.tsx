import { Calendar, ChevronLeft, ChevronRight, Filter, MapPin, Search, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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
    registrationDeadline: "May 15, 2023",
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
    registrationDeadline: "May 30, 2023",
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
    registrationDeadline: "May 5, 2023",
  },
  {
    id: 4,
    title: "Sports Tournament 2023",
    description:
      "Compete in various sports including cricket, football, basketball, and athletics. Represent your college and win trophies.",
    date: "June 10-15, 2023",
    location: "Punjab University",
    category: "Sports",
    image: "/placeholder.svg?height=200&width=400",
    hostCollege: {
      name: "Punjab University",
      logo: "/placeholder.svg?height=40&width=40",
    },
    attendees: 450,
    registrationDeadline: "June 1, 2023",
  },
  {
    id: 5,
    title: "Research Symposium",
    description:
      "Present your research papers and get feedback from experts in the field. Network with researchers from other institutions.",
    date: "May 25, 2023",
    location: "NIT Trichy",
    category: "Academic",
    image: "/placeholder.svg?height=200&width=400",
    hostCollege: {
      name: "NIT Trichy",
      logo: "/placeholder.svg?height=40&width=40",
    },
    attendees: 180,
    registrationDeadline: "May 20, 2023",
  },
]

// Calendar data
const currentMonth = "May 2023"
const calendarDays = [
  { date: 1, events: 0 },
  { date: 2, events: 0 },
  { date: 3, events: 0 },
  { date: 4, events: 0 },
  { date: 5, events: 0 },
  { date: 6, events: 0 },
  { date: 7, events: 0 },
  { date: 8, events: 0 },
  { date: 9, events: 0 },
  { date: 10, events: 0 },
  { date: 11, events: 0 },
  { date: 12, events: 0 },
  { date: 13, events: 0 },
  { date: 14, events: 0 },
  { date: 15, events: 2, isHighlighted: true },
  { date: 16, events: 0 },
  { date: 17, events: 0 },
  { date: 18, events: 0 },
  { date: 19, events: 0 },
  { date: 20, events: 1, isHighlighted: true },
  { date: 21, events: 1, isHighlighted: true },
  { date: 22, events: 1, isHighlighted: true },
  { date: 23, events: 0 },
  { date: 24, events: 0 },
  { date: 25, events: 1, isHighlighted: true },
  { date: 26, events: 0 },
  { date: 27, events: 0 },
  { date: 28, events: 0 },
  { date: 29, events: 0 },
  { date: 30, events: 0 },
  { date: 31, events: 0 },
]

import ChatRoom from "@/components/ChatRoom";

export default function EventsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex h-16 items-center gap-4 border-b bg-background px-6">
        <SidebarTrigger />
        <div>
          <h1 className="font-semibold">Events</h1>
          <p className="text-xs text-muted-foreground">Discover and register for upcoming events</p>
        </div>
      </header>

      <main className="flex-1 p-6 md:p-10">
        <div className="mx-auto max-w-7xl">
          <Tabs defaultValue="upcoming" className="w-full">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <TabsList>
                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                <TabsTrigger value="calendar">Calendar</TabsTrigger>
                <TabsTrigger value="registered">Registered</TabsTrigger>
                <TabsTrigger value="past">Past Events</TabsTrigger>
              </TabsList>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search events..."
                    className="w-full rounded-md pl-8 md:w-[200px] lg:w-[300px]"
                  />
                </div>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <TabsContent value="upcoming" className="mt-0">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-3/4">
                  <div className="grid gap-6">
                    {events.map((event) => (
                      <Card key={event.id} className="overflow-hidden">
                        <div className="sm:flex">
                          <div className="sm:w-1/3">
                            <img
                              src={event.image || "/placeholder.svg"}
                              alt={event.title}
                              className="h-48 w-full object-cover sm:h-full"
                            />
                          </div>
                          <div className="sm:w-2/3">
                            <CardHeader>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Avatar className="h-6 w-6">
                                    <AvatarImage
                                      src={event.hostCollege.logo || "/placeholder.svg"}
                                      alt={event.hostCollege.name}
                                    />
                                    <AvatarFallback>{event.hostCollege.name.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                  <CardTitle className="text-lg">{event.title}</CardTitle>
                                </div>
                                <Badge>{event.category}</Badge>
                              </div>
                              <CardDescription>Hosted by {event.hostCollege.name}</CardDescription>
                            </CardHeader>
                            <CardContent>
                              <p className="mb-4 line-clamp-2">{event.description}</p>
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
                            <CardFooter className="flex justify-between">
                              <p className="text-sm text-muted-foreground">
                                Registration closes on {event.registrationDeadline}
                              </p>
                              <Button>Register Now</Button>
                            </CardFooter>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>

                <div className="md:w-1/4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Filter Events</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Category</label>
                        <Select defaultValue="all">
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            <SelectItem value="tech">Tech</SelectItem>
                            <SelectItem value="cultural">Cultural</SelectItem>
                            <SelectItem value="sports">Sports</SelectItem>
                            <SelectItem value="academic">Academic</SelectItem>
                            <SelectItem value="business">Business</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">College</label>
                        <Select defaultValue="all">
                          <SelectTrigger>
                            <SelectValue placeholder="Select college" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Colleges</SelectItem>
                            <SelectItem value="iit">IIT Delhi</SelectItem>
                            <SelectItem value="bits">BITS Pilani</SelectItem>
                            <SelectItem value="iim">IIM Ahmedabad</SelectItem>
                            <SelectItem value="nit">NIT Trichy</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Date Range</label>
                        <Select defaultValue="upcoming">
                          <SelectTrigger>
                            <SelectValue placeholder="Select date range" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="upcoming">Upcoming</SelectItem>
                            <SelectItem value="today">Today</SelectItem>
                            <SelectItem value="week">This Week</SelectItem>
                            <SelectItem value="month">This Month</SelectItem>
                            <SelectItem value="custom">Custom Range</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button className="w-full">Apply Filters</Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="calendar" className="mt-0">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{currentMonth}</CardTitle>
                    <div className="flex gap-1">
                      <Button variant="outline" size="icon">
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon">
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-7 gap-1 text-center">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                      <div key={day} className="p-2 text-sm font-medium">
                        {day}
                      </div>
                    ))}
                    {/* Empty cells for days before the 1st of the month */}
                    {Array.from({ length: 1 }).map((_, index) => (
                      <div key={`empty-${index}`} className="p-2" />
                    ))}
                    {calendarDays.map((day) => (
                      <div
                        key={day.date}
                        className={`relative rounded-md p-2 text-center hover:bg-accent ${
                          day.isHighlighted ? "bg-primary/10" : ""
                        }`}
                      >
                        <span className="text-sm">{day.date}</span>
                        {day.events > 0 && (
                          <span className="absolute bottom-1 right-1 flex h-2 w-2 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                            <span className="sr-only">{day.events} events</span>
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <div className="space-y-4 w-full">
                    <Separator />
                    <h3 className="font-medium">Events on May 15, 2023</h3>
                    <div className="space-y-2">
                      {events
                        .filter((event) => event.date.includes("May 15"))
                        .map((event) => (
                          <div key={event.id} className="flex items-center justify-between rounded-md border p-3">
                            <div className="flex items-center gap-2">
                              <div className="h-10 w-1 rounded-full bg-primary" />
                              <div>
                                <p className="font-medium">{event.title}</p>
                                <p className="text-xs text-muted-foreground">{event.location}</p>
                              </div>
                            </div>
                            <Button size="sm">View</Button>
                          </div>
                        ))}
                    </div>
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="registered" className="mt-0">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {events.slice(0, 2).map((event) => (
                  <Card key={event.id} className="overflow-hidden">
                    <img
                      src={event.image || "/placeholder.svg"}
                      alt={event.title}
                      className="h-48 w-full object-cover"
                    />
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">{event.title}</CardTitle>
                        <Badge>{event.category}</Badge>
                      </div>
                      <CardDescription>{event.date}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        {event.location}
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline">View Details</Button>
                      <Button variant="destructive">Cancel Registration</Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="past" className="mt-0">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {events.slice(2, 5).map((event) => (
                  <Card key={event.id} className="overflow-hidden opacity-80">
                    <div className="relative">
                      <img
                        src={event.image || "/placeholder.svg"}
                        alt={event.title}
                        className="h-48 w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
                        <Badge variant="secondary" className="text-lg py-1 px-3">
                          Completed
                        </Badge>
                      </div>
                    </div>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">{event.title}</CardTitle>
                        <Badge variant="outline">{event.category}</Badge>
                      </div>
                      <CardDescription>{event.date}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        {event.location}
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline">View Details</Button>
                      <Button variant="secondary">View Photos</Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
        <div className="mt-10">
          <h2 className="font-semibold mb-2">Global Event Chatroom</h2>
          <ChatRoom roomId="global" />
        </div>
      </main>
    </div>
  )
}
