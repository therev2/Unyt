import { Award, Medal, Search, Trophy, User, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"

// Sample data - in a real app, this would come from your database
const collegeLeaderboard = [
  {
    rank: 1,
    college: {
      name: "IIT Delhi",
      logo: "/placeholder.svg?height=40&width=40",
    },
    points: 12500,
    eventsWon: 15,
    quizWins: 28,
    participationRate: 85,
  },
  {
    rank: 2,
    college: {
      name: "BITS Pilani",
      logo: "/placeholder.svg?height=40&width=40",
    },
    points: 11200,
    eventsWon: 12,
    quizWins: 25,
    participationRate: 80,
  },
  {
    rank: 3,
    college: {
      name: "IIM Ahmedabad",
      logo: "/placeholder.svg?height=40&width=40",
    },
    points: 10800,
    eventsWon: 10,
    quizWins: 22,
    participationRate: 75,
  },
  {
    rank: 4,
    college: {
      name: "NIT Trichy",
      logo: "/placeholder.svg?height=40&width=40",
    },
    points: 9500,
    eventsWon: 8,
    quizWins: 20,
    participationRate: 78,
  },
  {
    rank: 5,
    college: {
      name: "Delhi University",
      logo: "/placeholder.svg?height=40&width=40",
    },
    points: 8200,
    eventsWon: 7,
    quizWins: 18,
    participationRate: 70,
  },
]

const individualLeaderboard = [
  {
    rank: 1,
    user: {
      name: "Rahul Sharma",
      college: "IIT Delhi",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    points: 2450,
    eventsWon: 5,
    quizWins: 12,
    badges: 15,
  },
  {
    rank: 2,
    user: {
      name: "Priya Patel",
      college: "BITS Pilani",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    points: 2320,
    eventsWon: 4,
    quizWins: 10,
    badges: 14,
  },
  {
    rank: 3,
    user: {
      name: "Amit Kumar",
      college: "IIT Delhi",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    points: 2180,
    eventsWon: 3,
    quizWins: 9,
    badges: 12,
  },
  {
    rank: 4,
    user: {
      name: "Sneha Gupta",
      college: "Delhi University",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    points: 2050,
    eventsWon: 3,
    quizWins: 8,
    badges: 11,
  },
  {
    rank: 5,
    user: {
      name: "Raj Malhotra",
      college: "NIT Trichy",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    points: 1950,
    eventsWon: 2,
    quizWins: 7,
    badges: 10,
  },
]

// Sample badges data
const badges = [
  {
    id: 1,
    name: "Quiz Master",
    description: "Won 10+ quizzes",
    icon: <Trophy className="h-6 w-6" />,
    color: "bg-yellow-500",
  },
  {
    id: 2,
    name: "Event Champion",
    description: "Won 5+ events",
    icon: <Award className="h-6 w-6" />,
    color: "bg-blue-500",
  },
  {
    id: 3,
    name: "Community Builder",
    description: "Created 10+ discussions with 50+ replies",
    icon: <User className="h-6 w-6" />,
    color: "bg-green-500",
  },
  {
    id: 4,
    name: "Team Player",
    description: "Participated in 10+ team events",
    icon: <Users className="h-6 w-6" />,
    color: "bg-purple-500",
  },
  {
    id: 5,
    name: "Rising Star",
    description: "Earned 1000+ points in first month",
    icon: <Medal className="h-6 w-6" />,
    color: "bg-pink-500",
  },
]

export default function LeaderboardsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex h-16 items-center gap-4 border-b bg-background px-6">
        <SidebarTrigger />
        <div>
          <h1 className="font-semibold">Leaderboards & Achievements</h1>
          <p className="text-xs text-muted-foreground">See how you and your college rank</p>
        </div>
      </header>

      <main className="flex-1 p-6 md:p-10">
        <div className="mx-auto max-w-7xl">
          <Tabs defaultValue="colleges" className="w-full">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <TabsList>
                <TabsTrigger value="colleges">College Rankings</TabsTrigger>
                <TabsTrigger value="individuals">Individual Rankings</TabsTrigger>
                <TabsTrigger value="achievements">My Achievements</TabsTrigger>
              </TabsList>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search..."
                    className="w-full rounded-md pl-8 md:w-[200px] lg:w-[300px]"
                  />
                </div>
                <Button variant="outline">This Month</Button>
                <Button>All Time</Button>
              </div>
            </div>

            <TabsContent value="colleges" className="mt-0">
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-950 dark:to-yellow-900">
                    <CardHeader className="pb-2">
                      <CardDescription>1st Place</CardDescription>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12 border-2 border-yellow-500">
                          <AvatarImage
                            src={collegeLeaderboard[0].college.logo || "/placeholder.svg"}
                            alt={collegeLeaderboard[0].college.name}
                          />
                          <AvatarFallback>{collegeLeaderboard[0].college.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-xl">{collegeLeaderboard[0].college.name}</CardTitle>
                          <CardDescription>{collegeLeaderboard[0].points} points</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div>
                          <p className="text-2xl font-bold">{collegeLeaderboard[0].eventsWon}</p>
                          <p className="text-xs text-muted-foreground">Events Won</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold">{collegeLeaderboard[0].quizWins}</p>
                          <p className="text-xs text-muted-foreground">Quiz Wins</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold">{collegeLeaderboard[0].participationRate}%</p>
                          <p className="text-xs text-muted-foreground">Participation</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900">
                    <CardHeader className="pb-2">
                      <CardDescription>2nd Place</CardDescription>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12 border-2 border-gray-400">
                          <AvatarImage
                            src={collegeLeaderboard[1].college.logo || "/placeholder.svg"}
                            alt={collegeLeaderboard[1].college.name}
                          />
                          <AvatarFallback>{collegeLeaderboard[1].college.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-xl">{collegeLeaderboard[1].college.name}</CardTitle>
                          <CardDescription>{collegeLeaderboard[1].points} points</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div>
                          <p className="text-2xl font-bold">{collegeLeaderboard[1].eventsWon}</p>
                          <p className="text-xs text-muted-foreground">Events Won</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold">{collegeLeaderboard[1].quizWins}</p>
                          <p className="text-xs text-muted-foreground">Quiz Wins</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold">{collegeLeaderboard[1].participationRate}%</p>
                          <p className="text-xs text-muted-foreground">Participation</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900">
                    <CardHeader className="pb-2">
                      <CardDescription>3rd Place</CardDescription>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12 border-2 border-amber-500">
                          <AvatarImage
                            src={collegeLeaderboard[2].college.logo || "/placeholder.svg"}
                            alt={collegeLeaderboard[2].college.name}
                          />
                          <AvatarFallback>{collegeLeaderboard[2].college.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-xl">{collegeLeaderboard[2].college.name}</CardTitle>
                          <CardDescription>{collegeLeaderboard[2].points} points</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div>
                          <p className="text-2xl font-bold">{collegeLeaderboard[2].eventsWon}</p>
                          <p className="text-xs text-muted-foreground">Events Won</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold">{collegeLeaderboard[2].quizWins}</p>
                          <p className="text-xs text-muted-foreground">Quiz Wins</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold">{collegeLeaderboard[2].participationRate}%</p>
                          <p className="text-xs text-muted-foreground">Participation</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>College Rankings</CardTitle>
                    <CardDescription>Top colleges based on overall performance</CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="px-4 py-3 text-left font-medium">Rank</th>
                            <th className="px-4 py-3 text-left font-medium">College</th>
                            <th className="px-4 py-3 text-left font-medium">Points</th>
                            <th className="px-4 py-3 text-left font-medium">Events Won</th>
                            <th className="px-4 py-3 text-left font-medium">Quiz Wins</th>
                            <th className="px-4 py-3 text-left font-medium">Participation Rate</th>
                            <th className="px-4 py-3 text-left font-medium"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {collegeLeaderboard.map((entry) => (
                            <tr key={entry.rank} className="border-b">
                              <td className="px-4 py-3">
                                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-muted font-bold">
                                  {entry.rank}
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-3">
                                  <Avatar>
                                    <AvatarImage
                                      src={entry.college.logo || "/placeholder.svg"}
                                      alt={entry.college.name}
                                    />
                                    <AvatarFallback>{entry.college.name.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="font-medium">{entry.college.name}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-3 font-medium">{entry.points}</td>
                              <td className="px-4 py-3">{entry.eventsWon}</td>
                              <td className="px-4 py-3">{entry.quizWins}</td>
                              <td className="px-4 py-3">{entry.participationRate}%</td>
                              <td className="px-4 py-3">
                                <Button variant="ghost" size="sm">
                                  View Details
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
                      <CardTitle>Your College Ranking</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center h-12 w-12 rounded-full bg-muted font-bold text-lg">
                          #4
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">NIT Trichy</p>
                          <p className="text-sm text-muted-foreground">9,500 points</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">Top 10%</p>
                          <p className="text-sm text-muted-foreground">of all colleges</p>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full">View College Performance</Button>
                    </CardFooter>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="individuals" className="mt-0">
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-950 dark:to-yellow-900">
                    <CardHeader className="pb-2">
                      <CardDescription>1st Place</CardDescription>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12 border-2 border-yellow-500">
                          <AvatarImage
                            src={individualLeaderboard[0].user.avatar || "/placeholder.svg"}
                            alt={individualLeaderboard[0].user.name}
                          />
                          <AvatarFallback>{individualLeaderboard[0].user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-xl">{individualLeaderboard[0].user.name}</CardTitle>
                          <CardDescription>{individualLeaderboard[0].user.college}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div>
                          <p className="text-2xl font-bold">{individualLeaderboard[0].points}</p>
                          <p className="text-xs text-muted-foreground">Points</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold">{individualLeaderboard[0].quizWins}</p>
                          <p className="text-xs text-muted-foreground">Quiz Wins</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold">{individualLeaderboard[0].badges}</p>
                          <p className="text-xs text-muted-foreground">Badges</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900">
                    <CardHeader className="pb-2">
                      <CardDescription>2nd Place</CardDescription>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12 border-2 border-gray-400">
                          <AvatarImage
                            src={individualLeaderboard[1].user.avatar || "/placeholder.svg"}
                            alt={individualLeaderboard[1].user.name}
                          />
                          <AvatarFallback>{individualLeaderboard[1].user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-xl">{individualLeaderboard[1].user.name}</CardTitle>
                          <CardDescription>{individualLeaderboard[1].user.college}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div>
                          <p className="text-2xl font-bold">{individualLeaderboard[1].points}</p>
                          <p className="text-xs text-muted-foreground">Points</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold">{individualLeaderboard[1].quizWins}</p>
                          <p className="text-xs text-muted-foreground">Quiz Wins</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold">{individualLeaderboard[1].badges}</p>
                          <p className="text-xs text-muted-foreground">Badges</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900">
                    <CardHeader className="pb-2">
                      <CardDescription>3rd Place</CardDescription>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12 border-2 border-amber-500">
                          <AvatarImage
                            src={individualLeaderboard[2].user.avatar || "/placeholder.svg"}
                            alt={individualLeaderboard[2].user.name}
                          />
                          <AvatarFallback>{individualLeaderboard[2].user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-xl">{individualLeaderboard[2].user.name}</CardTitle>
                          <CardDescription>{individualLeaderboard[2].user.college}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div>
                          <p className="text-2xl font-bold">{individualLeaderboard[2].points}</p>
                          <p className="text-xs text-muted-foreground">Points</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold">{individualLeaderboard[2].quizWins}</p>
                          <p className="text-xs text-muted-foreground">Quiz Wins</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold">{individualLeaderboard[2].badges}</p>
                          <p className="text-xs text-muted-foreground">Badges</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Individual Rankings</CardTitle>
                    <CardDescription>Top performers across all colleges</CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="px-4 py-3 text-left font-medium">Rank</th>
                            <th className="px-4 py-3 text-left font-medium">User</th>
                            <th className="px-4 py-3 text-left font-medium">Points</th>
                            <th className="px-4 py-3 text-left font-medium">Events Won</th>
                            <th className="px-4 py-3 text-left font-medium">Quiz Wins</th>
                            <th className="px-4 py-3 text-left font-medium">Badges</th>
                            <th className="px-4 py-3 text-left font-medium"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {individualLeaderboard.map((entry) => (
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
                              <td className="px-4 py-3 font-medium">{entry.points}</td>
                              <td className="px-4 py-3">{entry.eventsWon}</td>
                              <td className="px-4 py-3">{entry.quizWins}</td>
                              <td className="px-4 py-3">{entry.badges}</td>
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
                          <p className="text-sm text-muted-foreground">Points</p>
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

            <TabsContent value="achievements" className="mt-0">
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">My Achievements</h2>
                  <div className="flex gap-2">
                    <Button variant="outline">Share Achievements</Button>
                    <Button>View All Badges</Button>
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Your Stats</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">Total Points</p>
                          <div className="flex items-end gap-2">
                            <p className="text-3xl font-bold">1,250</p>
                            <p className="text-sm text-green-500">+150 this month</p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">Badges Earned</p>
                          <div className="flex items-end gap-2">
                            <p className="text-3xl font-bold">8</p>
                            <p className="text-sm text-green-500">+2 this month</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <p className="text-sm">Progress to next level</p>
                          <p className="text-sm font-medium">65%</p>
                        </div>
                        <Progress value={65} className="h-2" />
                      </div>

                      <div className="space-y-2">
                        <p className="text-sm font-medium">Activity Breakdown</p>
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>Quizzes Completed</span>
                            <span>15</span>
                          </div>
                          <Progress value={60} className="h-1" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>Events Participated</span>
                            <span>8</span>
                          </div>
                          <Progress value={40} className="h-1" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>Forum Contributions</span>
                            <span>25</span>
                          </div>
                          <Progress value={75} className="h-1" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Achievements</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-4 rounded-lg border p-4">
                        <div
                          className={`flex h-12 w-12 items-center justify-center rounded-full text-white ${badges[0].color}`}
                        >
                          {badges[0].icon}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{badges[0].name}</p>
                          <p className="text-sm text-muted-foreground">{badges[0].description}</p>
                        </div>
                        <Badge>New</Badge>
                      </div>

                      <div className="flex items-center gap-4 rounded-lg border p-4">
                        <div
                          className={`flex h-12 w-12 items-center justify-center rounded-full text-white ${badges[1].color}`}
                        >
                          {badges[1].icon}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{badges[1].name}</p>
                          <p className="text-sm text-muted-foreground">{badges[1].description}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 rounded-lg border p-4">
                        <div
                          className={`flex h-12 w-12 items-center justify-center rounded-full text-white ${badges[2].color}`}
                        >
                          {badges[2].icon}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{badges[2].name}</p>
                          <p className="text-sm text-muted-foreground">{badges[2].description}</p>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full">
                        View All Achievements
                      </Button>
                    </CardFooter>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Achievement Timeline</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-8">
                      <div className="flex gap-4">
                        <div className="relative flex flex-col items-center">
                          <div
                            className={`flex h-10 w-10 items-center justify-center rounded-full text-white ${badges[0].color}`}
                          >
                            {badges[0].icon}
                          </div>
                          <div className="mt-2 h-full w-0.5 bg-border"></div>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{badges[0].name}</p>
                            <Badge variant="outline">May 15, 2023</Badge>
                          </div>
                          <p className="mt-1 text-sm text-muted-foreground">{badges[0].description}</p>
                          <p className="mt-2 text-sm">You earned this badge after winning your 10th quiz!</p>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <div className="relative flex flex-col items-center">
                          <div
                            className={`flex h-10 w-10 items-center justify-center rounded-full text-white ${badges[1].color}`}
                          >
                            {badges[1].icon}
                          </div>
                          <div className="mt-2 h-full w-0.5 bg-border"></div>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{badges[1].name}</p>
                            <Badge variant="outline">May 5, 2023</Badge>
                          </div>
                          <p className="mt-1 text-sm text-muted-foreground">{badges[1].description}</p>
                          <p className="mt-2 text-sm">Congratulations on winning your 5th event!</p>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <div className="relative flex flex-col items-center">
                          <div
                            className={`flex h-10 w-10 items-center justify-center rounded-full text-white ${badges[4].color}`}
                          >
                            {badges[4].icon}
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{badges[4].name}</p>
                            <Badge variant="outline">April 20, 2023</Badge>
                          </div>
                          <p className="mt-1 text-sm text-muted-foreground">{badges[4].description}</p>
                          <p className="mt-2 text-sm">You earned 1000+ points in your first month on the platform!</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
