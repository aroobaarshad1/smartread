"use client"

import { Button } from "@/components/ui/button"
import SubscriptionButton from "@/components/SubscriptionButton"
import FileUpload from "@/components/FileUpload"
import { UserButton, useUser } from "@clerk/nextjs"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { ChevronRight, FileText, MessageSquare, Shield, Smartphone } from "lucide-react"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"

// Replace the floatingAnimation definition with this properly typed version:
const floatingAnimation = {
  initial: { y: 0, x: 0 },
  animate: {
    y: [0, -20, 0, 20, 0],
    x: [0, 10, 20, 10, 0],
    transition: {
      duration: 20,
      repeat: Number.POSITIVE_INFINITY,
      repeatType: "loop" as const,
    },
  },
}

// Enhanced Background pattern component
const BackgroundPattern = () => {
  return (
    <div className="fixed inset-0 overflow-hidden -z-10">
      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] [mask-image:linear-gradient(to_bottom,transparent,black_20%)] opacity-10"></div>

      {/* Animated dots */}
      <div className="absolute inset-0">
        {Array.from({ length: 20 }).map((_, i) => (
          // Also update the motion.div animation in the BackgroundPattern component:
          // Replace the existing motion.div with this:
          <motion.div
            key={i}
            className="absolute rounded-full bg-purple-500/20 blur-xl"
            style={{
              width: `${Math.random() * 10 + 5}rem`,
              height: `${Math.random() * 10 + 5}rem`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0, 20, 0],
              x: [0, 10, 20, 10, 0],
              transition: {
                duration: Math.random() * 10 + 20,
                delay: Math.random() * 10,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "loop" as const,
              },
            }}
          />
        ))}
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-teal-400/20 via-transparent to-purple-500/20"></div>
    </div>
  )
}

// Enhanced Animated gradient background for hero section
const AnimatedGradient = () => {
  const [gradientPosition, setGradientPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX / window.innerWidth - 0.5
      const y = e.clientY / window.innerHeight - 0.5
      setGradientPosition({ x, y })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <div
      className="absolute inset-0"
      style={{
        background: `
          radial-gradient(
            circle at ${50 + gradientPosition.x * 30}% ${50 + gradientPosition.y * 30}%, 
            rgba(45, 212, 191, 0.4) 0%, 
            rgba(139, 92, 246, 0.2) 25%, 
            rgba(79, 70, 229, 0) 50%
          ),
          linear-gradient(
            to bottom right, 
            #0d9488, 
            #7e22ce, 
            #4f46e5
          )
        `,
        transition: "background 0.3s ease-out",
      }}
    />
  )
}

