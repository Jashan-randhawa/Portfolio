"use client"

import { motion } from "motion/react"
import { MY_NETWORKS } from "@/data/my-networks"
import {
  Code,
  GraduationCap,
  Heart,
  Layers,
  MapPin,
  Zap,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  }),
}

const skills = [
  { name: "React", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300" },
  { name: "Next.js", color: "bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300" },
  { name: "TypeScript", color: "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300" },
  { name: "Node.js", color: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300" },
  { name: "MongoDB", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300" },
  { name: "Tailwind CSS", color: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300" },
  { name: "Express.js", color: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300" },
  { name: "Redux", color: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300" },
  { name: "Python", color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300" },
  { name: "Socket.IO", color: "bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300" },
  { name: "MySQL", color: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300" },
  { name: "REST APIs", color: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300" },
]

const values = [
  {
    icon: <Code className="size-6 text-purple-500" />,
    title: "Clean Code",
    description: "I believe in writing readable, maintainable code that future-me will thank present-me for.",
    bg: "bg-purple-50 dark:bg-purple-900/20",
  },
  {
    icon: <Layers className="size-6 text-blue-500" />,
    title: "Systems Thinking",
    description: "Building scalable component architectures that grow gracefully with product requirements.",
    bg: "bg-blue-50 dark:bg-blue-900/20",
  },
  {
    icon: <Zap className="size-6 text-amber-500" />,
    title: "Performance First",
    description: "Every millisecond matters. I optimise for speed without sacrificing developer experience.",
    bg: "bg-amber-50 dark:bg-amber-900/20",
  },
  {
    icon: <Heart className="size-6 text-rose-500" />,
    title: "User Empathy",
    description: "Great UI isn't just pretty — it anticipates what the user needs before they ask.",
    bg: "bg-rose-50 dark:bg-rose-900/20",
  },
]

export function AboutContent() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-16">

      {/* Hero */}
      <motion.section
        initial="hidden"
        animate="visible"
        className="flex flex-col md:flex-row items-start md:items-center gap-8"
      >
        <motion.div custom={0} variants={fadeUp} className="flex-1 space-y-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="size-4" />
            JMIT Radaur, Haryana, India
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Hey, I&apos;m{" "}
            <span className="bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
              Jashanpreet
            </span>{" "}
            👋
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            A final-year B.Tech (IT) student and MERN Stack developer who loves crafting
            fast, beautiful web experiences. I thrive at the intersection of design precision
            and engineering rigour.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            {MY_NETWORKS.map((network) => (
              <a
                key={network.name}
                href={network.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 border px-3 py-1.5 rounded-xl text-sm hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
              >
                <network.icon className="size-4" />
                {network.name}
              </a>
            ))}
          </div>
        </motion.div>

        <motion.div
          custom={1}
          variants={fadeUp}
          className="w-40 h-40 rounded-3xl bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-500 flex items-center justify-center shrink-0 shadow-2xl"
        >
          <GraduationCap className="size-20 text-white" />
        </motion.div>
      </motion.section>

      {/* My Story */}
      <motion.section
        custom={2}
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="space-y-4"
      >
        <h2 className="text-2xl font-bold">My Story</h2>
        <div className="space-y-3 text-muted-foreground leading-relaxed">
          <p>
            I started coding with HTML &amp; CSS in my first year at JMIT, quickly falling
            in love with the instant visual feedback of the web. By second year I had taught
            myself the MERN stack and was building full-stack apps for fun.
          </p>
          <p>
            In my third year I began focusing on frontend architecture — learning how to build
            reusable component systems, how animations enhance UX without hurting performance,
            and how TypeScript pays off at scale.
          </p>
          <p>
            Today I am a final-year student building AI-integrated web applications at
            Digital Fortress, shipping features end-to-end and improving product stability
            through better design patterns and testing practices.
          </p>
        </div>
      </motion.section>

      {/* Skills */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="space-y-4"
      >
        <h2 className="text-2xl font-bold">Tech I Work With</h2>
        <motion.div className="flex flex-wrap gap-2">
          {skills.map((skill, i) => (
            <motion.div key={skill.name} custom={i} variants={fadeUp}>
              <Badge className={`px-3 py-1 text-sm font-medium ${skill.color} border-0`}>
                {skill.name}
              </Badge>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* Values */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="space-y-4"
      >
        <h2 className="text-2xl font-bold">What I Value</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {values.map((v, i) => (
            <motion.div
              key={v.title}
              custom={i}
              variants={fadeUp}
              whileHover={{ scale: 1.02 }}
              className={`p-5 rounded-2xl border ${v.bg} transition-colors`}
            >
              <div className="mb-3">{v.icon}</div>
              <h3 className="font-semibold text-lg mb-1">{v.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{v.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Education */}
      <motion.section
        custom={3}
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="space-y-4"
      >
        <h2 className="text-2xl font-bold">Education</h2>
        <div className="border rounded-2xl p-6 space-y-2 hover:border-purple-300 dark:hover:border-purple-800 transition-colors">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h3 className="font-semibold text-lg">B.Tech — Information Technology</h3>
              <p className="text-muted-foreground">
                JMIT (Jind Institute of Engineering &amp; Management Technology), Radaur, Haryana
              </p>
            </div>
            <Badge variant="secondary" className="shrink-0">2022 – 2026</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Specialised in web development, data structures &amp; algorithms, and database systems.
            Completed coursework from IIT Kanpur (IFACET programme) alongside regular curriculum.
          </p>
        </div>
      </motion.section>

    </div>
  )
}
