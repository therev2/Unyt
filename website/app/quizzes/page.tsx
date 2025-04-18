import { Award, Brain, Filter, Play, Search, Timer, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Sample data - in a real app, this would come from your database
const quizzes = [
  {
    id: 1,
    title: "General Knowledge Challenge",
    description:
      "Test your knowledge across various subjects including history, science, geography, and current affairs.",
    category: "General Knowledge",
    difficulty: "Medium",
    questions: 30,
    timeLimit: "30 minutes",
    participants: 245,
    image: "/placeholder.svg?height=200&width=400",
    hostCollege: {
      name: "Delhi University",
      logo: "/placeholder.svg?height=40&width=40",
    },
  },
  {
    id: 2,
    title: "Tech Trivia",
    description:
      "A quiz focused on technology, programming, and computer science concepts. Perfect for tech enthusiasts.",
    category: "Technology",
    difficulty: "Hard",
    questions: 25,
    timeLimit: "25 minutes",
    participants: 180,
    image: "/placeholder.svg?height=200&width=400",
    hostCollege: {
      name: "IIT Bombay",
      logo: "/placeholder.svg?height=40&width=40",
    },
  },
  {
    id: 3,
    title: "Business & Economics Quiz",
    description: "Test your knowledge of business concepts, economics, and current market trends.",
    category: "Business",
    difficulty: "Medium",
    questions: 20,
    timeLimit: "20 minutes",
    participants: 120,
    image: "/placeholder.svg?height=200&width=400",
    hostCollege: {
      name: "IIM Ahmedabad",
      logo: "/placeholder.svg?height=40&width=40",
    },
  },
  {
    id: 4,
    title: "Science Quiz",
    description: "Explore the wonders of science with questions on physics, chemistry, biology, and astronomy.",
    category: "Science",
    difficulty: "Easy",
    questions: 25,
    timeLimit: "25 minutes",
    participants: 210,
    image: "/placeholder.svg?height=200&width=400",
    hostCollege: {
      name: "NIT Trichy",
      logo: "/placeholder.svg?height=40&width=40",
    },
  },
  {
    id: 5,
    title: "Pop Culture Quiz",
    description: "Test your knowledge of movies, music, celebrities, and trending topics.",
    category: "Entertainment",
    difficulty: "Easy",
    questions: 30,
    timeLimit: "30 minutes",
    participants: 300,
    image: "/placeholder.svg?height=200&width=400",
    hostCollege: {
      name: "BITS Pilani",
      logo: "/placeholder.svg?height=40&width=40",
    },
  },
]

// Sample battle data
const battleRooms = [
  {
    id: 1,
    title: "Tech Showdown",
    category: "Technology",
    difficulty: "Medium",
    questions: 15,
    timeLimit: "15 minutes",
    status: "Open",
    players: [
      {
        name: "Rahul Sharma",
        college: "NIT Trichy",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      {
        name: "Priya Patel",
        college: "BITS Pilani",
        avatar: "/placeholder.svg?height=40&width=40",
      },
    ],
    maxPlayers: 4,
  },
  {
    id: 2,
    title: "Science Battle",
    category: "Science",
    difficulty: "Hard",
    questions: 20,
    timeLimit: "20 minutes",
    status: "Open",
    players: [
      {
        name: "Amit Kumar",
        college: "IIT Delhi",
        avatar: "/placeholder.svg?height=40&width=40",
      },
    ],
    maxPlayers: 2,
  },
  {
    id: 3,
    title: "GK Challenge",
    category: "General Knowledge",
    difficulty: "Easy",
    questions: 10,
    timeLimit: "10 minutes",
    status: "In Progress",
    players: [
      {
        name: "Sneha Gupta",
        college: "Delhi University",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      {
        name: "Raj Malhotra",
        college: "Punjab University",
        avatar: "/placeholder.svg?height=40&width=40",
      },
    ],
    maxPlayers: 2,
  },
]

// Sample leaderboard data
const leaderboard = [
  {
    rank: 1,
    user: {
      name: "Rahul Sharma",
      college: "NIT Trichy",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    score: 2450,
    quizzesTaken: 25,
    winRate: "80%",
  },
  {
    rank: 2,
    user: {
      name: "Priya Patel",
      college: "BITS Pilani",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    score: 2320,
    quizzesTaken: 22,
    winRate: "75%",
  },
  {
    rank: 3,
    user: {
      name: "Amit Kumar",
      college: "IIT Delhi",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    score: 2180,
    quizzesTaken: 20,
    winRate: "70%",
  },
  {
    rank: 4,
    user: {
      name: "Sneha Gupta",
      college: "Delhi University",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    score: 2050,
    quizzesTaken: 18,
    winRate: "65%",
  },
  {
    rank: 5,
    user: {
      name: "Raj Malhotra",
      college: "Punjab University",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    score: 1950,
    quizzesTaken: 19,
    winRate: "60%",
  },
]

export default function QuizzesPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex h-16 items-center gap-4 border-b bg-background px-6">
        <SidebarTrigger />
        <div>
          <h1 className="font-semibold">Quizzes & Battles</h1>
          <p className="text-xs text-muted-foreground">Test your knowledge and compete with others</p>
        </div>
      </header>

      <main className="flex-1 p-6 md:p-10">
        <div className="mx-auto max-w-7xl">
          <Tabs defaultValue="quizzes" className="w-full">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <TabsList>
                <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
                <TabsTrigger value="battles">Battle Rooms</TabsTrigger>
                <TabsTrigger value="history">My History</TabsTrigger>
                <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
              </TabsList>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search quizzes..."
                    className="w-full rounded-md pl-8 md:w-[200px] lg:w-[300px]"
                  />
                </div>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <TabsContent value="quizzes" className="mt-0">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {quizzes.map((quiz) => (
                  <Card key={quiz.id} className="overflow-hidden">
                    <div className="relative">
                      <img
                        src={quiz.image || "/placeholder.svg"}
                        alt={quiz.title}
                        className="h-48 w-full object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        <Badge>{quiz.category}</Badge>
                      </div>
                    </div>
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={quiz.hostCollege.logo || "/placeholder.svg"} alt={quiz.hostCollege.name} />
                          <AvatarFallback>{quiz.hostCollege.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <CardTitle className="text-lg">{quiz.title}</CardTitle>
                      </div>
                      <CardDescription>Hosted by {quiz.hostCollege.name}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="line-clamp-2 text-sm">{quiz.description}</p>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center gap-1">
                          <Brain className="h-4 w-4 text-muted-foreground" />
                          <span>Difficulty: {quiz.difficulty}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Timer className="h-4 w-4 text-muted-foreground" />
                          <span>{quiz.timeLimit}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>{quiz.participants} participants</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Award className="h-4 w-4 text-muted-foreground" />
                          <span>{quiz.questions} questions</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline">View Details</Button>
                      <Button>
                        <Play className="mr-2 h-4 w-4" />
                        Start Quiz
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="battles" className="mt-0">
              <div className="flex justify-between mb-6">
                <h2 className="text-2xl font-bold">Quiz Battle Rooms</h2>
                <Button>
                  <Play className="mr-2 h-4 w-4" />
                  Create Battle Room
                </Button>
              </div>
              <div className="space-y-4">
                {battleRooms.map((room) => (
                  <Card key={room.id}>
                    <CardHeader>
                      <div className="flex justify-between">
                        <div>
                          <CardTitle>{room.title}</CardTitle>
                          <CardDescription>
                            {room.category} • {room.difficulty} • {room.questions} questions • {room.timeLimit}
                          </CardDescription>
                        </div>
                        <Badge variant={room.status === "Open" ? "default" : "secondary"}>{room.status}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <h3 className="font-medium">
                          Players ({room.players.length}/{room.maxPlayers})
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {room.players.map((player) => (
                            <div key={player.name} className="flex items-center gap-2 rounded-full bg-muted px-3 py-1">
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={player.avatar || "/placeholder.svg"} alt={player.name} />
                                <AvatarFallback>{player.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <span className="text-sm">{player.name}</span>
                              <span className="text-xs text-muted-foreground">{player.college}</span>
                            </div>
                          ))}
                          {Array.from({ length: room.maxPlayers - room.players.length }).map((_, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-2 rounded-full border border-dashed px-3 py-1"
                            >
                              <span className="text-sm text-muted-foreground">Empty Slot</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end">
                      {room.status === "Open" ? (
                        <Button>Join Battle</Button>
                      ) : (
                        <Button variant="outline">Spectate</Button>
                      )}
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="history" className="mt-0">
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">My Quiz History</h2>
                <div className="grid gap-4">
                  <Card>
                    <CardHeader>
                      <div className="flex justify-between">
                        <div>
                          <CardTitle>Tech Trivia</CardTitle>
                          <CardDescription>Completed on May 15, 2023</CardDescription>
                        </div>
                        <Badge>Technology</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                        <div className="space-y-1 rounded-lg bg-muted p-3 text-center">
                          <p className="text-sm text-muted-foreground">Score</p>
                          <p className="text-2xl font-bold">85%</p>
                        </div>
                        <div className="space-y-1 rounded-lg bg-muted p-3 text-center">
                          <p className="text-sm text-muted-foreground">Correct</p>
                          <p className="text-2xl font-bold">17/20</p>
                        </div>
                        <div className="space-y-1 rounded-lg bg-muted p-3 text-center">
                          <p className="text-sm text-muted-foreground">Time</p>
                          <p className="text-2xl font-bold">18:45</p>
                        </div>
                        <div className="space-y-1 rounded-lg bg-muted p-3 text-center">
                          <p className="text-sm text-muted-foreground">Rank</p>
                          <p className="text-2xl font-bold">#12</p>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline">View Answers</Button>
                      <Button>Retake Quiz</Button>
                    </CardFooter>
                  </Card>

                  <Card>
                    <CardHeader>
                      <div className="flex justify-between">
                        <div>
                          <CardTitle>General Knowledge Challenge</CardTitle>
                          <CardDescription>Completed on May 10, 2023</CardDescription>
                        </div>
                        <Badge>General Knowledge</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                        <div className="space-y-1 rounded-lg bg-muted p-3 text-center">
                          <p className="text-sm text-muted-foreground">Score</p>
                          <p className="text-2xl font-bold">90%</p>
                        </div>
                        <div className="space-y-1 rounded-lg bg-muted p-3 text-center">
                          <p className="text-sm text-muted-foreground">Correct</p>
                          <p className="text-2xl font-bold">27/30</p>
                        </div>
                        <div className="space-y-1 rounded-lg bg-muted p-3 text-center">
                          <p className="text-sm text-muted-foreground">Time</p>
                          <p className="text-2xl font-bold">25:12</p>
                        </div>
                        <div className="space-y-1 rounded-lg bg-muted p-3 text-center">
                          <p className="text-sm text-muted-foreground">Rank</p>
                          <p className="text-2xl font-bold">#5</p>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline">View Answers</Button>
                      <Button>Retake Quiz</Button>
                    </CardFooter>
                  </Card>

                  <Card>
                    <CardHeader>
                      <div className="flex justify-between">
                        <div>
                          <CardTitle>Science Quiz</CardTitle>
                          <CardDescription>Completed on May 5, 2023</CardDescription>
                        </div>
                        <Badge>Science</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                        <div className="space-y-1 rounded-lg bg-muted p-3 text-center">
                          <p className="text-sm text-muted-foreground">Score</p>
                          <p className="text-2xl font-bold">76%</p>
                        </div>
                        <div className="space-y-1 rounded-lg bg-muted p-3 text-center">
                          <p className="text-sm text-muted-foreground">Correct</p>
                          <p className="text-2xl font-bold">19/25</p>
                        </div>
                        <div className="space-y-1 rounded-lg bg-muted p-3 text-center">
                          <p className="text-sm text-muted-foreground">Time</p>
                          <p className="text-2xl font-bold">22:30</p>
                        </div>
                        <div className="space-y-1 rounded-lg bg-muted p-3 text-center">
                          <p className="text-sm text-muted-foreground">Rank</p>
                          <p className="text-2xl font-bold">#20</p>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline">View Answers</Button>
                      <Button>Retake Quiz</Button>
                    </CardFooter>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="leaderboard" className="mt-0">
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">Quiz Leaderboard</h2>
                  <div className="flex gap-2">
                    <Button variant="outline">This Week</Button>
                    <Button variant="outline">This Month</Button>
                    <Button>All Time</Button>
                  </div>
                </div>

                <Card>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="px-4 py-3 text-left font-medium">Rank</th>
                            <th className="px-4 py-3 text-left font-medium">User</th>
                            <th className="px-4 py-3 text-left font-medium">Score</th>
                            <th className="px-4 py-3 text-left font-medium">Quizzes Taken</th>
                            <th className="px-4 py-3 text-left font-medium">Win Rate</th>
                            <th className="px-4 py-3 text-left font-medium"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {leaderboard.map((entry) => (
                            <tr key={entry.rank} className="border-b">
                              <td className="px-4 py-3">
                                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-muted font-bold">
                                  {entry.rank}
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-3">
                                  <Avatar>
                                    <AvatarImage src={entry.user.avatar || "/placeholder.svg"} alt={entry.user.name} />
                                    <AvatarFallback>{entry.user.name.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="font-medium">{entry.user.name}</p>
                                    <p className="text-xs text-muted-foreground">{entry.user.college}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-3 font-medium">{entry.score}</td>
                              <td className="px-4 py-3">{entry.quizzesTaken}</td>
                              <td className="px-4 py-3">{entry.winRate}</td>
                              <td className="px-4 py-3">
                                <Button variant="ghost" size="sm">
                                  View Profile
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-center">
                  <Card className="w-full max-w-md">
                    <CardHeader>
                      <CardTitle>Your Ranking</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center h-12 w-12 rounded-full bg-muted font-bold text-lg">
                          #42
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">Alex Johnson</p>
                          <p className="text-sm text-muted-foreground">NIT Trichy</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">1250</p>
                          <p className="text-sm text-muted-foreground">Score</p>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full">Improve Your Ranking</Button>
                    </CardFooter>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
