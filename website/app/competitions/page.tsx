import { Calendar, Clock, Filter, MapPin, Search, Trophy, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"

// Sample data - in a real app, this would come from your database
const competitions = [
  {
    id: 1,
    title: "CodeCraft 2023",
    description:
      "The ultimate coding competition to test your programming skills. Solve complex algorithmic problems within a time limit.",
    type: "Hackathon",
    date: "May 25, 2023",
    registrationDeadline: "May 20, 2023",
    location: "Online",
    teamSize: "1-3 members",
    prize: "₹50,000",
    image: "/placeholder.svg?height=200&width=400",
    hostCollege: {
      name: "IIT Bombay",
      logo: "/placeholder.svg?height=40&width=40",
    },
    registrations: 120,
    maxRegistrations: 200,
  },
  {
    id: 2,
    title: "Debate Championship",
    description:
      "A platform to showcase your oratory skills and critical thinking. Debate on current affairs and social issues.",
    type: "Debate",
    date: "June 10, 2023",
    registrationDeadline: "June 5, 2023",
    location: "Delhi University",
    teamSize: "2 members",
    prize: "₹30,000",
    image: "/placeholder.svg?height=200&width=400",
    hostCollege: {
      name: "Delhi University",
      logo: "/placeholder.svg?height=40&width=40",
    },
    registrations: 45,
    maxRegistrations: 50,
  },
  {
    id: 3,
    title: "QuizMaster 2023",
    description:
      "Test your general knowledge and quick thinking in this fast-paced quiz competition covering various topics.",
    type: "Quiz",
    date: "May 30, 2023",
    registrationDeadline: "May 25, 2023",
    location: "BITS Pilani",
    teamSize: "2 members",
    prize: "₹25,000",
    image: "/placeholder.svg?height=200&width=400",
    hostCollege: {
      name: "BITS Pilani",
      logo: "/placeholder.svg?height=40&width=40",
    },
    registrations: 80,
    maxRegistrations: 100,
  },
  {
    id: 4,
    title: "Sports Tournament",
    description:
      "Compete in various sports including cricket, football, basketball, and athletics. Show your sporting talent.",
    type: "Sports",
    date: "June 15-20, 2023",
    registrationDeadline: "June 10, 2023",
    location: "Punjab University",
    teamSize: "Varies by sport",
    prize: "Trophies and medals",
    image: "/placeholder.svg?height=200&width=400",
    hostCollege: {
      name: "Punjab University",
      logo: "/placeholder.svg?height=40&width=40",
    },
    registrations: 200,
    maxRegistrations: 300,
  },
  {
    id: 5,
    title: "Business Case Competition",
    description: "Analyze real-world business problems and present innovative solutions. Judged by industry experts.",
    type: "Case Competition",
    date: "June 5, 2023",
    registrationDeadline: "May 30, 2023",
    location: "IIM Ahmedabad",
    teamSize: "3-4 members",
    prize: "₹75,000",
    image: "/placeholder.svg?height=200&width=400",
    hostCollege: {
      name: "IIM Ahmedabad",
      logo: "/placeholder.svg?height=40&width=40",
    },
    registrations: 60,
    maxRegistrations: 80,
  },
]

// Sample team data
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

export default function CompetitionsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex h-16 items-center gap-4 border-b bg-background px-6">
        <SidebarTrigger />
        <div>
          <h1 className="font-semibold">Competitions</h1>
          <p className="text-xs text-muted-foreground">Register for competitions and form teams</p>
        </div>
      </header>

      <main className="flex-1 p-6 md:p-10">
        <div className="mx-auto max-w-7xl">
          <Tabs defaultValue="all" className="w-full">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <TabsList>
                <TabsTrigger value="all">All Competitions</TabsTrigger>
                <TabsTrigger value="hackathons">Hackathons</TabsTrigger>
                <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
                <TabsTrigger value="debates">Debates</TabsTrigger>
                <TabsTrigger value="sports">Sports</TabsTrigger>
                <TabsTrigger value="myteams">My Teams</TabsTrigger>
              </TabsList>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search competitions..."
                    className="w-full rounded-md pl-8 md:w-[200px] lg:w-[300px]"
                  />
                </div>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <TabsContent value="all" className="mt-0">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {competitions.map((competition) => (
                  <Card key={competition.id} className="overflow-hidden">
                    <div className="relative">
                      <img
                        src={competition.image || "/placeholder.svg"}
                        alt={competition.title}
                        className="h-48 w-full object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        <Badge>{competition.type}</Badge>
                      </div>
                    </div>
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage
                            src={competition.hostCollege.logo || "/placeholder.svg"}
                            alt={competition.hostCollege.name}
                          />
                          <AvatarFallback>{competition.hostCollege.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <CardTitle className="text-lg">{competition.title}</CardTitle>
                      </div>
                      <CardDescription>Hosted by {competition.hostCollege.name}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="line-clamp-2 text-sm">{competition.description}</p>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>{competition.date}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{competition.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>{competition.teamSize}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Trophy className="h-4 w-4 text-muted-foreground" />
                          <span>{competition.prize}</span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Registrations</span>
                          <span>
                            {competition.registrations}/{competition.maxRegistrations}
                          </span>
                        </div>
                        <Progress value={(competition.registrations / competition.maxRegistrations) * 100} />
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <div className="text-sm text-muted-foreground">
                        <Clock className="mr-1 inline-block h-4 w-4" />
                        Closes {competition.registrationDeadline}
                      </div>
                      <Button>Register</Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="hackathons" className="mt-0">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {competitions
                  .filter((comp) => comp.type === "Hackathon")
                  .map((competition) => (
                    <Card key={competition.id} className="overflow-hidden">
                      <div className="relative">
                        <img
                          src={competition.image || "/placeholder.svg"}
                          alt={competition.title}
                          className="h-48 w-full object-cover"
                        />
                        <div className="absolute top-2 right-2">
                          <Badge>{competition.type}</Badge>
                        </div>
                      </div>
                      <CardHeader>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage
                              src={competition.hostCollege.logo || "/placeholder.svg"}
                              alt={competition.hostCollege.name}
                            />
                            <AvatarFallback>{competition.hostCollege.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <CardTitle className="text-lg">{competition.title}</CardTitle>
                        </div>
                        <CardDescription>Hosted by {competition.hostCollege.name}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="line-clamp-2 text-sm">{competition.description}</p>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>{competition.date}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span>{competition.location}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span>{competition.teamSize}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Trophy className="h-4 w-4 text-muted-foreground" />
                            <span>{competition.prize}</span>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>Registrations</span>
                            <span>
                              {competition.registrations}/{competition.maxRegistrations}
                            </span>
                          </div>
                          <Progress value={(competition.registrations / competition.maxRegistrations) * 100} />
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <div className="text-sm text-muted-foreground">
                          <Clock className="mr-1 inline-block h-4 w-4" />
                          Closes {competition.registrationDeadline}
                        </div>
                        <Button>Register</Button>
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
