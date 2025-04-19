import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Users, School, Trophy, MessageSquare } from "lucide-react";


export function LandingHero({ onLogin, onSignup }: { onLogin?: () => void; onSignup?: () => void } = {}) {
  return (
    <section
      className="relative flex flex-col justify-center items-center w-full min-h-screen overflow-hidden bg-background"
    >
      <div className="relative w-full flex flex-col md:flex-row items-center justify-center gap-12 px-4 md:px-8 max-w-5xl min-h-[400px] md:min-h-[500px]">

        <div className="flex flex-col justify-center items-center md:items-start text-center md:text-left max-w-md w-full h-full">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="text-4xl md:text-6xl font-extrabold text-center md:text-left bg-gradient-to-br from-primary to-blue-600 bg-clip-text text-transparent drop-shadow-lg"
          >
            Unyt
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.2, ease: "easeOut" }}
            className="mt-4 text-lg md:text-2xl text-center md:text-left text-muted-foreground max-w-2xl"
          >
            The all-in-one campus platform for students: chat with our AI chatbot, challenge yourself with quizzes, join vibrant discussion forums, and play fun games—all in one place!
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
            className="mt-8 flex flex-col md:flex-row gap-4 justify-center md:justify-start"
          >
            <Button className="w-48 text-lg font-semibold shadow-md" onClick={onLogin}>
              Login
            </Button>
            <Button className="w-48 text-lg font-semibold shadow-md" variant="outline" onClick={onSignup}>
              Sign Up
            </Button>
          </motion.div>
        </div>

      </div>
      {/* Feature Highlights */}
      <div className="mt-20 w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 px-4 md:px-0">
        <div className="bg-white/90 dark:bg-zinc-900/80 rounded-2xl shadow-xl p-8 flex flex-col items-center justify-center backdrop-blur-md border border-zinc-200 dark:border-zinc-800 min-h-[180px] transition hover:scale-105">
          <MessageSquare className="w-10 h-10 text-blue-500 mb-2" />
          <span className="font-bold text-lg text-center">AI Chatbot</span>
          <span className="text-sm text-muted-foreground mt-2 text-center">Get instant answers, guidance, and support from our smart campus assistant.</span>
        </div>
        <div className="bg-white/90 dark:bg-zinc-900/80 rounded-2xl shadow-xl p-8 flex flex-col items-center justify-center backdrop-blur-md border border-zinc-200 dark:border-zinc-800 min-h-[180px] transition hover:scale-105">
          <Trophy className="w-10 h-10 text-yellow-500 mb-2" />
          <span className="font-bold text-lg text-center">Quizzes & Challenges</span>
          <span className="text-sm text-muted-foreground mt-2 text-center">Test your knowledge and compete with friends in fun, interactive quizzes.</span>
        </div>
        <div className="bg-white/90 dark:bg-zinc-900/80 rounded-2xl shadow-xl p-8 flex flex-col items-center justify-center backdrop-blur-md border border-zinc-200 dark:border-zinc-800 min-h-[180px] transition hover:scale-105">
          <School className="w-10 h-10 text-green-500 mb-2" />
          <span className="font-bold text-lg text-center">Discussion Forums</span>
          <span className="text-sm text-muted-foreground mt-2 text-center">Join vibrant forums to discuss topics, share ideas, and connect with peers.</span>
        </div>
        <div className="bg-white/90 dark:bg-zinc-900/80 rounded-2xl shadow-xl p-8 flex flex-col items-center justify-center backdrop-blur-md border border-zinc-200 dark:border-zinc-800 min-h-[180px] transition hover:scale-105">
          <Users className="w-10 h-10 text-purple-500 mb-2" />
          <span className="font-bold text-lg text-center">Games & Fun</span>
          <span className="text-sm text-muted-foreground mt-2 text-center">Play engaging games and enjoy a lively, interactive campus experience.</span>
        </div>
      </div>

    </section>
  );
}
