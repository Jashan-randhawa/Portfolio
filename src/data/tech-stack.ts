// FIX: Slugs must match simpleicons.org IDs exactly (all lowercase, no spaces/special chars)
// Invalid slugs like "c++", "Node.js", "Express.js" would fail to load icons
export const TECH_STACK = [
  "typescript",
  "javascript",
  "cplusplus",       // was "c++" – invalid slug
  "java",
  "react",
  "html5",
  "css3",
  "mysql",
  "mongodb",
  "nodedotjs",       // was "Node.js" – invalid slug
  "express",         // was "Express.js" – invalid slug
  "php",             // was "PHP" – must be lowercase
  "vercel",
  "jest",            // was "testinglibrary" – that slug doesn't resolve
  "git",
  "github",
  "gitlab",
  "visualstudiocode",
  "tailwindcss",
  "redux",
]
