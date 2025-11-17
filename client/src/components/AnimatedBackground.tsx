import { motion } from 'framer-motion';

export function AnimatedBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: 'hsl(340, 100%, 63%)', stopOpacity: 0.2 }} />
            <stop offset="100%" style={{ stopColor: 'hsl(187, 100%, 50%)', stopOpacity: 0.1 }} />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        <motion.circle
          cx="200"
          cy="150"
          r="100"
          fill="url(#grad1)"
          filter="url(#glow)"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: [1, 1.2, 1], 
            opacity: [0.3, 0.5, 0.3],
            x: [0, 30, 0],
            y: [0, -20, 0]
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        <motion.path
          d="M 800 200 Q 900 250 1000 200 T 1200 200"
          stroke="hsl(340, 100%, 63%)"
          strokeWidth="2"
          fill="none"
          opacity="0.2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />

        <motion.circle
          cx="1000"
          cy="600"
          r="80"
          fill="hsl(187, 100%, 50%)"
          opacity="0.15"
          animate={{ 
            scale: [1, 1.3, 1],
            x: [-20, 20, -20],
            y: [10, -10, 10]
          }}
          transition={{ 
            duration: 10, 
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />

        <motion.polygon
          points="100,700 150,750 50,750"
          fill="hsl(280, 80%, 60%)"
          opacity="0.1"
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 15, 
            repeat: Infinity,
            ease: "linear"
          }}
          style={{ transformOrigin: "100px 733px" }}
        />

        <motion.rect
          x="600"
          y="400"
          width="100"
          height="100"
          fill="hsl(30, 90%, 55%)"
          opacity="0.08"
          rx="10"
          animate={{ 
            rotate: [0, 90, 180, 270, 360],
            scale: [1, 1.05, 1]
          }}
          transition={{ 
            duration: 20, 
            repeat: Infinity,
            ease: "linear"
          }}
          style={{ transformOrigin: "650px 450px" }}
        />

        {[...Array(20)].map((_, i) => (
          <motion.circle
            key={i}
            cx={Math.random() * 1200}
            cy={Math.random() * 800}
            r={Math.random() * 3 + 1}
            fill="hsl(340, 100%, 63%)"
            opacity={Math.random() * 0.4 + 0.1}
            animate={{ 
              opacity: [0.1, 0.5, 0.1],
              scale: [1, 1.5, 1]
            }}
            transition={{ 
              duration: Math.random() * 3 + 2, 
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          />
        ))}
      </svg>
    </div>
  );
}
