import { motion } from 'framer-motion';
import Typewriter from 'typewriter-effect';

function App() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gray-900 text-white flex items-center justify-center">
      {/* Background Images with Parallax Effect */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
        style={{ 
          backgroundImage: `url('https://images.unsplash.com/photo-1630929009765-5962c7e9ddee?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3')`,
          backgroundAttachment: 'fixed',
        }}
      ></div>
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20 animate-pulse"
        style={{ 
          backgroundImage: `url('https://images.unsplash.com/photo-1618005182380-72c0d8c1b575?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3')`,
          backgroundAttachment: 'fixed',
          backgroundPosition: 'center bottom',
        }}
      ></div>

      {/* Gradient Overlay for Better Contrast */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/50 via-gray-900/70 to-black/50"></div>

      {/* Glass Card */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5, ease: 'easeInOut' }}
        className="relative bg-white bg-opacity-5 backdrop-blur-lg rounded-3xl shadow-2xl p-12 max-w-2xl text-center border border-white/10 mx-4"
      >
        <motion.h1
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 drop-shadow-lg mb-6"
        >
          <Typewriter
            options={{
              strings: ['Welcome to CBS Universe', 'Crafting the Future', 'React. Animate. Dominate.'],
              autoStart: true,
              loop: true,
              delay: 50,
            }}
          />
        </motion.h1>
        <p className="mt-4 text-xl text-gray-100 leading-relaxed">
          A revolutionary React starter—built to inspire, created to amaze.
        </p>
        <motion.button
          whileHover={{ scale: 1.1, boxShadow: '0 0 15px rgba(236, 72, 153, 0.5)' }}
          whileTap={{ scale: 0.95 }}
          className="mt-8 px-8 py-4 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 text-white font-bold rounded-full shadow-lg hover:shadow-2xl transition duration-300"
        >
          Get Started
        </motion.button>
      </motion.div>

      {/* Enhanced Sparkles / Particle FX */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 bg-gradient-to-r from-cyan-400 to-pink-400 rounded-full"
            initial={{ x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight }}
            animate={{
              y: ['0%', '100%'],
              opacity: [0.3, 0.9, 0],
              scale: [1, 1.5, 0.5],
            }}
            transition={{
              duration: Math.random() * 6 + 4,
              repeat: Infinity,
              delay: Math.random() * 5
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default App;