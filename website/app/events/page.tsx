"use client";

import { Calendar, ChevronLeft, ChevronRight, Filter, MapPin, Search, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useState } from "react";
import { db, auth } from "@/lib/firebase";
import { collection, getDocs, doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

// Sample team data (migrated from competitions page)
const myTeams = [
  {
    id: 1,
    name: "Code Ninjas",
    competition: "CodeCraft 2023",
    members: [
      {
        name: "Alex Johnson",
        college: "NIT Trichy",
        avatar: "/placeholder.svg?height=40&width=40",
        isLeader: true,
      },
      {
        name: "Priya Patel",
        college: "NIT Trichy",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      {
        name: "Rahul Sharma",
        college: "NIT Trichy",
        avatar: "/placeholder.svg?height=40&width=40",
      },
    ],
    status: "Registered",
  },
  {
    id: 2,
    name: "Debate Masters",
    competition: "Debate Championship",
    members: [
      {
        name: "Alex Johnson",
        college: "NIT Trichy",
        avatar: "/placeholder.svg?height=40&width=40",
        isLeader: true,
      },
      {
        name: "Sneha Gupta",
        college: "NIT Trichy",
        avatar: "/placeholder.svg?height=40&width=40",
      },
    ],
    status: "Pending",
  },
]


// Calendar data
const currentMonth = "May 2023"


export default function EventsPage() {
  const [student, setStudent] = useState<any>(null);
  const [registeredEvents, setRegisteredEvents] = useState<string[]>([]);
  const [userLoading, setUserLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const studentRef = doc(db, "Students", user.uid);
        const studentSnap = await getDoc(studentRef);
        if (studentSnap.exists()) {
          setStudent(studentSnap.data());
          setRegisteredEvents(studentSnap.data().registeredEvents || []);
        }
      }
      setUserLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleRegister = async (eventId: string) => {
    if (!student || !auth.currentUser) {
      alert("You must be signed in to register.");
      return;
    }
    try {
      const studentRef = doc(db, "Students", auth.currentUser.uid);
      await updateDoc(studentRef, {
        registeredEvents: arrayUnion(eventId)
      });
      setRegisteredEvents((prev) => [...prev, eventId]);
      alert("Registration successful!");
    } catch (error) {
      console.error("Registration failed:", error);
      alert("Registration failed: " + (error as Error).message);
    }
  };
  // Filter state
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedCollege, setSelectedCollege] = useState("All Colleges");
  const [selectedDateRange, setSelectedDateRange] = useState("Upcoming");
  const [events, setEvents] = useState<any[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);

  // Filtering logic for events
  const filteredEvents = events.filter(event => {
    // Category filter
    if (selectedCategory !== "All Categories" && event.eventtype !== selectedCategory) return false;
    // College filter
    if (selectedCollege !== "All Colleges" && event.collegename !== selectedCollege) return false;
    // Date range filter
    if (selectedDateRange === "Upcoming" || selectedDateRange === "Past") {
      const dateMatch = event.eventdates?.match(/([A-Za-z]+) (\d+)(?:-(\d+))?(?:,)? (\d{4})/);
      if (!dateMatch) return false;
      const monthName = dateMatch[1];
      const startDay = parseInt(dateMatch[2], 10);
      const endDay = dateMatch[3] ? parseInt(dateMatch[3], 10) : startDay;
      const eventYear = parseInt(dateMatch[4], 10);
      const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      const eventMonth = months.findIndex(m => m.toLowerCase() === monthName.toLowerCase());
      if (eventMonth === -1) return false;
      const now = new Date();
      const todayDay = now.getDate();
      const todayMonth = now.getMonth();
      const todayYear = now.getFullYear();
      if (selectedDateRange === "Upcoming") {
        if (eventYear > todayYear) return true;
        if (eventYear < todayYear) return false;
        if (eventMonth > todayMonth) return true;
        if (eventMonth < todayMonth) return false;
        return endDay >= todayDay;
      } else if (selectedDateRange === "Past") {
        if (eventYear < todayYear) return true;
        if (eventYear > todayYear) return false;
        if (eventMonth < todayMonth) return true;
        if (eventMonth > todayMonth) return false;
        return endDay < todayDay;
      }
    }
    return true;
  });

  // Generate dynamic calendar days for current month (May 2025)
  const currentMonth = 4; // May (0-indexed)
  const currentYear = 2025;
  const daysInMonth = 31;

  // Calendar selection state
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  // Helper to extract days from eventdates like "May 4-6, 2025" or "May 15, 2025"
  function getEventDays(eventdates: string): number[] {
    if (!eventdates) return [];
    // Only process events for May 2025
    if (!eventdates.includes("May") || !eventdates.includes("2025")) return [];
    const rangeMatch = eventdates.match(/May (\d+)-(\d+), 2025/);
    if (rangeMatch) {
      const start = parseInt(rangeMatch[1], 10);
      const end = parseInt(rangeMatch[2], 10);
      if (!isNaN(start) && !isNaN(end)) {
        return Array.from({ length: end - start + 1 }, (_, i) => start + i);
      }
    }
    const singleMatch = eventdates.match(/May (\d+), 2025/);
    if (singleMatch) {
      const day = parseInt(singleMatch[1], 10);
      if (!isNaN(day)) return [day];
    }
    return [];
  }

  // Compute event counts for each day
  const eventCountByDay: Record<number, number> = {};
  filteredEvents.forEach(event => {
    getEventDays(event.eventdates).forEach(day => {
      eventCountByDay[day] = (eventCountByDay[day] || 0) + 1;
    });
  });

  const calendarDays = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    return {
      date: day,
      events: eventCountByDay[day] || 0,
      isHighlighted: !!eventCountByDay[day],
    };
  });


  useEffect(() => {
    async function fetchEvents() {
      try {
        const querySnapshot = await getDocs(collection(db, "GlobalEvents"));
        const fetchedEvents: any[] = [];
        querySnapshot.forEach((doc) => {
          fetchedEvents.push({ id: doc.id, ...doc.data() });
        });
        setEvents(fetchedEvents);
      } catch (error) {
        console.error("Failed to fetch events:", error);
      } finally {
        setLoadingEvents(false);
      }
    }
    fetchEvents();
  }, []);

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
                <TabsTrigger value="myteams">My Teams</TabsTrigger>
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
                    {filteredEvents.length === 0 && (
                      <div className="text-muted-foreground col-span-3 text-center py-8">No upcoming events found.</div>
                    )}
                    {filteredEvents.map((event) => (
                      <Card key={event.id} className="overflow-hidden">
                        <div className="sm:flex">
                          <div className="sm:w-1/3">
                            <img
                              src={event.image || "/placeholder.svg"}
                              alt={event.title || "Event"}
                              className="h-48 w-full object-cover sm:h-full"
                            />
                          </div>
                          <div className="sm:w-2/3">
                            <CardHeader>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Avatar className="h-6 w-6">
                                    <AvatarImage
                                      src={event.image || "/placeholder.svg"}
                                      alt={event.collegename || "College"}
                                    />
                                    <AvatarFallback>{(event.collegename && event.collegename.charAt(0)) || "C"}</AvatarFallback>
                                  </Avatar>
                                  <CardTitle className="text-lg">{event.title || "Event Title"}</CardTitle>
                                </div>
                                <Badge>{event.eventtype || "Type"}</Badge>
                              </div>
                              <CardDescription>Hosted by {event.collegename || "College"}</CardDescription>
                            </CardHeader>
                            <CardContent>
                              <p className="mb-4 line-clamp-2">{event.content || "No description available."}</p>
                              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center">
                                  <Calendar className="mr-1 h-4 w-4" />
                                  {event.eventdates || "Event Dates"}
                                </div>
                                <div className="flex items-center">
                                  <Users className="mr-1 h-4 w-4" />
                                  Members: {event.members || "N/A"}
                                </div>
                                <div className="flex items-center">
                                  <Badge variant="secondary">Prize: ₹{event.prize || "N/A"}</Badge>
                                </div>
                              </div>
                            </CardContent>
                            <CardFooter className="flex justify-between">
                              <p className="text-sm text-muted-foreground">
                                Event type: {event.eventtype || "N/A"}
                              </p>
                              {registeredEvents.includes(event.id) ? (
  <Button variant="secondary" disabled>Registered</Button>
) : (
  <Button variant="default" onClick={() => handleRegister(event.id)}>Register Now</Button>
)}
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
                        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="All Categories">All Categories</SelectItem>
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
                        <Select value={selectedCollege} onValueChange={setSelectedCollege}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select college" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="All Colleges">All Colleges</SelectItem>
                            <SelectItem value="iit">IIT Delhi</SelectItem>
                            <SelectItem value="bits">BITS Pilani</SelectItem>
                            <SelectItem value="iim">IIM Ahmedabad</SelectItem>
                            <SelectItem value="nit">NIT Trichy</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Date Range</label>
                        <Select value={selectedDateRange} onValueChange={setSelectedDateRange}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select date range" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Upcoming">Upcoming</SelectItem>
                            <SelectItem value="Past">Past</SelectItem>
                            <SelectItem value="today">Today</SelectItem>
                            <SelectItem value="week">This Week</SelectItem>
                            <SelectItem value="month">This Month</SelectItem>
                            <SelectItem value="custom">Custom Range</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button className="w-full" onClick={() => {}}>Apply Filters</Button>
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
                        className={`relative rounded-md p-2 text-center hover:bg-accent cursor-pointer ${
                          day.isHighlighted ? "bg-primary/10" : ""
                        } ${selectedDay === day.date ? "ring-2 ring-primary" : ""}`}
                        onClick={() => setSelectedDay(day.date)}
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
                    <h3 className="font-medium">
                      {selectedDay ? `Events on May ${selectedDay}, 2025` : "Select a date to view events"}
                    </h3>
                    <div className="space-y-2">
                      {events.filter(event =>
                        selectedDay !== null && getEventDays(event.eventdates).includes(selectedDay)
                      ).length === 0 && (
                        <div className="text-muted-foreground">No events on this day.</div>
                      )}
                      {events
                        .filter(event => selectedDay !== null && getEventDays(event.eventdates).includes(selectedDay))
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
    {events.filter(event => registeredEvents.includes(event.id)).map((event) => (
      <Card key={event.id} className="overflow-hidden">
        <div className="sm:flex">
          <div className="sm:w-1/3">
            <img
              src={event.image || "/placeholder.svg"}
              alt={event.title || "Event"}
              className="h-48 w-full object-cover sm:h-full"
            />
          </div>
          <div className="sm:w-2/3">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage
                      src={event.image || "/placeholder.svg"}
                      alt={event.collegename || "College"}
                    />
                    <AvatarFallback>{(event.collegename && event.collegename.charAt(0)) || "C"}</AvatarFallback>
                  </Avatar>
                  <CardTitle className="text-lg">{event.title || "Event Title"}</CardTitle>
                </div>
                <Badge>{event.eventtype || "Type"}</Badge>
              </div>
              <CardDescription>Hosted by {event.collegename || "College"}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4 line-clamp-2">{event.content || "No description available."}</p>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Calendar className="mr-1 h-4 w-4" />
                  {event.eventdates || "Event Dates"}
                </div>
                <div className="flex items-center">
                  <Users className="mr-1 h-4 w-4" />
                  Members: {event.members || "N/A"}
                </div>
                <div className="flex items-center">
                  <Badge variant="secondary">Prize: ₹{event.prize || "N/A"}</Badge>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">View Details</Button>
              <Button variant="secondary" disabled>Registered</Button>
              <Button variant="secondary">View Photos</Button>
            </CardFooter>
          </div>
        </div>
      </Card>
    ))}
    {events.filter(event => registeredEvents.includes(event.id)).length === 0 && (
      <div className="col-span-full text-center text-muted-foreground py-8">You have not registered for any events yet.</div>
    )}
  </div>
</TabsContent>

            <TabsContent value="past" className="mt-0">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {events.filter((event) => {
                  // Parse event end date from event.eventdates (supports "May 4-6, 2025" or "May 15, 2025")
const dateMatch = event.eventdates?.match(/([A-Za-z]+) (\d+)(?:-(\d+))?, (\d{4})/);
if (!dateMatch) return false;
const monthName = dateMatch[1];
const startDay = parseInt(dateMatch[2], 10);
const endDay = dateMatch[3] ? parseInt(dateMatch[3], 10) : startDay;
const eventYear = parseInt(dateMatch[4], 10);
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const eventMonth = months.findIndex(m => m.toLowerCase() === monthName.toLowerCase());
if (eventMonth === -1) return false;
                  // Use the real current date
const now = new Date();
const todayDay = now.getDate();
const todayMonth = now.getMonth(); // 0-indexed: 4 = May
const todayYear = now.getFullYear();
                  if (eventYear < todayYear) return true;
if (eventYear > todayYear) return false;
if (eventMonth < todayMonth) return true;
if (eventMonth > todayMonth) return false;
return endDay < todayDay;
                }).length === 0 && (
                  <div className="text-muted-foreground col-span-3 text-center py-8">No past events found.</div>
                )}
                {events.filter((event) => {
                  // Parse event end date from event.eventdates (supports "May 4-6, 2025" or "May 15, 2025")
const dateMatch = event.eventdates?.match(/([A-Za-z]+) (\d+)(?:-(\d+))?, (\d{4})/);
if (!dateMatch) return false;
const monthName = dateMatch[1];
const startDay = parseInt(dateMatch[2], 10);
const endDay = dateMatch[3] ? parseInt(dateMatch[3], 10) : startDay;
const eventYear = parseInt(dateMatch[4], 10);
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const eventMonth = months.findIndex(m => m.toLowerCase() === monthName.toLowerCase());
if (eventMonth === -1) return false;
                  // Use the real current date
const now = new Date();
const todayDay = now.getDate();
const todayMonth = now.getMonth(); // 0-indexed: 4 = May
const todayYear = now.getFullYear();
                  if (eventYear < todayYear) return true;
if (eventYear > todayYear) return false;
if (eventMonth < todayMonth) return true;
if (eventMonth > todayMonth) return false;
return endDay < todayDay;
                }).map((event) => (
                  <Card key={event.id} className="overflow-hidden opacity-80">
                    <div className="relative">
                      <img
                        src={event.image || "/placeholder.svg"}
                        alt={event.title || "Event"}
                        className="h-48 w-full object-cover"
                      />
                      <div className="absolute top-2 left-2 bg-primary text-primary-foreground rounded px-2 py-1 text-xs">
                        {event.eventtype || "Type"}
                      </div>
                      <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
                        <Badge variant="secondary" className="text-lg py-1 px-3">
                          Completed
                        </Badge>
                      </div>
                    </div>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">{event.title || "Event Title"}</CardTitle>
                        <Badge variant="outline">{event.collegename || "College"}</Badge>
                      </div>
                      <CardDescription>{event.eventdates || "Event Dates"}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          {event.location || "Location not set"}
                        </div>
                        <div>
                          <span className="font-medium">Description:</span> {event.content || "No description available."}
                        </div>
                        <div>
                          <span className="font-medium">Team Size:</span> {event.members || "N/A"}
                        </div>
                        <div>
                          <span className="font-medium">Prize:</span> ₹{event.prize || "N/A"}
                        </div>
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

            <TabsContent value="myteams" className="mt-0">
              <div className="space-y-6">
                <div className="flex justify-between">
                  <h2 className="text-2xl font-bold">My Teams</h2>
                  <Button>
                    <Users className="mr-2 h-4 w-4" />
                    Create New Team
                  </Button>
                </div>
                {myTeams.map((team) => (
                  <Card key={team.id}>
                    <CardHeader>
                      <div className="flex justify-between">
                        <div>
                          <CardTitle>{team.name}</CardTitle>
                          <CardDescription>For {team.competition}</CardDescription>
                        </div>
                        <Badge variant={team.status === "Registered" ? "default" : "outline"}>{team.status}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <h3 className="font-medium">Team Members</h3>
                        <div className="space-y-2">
                          {team.members.map((member) => (
                            <div key={member.name} className="flex items-center justify-between rounded-md border p-3">
                              <div className="flex items-center gap-3">
                                <Avatar>
                                  <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                                  <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium">{member.name}</p>
                                  <p className="text-xs text-muted-foreground">{member.college}</p>
                                </div>
                              </div>
                              {member.isLeader && <Badge variant="outline">Team Leader</Badge>}
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline">Edit Team</Button>
                      {team.status === "Pending" ? (
                        <Button>Complete Registration</Button>
                      ) : (
                        <Button variant="outline">View Details</Button>
                      )}
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
