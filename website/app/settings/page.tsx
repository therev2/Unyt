import { Bell, Key, Shield, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"

export default function SettingsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex h-16 items-center gap-4 border-b bg-background px-6">
        <SidebarTrigger />
        <div>
          <h1 className="font-semibold">Settings</h1>
          <p className="text-xs text-muted-foreground">Manage your account settings and preferences</p>
        </div>
      </header>

      <main className="flex-1 p-6 md:p-10">
        <div className="mx-auto max-w-5xl">
          <Tabs defaultValue="profile" className="w-full">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="sm:w-1/4">
                <TabsList className="flex flex-col h-auto p-0 bg-transparent">
                  <TabsTrigger value="profile" className="justify-start px-4 py-2 h-10 data-[state=active]:bg-muted">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </TabsTrigger>
                  <TabsTrigger value="account" className="justify-start px-4 py-2 h-10 data-[state=active]:bg-muted">
                    <Key className="mr-2 h-4 w-4" />
                    Account
                  </TabsTrigger>
                  <TabsTrigger value="notifications" className="justify-start px-4 py-2 h-10 data-[state=active]:bg-muted">
                    <Bell className="mr-2 h-4 w-4" />
                    Notifications
                  </TabsTrigger>
                  <TabsTrigger value="privacy" className="justify-start px-4 py-2 h-10 data-[state=active]:bg-muted">
                    <Shield className="mr-2 h-4 w-4" />
                    Privacy
                  </TabsTrigger>
                </TabsList>
              </div>

              <div className="sm:w-3/4">
                <TabsContent value="profile" className="mt-0">
                  <Card>
                    <CardHeader>
                      <CardTitle>Profile Settings</CardTitle>
                      <CardDescription>
                        Update your profile information and how it appears to others
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                          <div className="sm:w-1/3">
                            <Label htmlFor="avatar">Profile Picture</Label>
                          </div>
                          <div className="sm:w-2/3 flex items-center gap-4">
                            <Avatar className="h-16 w-16">
                              <AvatarImage src="/placeholder.svg?height=64&width=64" alt="Profile" />
                              <AvatarFallback>AJ</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col gap-2">
                              <Button variant="outline" size="sm">
                                Change
                              </Button>
                              <Button variant="ghost" size="sm">
                                Remove
                              </Button>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                          <div className="sm:w-1/3">
                            <Label htmlFor="name">Full Name</Label>
                          </div>
                          <div className="sm:w-2/3">
                            <Input id="name" defaultValue="Alex Johnson" />
                          </div>
                        </div>

                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                          <div className="sm:w-1/3">
                            <Label htmlFor="email">Email</Label>
                          </div>
                          <div className="sm:w-2/3">
                            <Input id="email" defaultValue="alex@nit.edu.in" />
                          </div>
                        </div>

                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start">
                          <div className="sm:w-1/3">
                            <Label htmlFor="bio">Bio</Label>
                          </div>
                          <div className="sm:w-2/3">
                            <Textarea
                              id="bio"\