export default function Home() {
  const { user } = useUser()
  const isAuth = !!user
  const isPro = false

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <div className="flex flex-col min-h-screen relative overflow-x-hidden">
      <BackgroundPattern />

      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="w-full py-4 px-6 md:px-10 bg-gradient-to-r from-teal-600 to-purple-600 shadow-lg"
      >
        <div className="container mx-auto flex justify-between items-center">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-2"
          >
            <div className="bg-white p-2 rounded-md">
              <FileText className="h-6 w-6 text-teal-600" />
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-white">SMART READ AI</h1>
          </motion.div>
          <div className="flex items-center gap-4">
            {isAuth ? (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <UserButton afterSwitchSessionUrl="/" />
              </motion.div>
            ) : (
              <>
                <Link href="/sign-in">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button variant="outline" className="bg-white text-indigo-600 hover:bg-indigo-50">
                      Login
                    </Button>
                  </motion.div>
                </Link>
                <Link href="/sign-up">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button className="bg-white text-indigo-600 hover:bg-indigo-50">Sign Up</Button>
                  </motion.div>
                </Link>
              </>
            )}
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="w-full py-16 md:py-24 relative overflow-hidden">
        <AnimatedGradient />
        <div className="container mx-auto px-6 md:px-10 text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">Chat with Your PDFs</h1>
            <p className="text-lg md:text-xl text-white/90 mb-8 max-w-3xl mx-auto">
              Upload your PDF files and ask questions to get instant, accurate answers powered by AI. Perfect for
              students and professionals.
            </p>
          </motion.div>

          {/* Go to chats button */}
          {isAuth && (
            <Link href="/chat/1">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button className="bg-teal-600 text-white hover:bg-teal-700 font-semibold text-lg px-8 py-6">
                  Go to Chats
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
            </Link>
          )}

          {/* Auth check for upload/subscription vs login */}
          {isAuth ? (
            <>
              {/* Upload Area */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-6 max-w-2xl mx-auto bg-white/10 backdrop-blur-sm p-8 rounded-xl border border-white/20"
              >
                <FileUpload />
              </motion.div>
            </>
          ) : (
            <Link href="/sign-in" className="w-full max-w-md mx-auto mt-8 block">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button className="w-full bg-teal-600 text-white hover:bg-teal-700 font-semibold text-lg flex justify-center items-center gap-2">
                  Login to get Started
                </Button>
              </motion.div>
            </Link>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-16 md:py-24 bg-gradient-to-b from-white to-indigo-50">
        <div className="container mx-auto px-6 md:px-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-indigo-800 mb-4">Why Choose SMART READ AI?</h2>
            <p className="text-lg text-indigo-700/80 text-center mb-12 max-w-3xl mx-auto">
              Discover the powerful features that make PDF Chat AI your ultimate tool for interacting with PDF documents
              using the power of AI.
            </p>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            <motion.div variants={item}>
              <Card className="p-6 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 h-full relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-teal-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="mb-4 text-indigo-600">
                    <MessageSquare className="h-10 w-10" />
                  </div>
                  <h3 className="text-xl font-semibold text-indigo-800 mb-2">AI-Powered Chat</h3>
                  <p className="text-gray-600">
                    Ask questions from your PDFs and get instant, accurate responses powered by AI.
                  </p>
                </div>
              </Card>
            </motion.div>

            <motion.div variants={item}>
              <Card className="p-6 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 h-full relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-teal-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="mb-4 text-indigo-600">
                    <FileText className="h-10 w-10" />
                  </div>
                  <h3 className="text-xl font-semibold text-indigo-800 mb-2">PDF Viewer</h3>
                  <p className="text-gray-600">
                    View your PDF documents directly in the app while chatting with the AI about its contents.
                  </p>
                </div>
              </Card>
            </motion.div>

            <motion.div variants={item}>
              <Card className="p-6 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 h-full relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-teal-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="mb-4 text-indigo-600">
                    <Shield className="h-10 w-10" />
                  </div>
                  <h3 className="text-xl font-semibold text-indigo-800 mb-2">Secure Workspace</h3>
                  <p className="text-gray-600">
                    All your documents are stored securely and are only accessible by you.
                  </p>
                </div>
              </Card>
            </motion.div>

            <motion.div variants={item}>
              <Card className="p-6 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 h-full relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-teal-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="mb-4 text-indigo-600">
                    <Smartphone className="h-10 w-10" />
                  </div>
                  <h3 className="text-xl font-semibold text-indigo-800 mb-2">Multi-Device Access</h3>
                  <p className="text-gray-600">
                    Access your PDFs and chat history from any device, anytime — without missing a beat.
                  </p>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="w-full py-16 md:py-24 bg-gradient-to-br from-teal-600 to-purple-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 [background:radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-white to-transparent"></div>
        <div className="container mx-auto px-6 md:px-10 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">How It Works</h2>
            <p className="text-lg text-white/90 text-center mb-12 max-w-3xl mx-auto">
              Follow these simple steps to get the most out of SMART READ AI and start getting answers from your PDF
              files effortlessly.
            </p>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <motion.div variants={item}>
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20 hover:border-white/40 transition-all duration-300 h-full">
                <div className="text-white text-5xl font-bold mb-4">1</div>
                <h3 className="text-2xl font-semibold text-white mb-3">Create an Account</h3>
                <p className="text-white/90">
                  Sign up for a free account to get started. Enjoy a full month of free access to all features.
                </p>
              </div>
            </motion.div>

            <motion.div variants={item}>
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20 hover:border-white/40 transition-all duration-300 h-full">
                <div className="text-white text-5xl font-bold mb-4">2</div>
                <h3 className="text-2xl font-semibold text-white mb-3">Upload Your PDFs</h3>
                <p className="text-white/90">
                  Upload your PDF documents to the platform. Our AI will process and analyze the content.
                </p>
              </div>
            </motion.div>

            <motion.div variants={item}>
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20 hover:border-white/40 transition-all duration-300 h-full">
                <div className="text-white text-5xl font-bold mb-4">3</div>
                <h3 className="text-2xl font-semibold text-white mb-3">Start Chatting</h3>
                <p className="text-white/90">
                  Ask questions about your documents and get instant, accurate answers from our AI.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="w-full py-16 md:py-24 bg-white">
        <div className="container mx-auto px-6 md:px-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl md:text-4xl font-bold text-indigo-800 mb-4">Choose Your Plan</h2>
            <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
              Start for free or upgrade to unlock premium features.
            </p>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto"
          >
            <motion.div variants={item}>
              <Card className="p-8 border border-indigo-200 hover:border-indigo-300 transition-all duration-300 hover:-translate-y-1">
                <h3 className="text-2xl font-semibold text-indigo-700 mb-4">Free Plan</h3>
                <p className="text-gray-600 mb-6">Full access within 1Month uploads and features.</p>
                <Link href={isAuth ? "/chat/1" : "/sign-up"}>
                  <Button className="w-full bg-teal-600 text-white hover:bg-teal-700">Start Free Trial</Button>
                </Link>
              </Card>
            </motion.div>

            <motion.div variants={item}>
              <Card className="p-8 border border-indigo-200 hover:border-indigo-300 transition-all duration-300 hover:-translate-y-1">
                <h3 className="text-2xl font-semibold text-indigo-700 mb-4">Pro Plan</h3>
                <p className="text-gray-600 mb-6">Unlock all features with priority support and more uploads.</p>
                <SubscriptionButton isPro={isPro} />
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-12 bg-gradient-to-b from-indigo-50 to-white">
        <div className="container mx-auto px-6 md:px-10 text-center text-indigo-800 text-sm">
          <p>© {new Date().getFullYear()} PDF Chat AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
