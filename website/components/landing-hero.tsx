import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export function LandingHero({ onLogin, onSignup }: { onLogin: () => void; onSignup: () => void }) {
  return (
    <section className="relative flex flex-col items-center justify-center w-full min-h-[60vh] py-12">
      <motion.h1
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className="text-4xl md:text-6xl font-extrabold text-center bg-gradient-to-br from-primary to-blue-600 bg-clip-text text-transparent drop-shadow-lg"
      >
        Unyt
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1, delay: 0.2, ease: "easeOut" }}
        className="mt-4 text-lg md:text-2xl text-center text-muted-foreground max-w-2xl"
      >
        Bridging Colleges, Building Communities. Discover, connect, and thrive in a vibrant academic ecosystem.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
        className="mt-8 flex flex-col md:flex-row gap-4 justify-center"
      >
        <Button className="w-48 text-lg font-semibold shadow-md" onClick={onLogin}>
          Login
        </Button>
        <Button className="w-48 text-lg font-semibold shadow-md" variant="outline" onClick={onSignup}>
          Sign Up
        </Button>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ duration: 1.4, delay: 0.8 }}
        className="absolute inset-0 pointer-events-none -z-10"
      >
        {/* Subtle animated background gradient */}
        <svg width="100%" height="100%" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="bg" cx="50%" cy="50%" r="70%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.10" />
              <stop offset="100%" stopColor="transparent" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#bg)" />
        </svg>
      </motion.div>
    </section>
  );
}
