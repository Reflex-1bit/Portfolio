import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Terminal, Zap } from 'lucide-react';

const ProjectGameView = ({ projects, onHoverChange }) => {
  const canvasRef = useRef(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [score, setScore] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const keysRef = useRef({});
  const scoreRef = useRef(0);
  const selectedProjectRef = useRef(null);
  
  useEffect(() => {
    const checkMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    setIsMobile(checkMobile);
  }, []);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = 600;
    
    // Game objects
    const player = {
      x: 50,
      y: canvas.height - 100,
      width: 40,
      height: 40,
      velocityY: 0,
      jumping: false,
      color: '#8b5cf6'
    };
    
    const projectBoxes = projects.map((proj, i) => ({
      x: 200 + i * 300,
      y: canvas.height - 150,
      width: 120,
      height: 120,
      project: proj,
      collected: false,
      float: 0,
      particles: []
    }));
    
    const stars = Array.from({ length: 100 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2,
      speed: Math.random() * 2 + 0.5
    }));
    
    let animationId;
    let scrollOffset = 0;
    
    const handleKeyDown = (e) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd', ' '].includes(e.key)) {
        e.preventDefault();
      }
      keysRef.current[e.key] = true;
      
      if ((e.key === ' ' || e.key === 'ArrowUp' || e.key === 'w') && !player.jumping) {
        player.velocityY = -15;
        player.jumping = true;
      }
    };
    
    const handleKeyUp = (e) => {
      keysRef.current[e.key] = false;
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    function drawPlayer() {
      ctx.save();
      ctx.translate(player.x + player.width / 2, player.y + player.height / 2);
      
      // Glow effect
      const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, player.width);
      gradient.addColorStop(0, 'rgba(139, 92, 246, 0.8)');
      gradient.addColorStop(0.5, 'rgba(139, 92, 246, 0.4)');
      gradient.addColorStop(1, 'rgba(139, 92, 246, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(-player.width, -player.height, player.width * 2, player.height * 2);
      
      // Player body
      ctx.fillStyle = player.color;
      ctx.shadowBlur = 20;
      ctx.shadowColor = '#8b5cf6';
      ctx.fillRect(-player.width / 2, -player.height / 2, player.width, player.height);
      
      // Eyes
      ctx.fillStyle = '#000';
      ctx.fillRect(-10, -10, 8, 8);
      ctx.fillRect(2, -10, 8, 8);
      
      ctx.restore();
    }
    
    function drawProjectBox(box) {
      if (box.collected) return;
      
      ctx.save();
      ctx.translate(box.x - scrollOffset, box.y);
      
      box.float += 0.05;
      const floatOffset = Math.sin(box.float) * 10;
      
      // Outer glow
      ctx.shadowBlur = 30;
      ctx.shadowColor = '#a78bfa';
      
      // Box
      ctx.fillStyle = 'rgba(139, 92, 246, 0.2)';
      ctx.strokeStyle = '#8b5cf6';
      ctx.lineWidth = 3;
      ctx.fillRect(0, floatOffset, box.width, box.height);
      ctx.strokeRect(0, floatOffset, box.width, box.height);
      
      // Inner shine
      const gradient = ctx.createLinearGradient(0, floatOffset, 0, floatOffset + box.height);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, floatOffset, box.width, box.height);
      
      // Project icon
      ctx.font = '48px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#fff';
      ctx.fillText(['🚀', '⚡', '🎯'][projects.indexOf(box.project)], box.width / 2, box.height / 2 + floatOffset);
      
      // Particles
      box.particles = box.particles.filter(p => p.life > 0);
      if (Math.random() < 0.1) {
        box.particles.push({
          x: Math.random() * box.width,
          y: box.height,
          vx: (Math.random() - 0.5) * 2,
          vy: -Math.random() * 2 - 1,
          life: 1,
          size: Math.random() * 3 + 1
        });
      }
      
      box.particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.02;
        ctx.fillStyle = `rgba(139, 92, 246, ${p.life})`;
        ctx.fillRect(p.x, p.y + floatOffset, p.size, p.size);
      });
      
      ctx.restore();
    }
    
    function drawStars() {
      stars.forEach(star => {
        star.x -= star.speed;
        if (star.x < 0) star.x = canvas.width;
        
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.5})`;
        ctx.fillRect(star.x, star.y, star.size, star.size);
      });
    }
    
    function drawGround() {
      const groundY = canvas.height - 50;
      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(0, groundY, canvas.width, 50);
      
      // Ground line
      ctx.strokeStyle = '#8b5cf6';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, groundY);
      ctx.lineTo(canvas.width, groundY);
      ctx.stroke();
      
      // Grid lines
      ctx.strokeStyle = 'rgba(139, 92, 246, 0.2)';
      ctx.lineWidth = 1;
      for (let i = 0; i < canvas.width; i += 40) {
        ctx.beginPath();
        ctx.moveTo(i - (scrollOffset % 40), groundY);
        ctx.lineTo(i - (scrollOffset % 40), canvas.height);
        ctx.stroke();
      }
    }
    
    function checkCollision(box) {
      return (
        player.x < box.x - scrollOffset + box.width &&
        player.x + player.width > box.x - scrollOffset &&
        player.y < box.y + box.height &&
        player.y + player.height > box.y
      );
    }
    
    function update() {
      // Clear canvas
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw stars
      drawStars();
      
      // Player movement
      if (keysRef.current['ArrowRight'] || keysRef.current['d']) {
        scrollOffset += 5;
      }
      if (keysRef.current['ArrowLeft'] || keysRef.current['a']) {
        scrollOffset = Math.max(0, scrollOffset - 5);
      }
      
      // Gravity
      player.velocityY += 0.8;
      player.y += player.velocityY;
      
      // Ground collision
      const groundY = canvas.height - 50 - player.height;
      if (player.y >= groundY) {
        player.y = groundY;
        player.velocityY = 0;
        player.jumping = false;
      }
      
      // Draw ground
      drawGround();
      
      // Draw and check project boxes
      projectBoxes.forEach(box => {
        drawProjectBox(box);
        if (!box.collected && checkCollision(box)) {
          box.collected = true;
          scoreRef.current += 1;
          setScore(scoreRef.current);
          selectedProjectRef.current = box.project;
          setSelectedProject(box.project);
          
          // Explosion effect
          for (let i = 0; i < 30; i++) {
            box.particles.push({
              x: box.width / 2,
              y: box.height / 2,
              vx: (Math.random() - 0.5) * 10,
              vy: (Math.random() - 0.5) * 10,
              life: 1,
              size: Math.random() * 4 + 2
            });
          }
        }
      });
      
      // Draw player
      drawPlayer();
      
      // UI
      ctx.fillStyle = '#fff';
      ctx.font = '20px monospace';
      ctx.fillText(`COLLECTED: ${scoreRef.current}/${projects.length}`, 20, 30);
      
      animationId = requestAnimationFrame(update);
    }
    
    update();
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      cancelAnimationFrame(animationId);
      keysRef.current = {};
    };
  }, [projects]);
  
  const handleTouchButton = (key, isDown) => {
    const eventType = isDown ? 'keydown' : 'keyup';
    const event = new KeyboardEvent(eventType, { key });
    window.dispatchEvent(event);
  };
  
  return (
    <div className="relative">
      <canvas 
        ref={canvasRef} 
        className="w-full border-2 border-violet-500 bg-black"
        style={{ imageRendering: 'pixelated', touchAction: 'none' }}
      />
      
      {/* Mobile Touch Controls */}
      {isMobile && (
        <div className="mt-4 flex justify-between items-center gap-4">
          <div className="flex gap-2">
            <button
              onTouchStart={() => handleTouchButton('a', true)}
              onTouchEnd={() => handleTouchButton('a', false)}
              className="w-16 h-16 bg-violet-500/30 border-2 border-violet-500 flex items-center justify-center text-white font-bold text-2xl active:bg-violet-500/50 select-none"
            >
              ←
            </button>
            <button
              onTouchStart={() => handleTouchButton('d', true)}
              onTouchEnd={() => handleTouchButton('d', false)}
              className="w-16 h-16 bg-violet-500/30 border-2 border-violet-500 flex items-center justify-center text-white font-bold text-2xl active:bg-violet-500/50 select-none"
            >
              →
            </button>
          </div>
          
          <button
            onTouchStart={() => handleTouchButton(' ', true)}
            onTouchEnd={() => handleTouchButton(' ', false)}
            className="w-20 h-20 rounded-full bg-violet-500/30 border-4 border-violet-500 flex items-center justify-center text-white font-bold active:bg-violet-500/50 select-none"
          >
            JUMP
          </button>
        </div>
      )}
      
      {selectedProject && (
        <div className="mt-8 border-2 border-violet-500 bg-zinc-900 p-8 animate-slideUp">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="text-sm text-violet-400 mb-2">✨ PROJECT UNLOCKED!</div>
              <h3 className="text-3xl font-bold text-white mb-2">{selectedProject.title}</h3>
              <p className="text-gray-400 text-lg">{selectedProject.desc}</p>
            </div>
            <span className="text-sm px-3 py-1 bg-violet-500/20 text-violet-400 border border-violet-500">
              {selectedProject.year}
            </span>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <h4 className="text-sm text-gray-500 mb-2">TECH STACK</h4>
              <div className="flex flex-wrap gap-2">
                {selectedProject.tech.split(', ').map((tech, j) => (
                  <span key={j} className="text-sm px-3 py-1 bg-zinc-800 text-violet-400 border border-zinc-700">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-sm text-gray-500 mb-2">IMPACT</h4>
              <div className="flex items-center gap-2 text-lg">
                <Zap className="w-5 h-5 text-violet-400" />
                <span className="text-violet-400 font-bold">{selectedProject.impact}</span>
              </div>
            </div>
          </div>


        </div>
      )}

      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideUp {
          animation: slideUp 0.4s ease-out;
        }
      `}</style>
    </div>
  );
};

export default function Portfolio() {
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [terminalText, setTerminalText] = useState('');
  const canvasRef = useRef(null);

  const fullText = "const aditya = { role: 'computer eng @ waterloo', status: 'seeking s25 coop' };";

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index <= fullText.length) {
        setTerminalText(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 50);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const particleCount = 80;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2
      });
    }

    function animate() {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(139, 92, 246, 0.3)';
        ctx.fill();

        particles.slice(i + 1).forEach(p2 => {
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(139, 92, 246, ${0.15 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        });
      });

      requestAnimationFrame(animate);
    }

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const projects = [
    {
      title: "chess trainer ai",
      desc: "neural network that analyzes your chess.com games, finds your weaknesses, and serves personalized puzzles from lichess",
      tech: "python, tensorflow, javascript",
      impact: "trained on 10k+ games",
      year: "2025"
    },
    {
      title: "discord housing pipeline",
      desc: "automated data pipeline that scrapes, cleans, and monitors housing listings with real-time alerts",
      tech: "python, mysql",
      impact: "tracking 5k+ listings",
      year: "2025"
    },
    {
      title: "finance tracker",
      desc: "personal finance app with auto-categorization and spending analytics dashboard",
      tech: "python, javascript, mysql",
      impact: "visualizing spend patterns",
      year: "2025"
    }
  ];

  return (
    <div className="relative min-h-screen bg-black text-white font-mono overflow-x-hidden">
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none opacity-40" />
      
      {/* Custom cursor */}
      <div 
        className="fixed w-5 h-5 border-2 border-violet-500 rounded-full pointer-events-none z-50 mix-blend-difference transition-transform duration-100"
        style={{
          left: cursorPos.x - 10,
          top: cursorPos.y - 10,
          transform: isHovering ? 'scale(2)' : 'scale(1)'
        }}
      />

      <div className="relative z-10">
        {/* Nav */}
        <nav className="fixed top-0 w-full px-8 py-6 flex justify-between items-center backdrop-blur-sm">
          <div className="text-sm">
            <span className="text-violet-500">&gt;</span> aditya_sharma
          </div>
          <div className="flex gap-8 text-sm">
            <a href="#work" className="hover:text-violet-400 transition-colors">work</a>
            <a href="#about" className="hover:text-violet-400 transition-colors">about</a>
            <a href="mailto:aditya.shm64@gmail.com" className="hover:text-violet-400 transition-colors">contact</a>
          </div>
        </nav>

        {/* Hero */}
        <section className="min-h-screen flex items-center justify-center px-8">
          <div className="max-w-5xl w-full">
            <div className="mb-12">
              <div className="flex items-center gap-2 text-sm mb-6">
                <Terminal className="w-4 h-4 text-violet-500" />
                <span className="text-gray-500">~/portfolio</span>
              </div>
              <h1 className="text-6xl md:text-8xl font-bold mb-6 leading-tight">
                i build<br/>
                <span className="text-violet-500">experiences</span><br/>
                on the web
              </h1>
              <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800 mb-8 font-mono text-sm">
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <span className="text-gray-600 ml-2">terminal</span>
                </div>
                <div className="text-green-400">
                  {terminalText}
                  <span className="animate-pulse">|</span>
                </div>
              </div>
            </div>

            <p className="text-xl text-gray-400 mb-8 max-w-2xl">
              comp eng @ waterloo. firmware dev on formula electric. building AI-powered tools 
              and data pipelines. looking for summer 2025 internships.
            </p>

            <div className="flex gap-4 text-sm">
              <a 
                href="#work"
                className="px-6 py-3 bg-violet-600 hover:bg-violet-500 transition-colors inline-flex items-center gap-2"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
              >
                see my work <ArrowRight className="w-4 h-4" />
              </a>
              <a 
                href="/resume.pdf"
                className="px-6 py-3 border border-zinc-700 hover:border-violet-500 transition-colors"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
              >
                resume
              </a>
            </div>
          </div>
        </section>

        {/* Work */}
        <section id="work" className="min-h-screen py-24 px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-8">
              <span className="text-violet-500">02.</span> selected work
            </h2>
            <p className="text-gray-500 mb-8 text-sm">
              use arrow keys or on-screen controls to play • collect all projects!
            </p>

            <ProjectGameView 
              projects={projects} 
              onHoverChange={setIsHovering}
            />
          </div>
        </section>

        {/* About */}
        <section id="about" className="min-h-screen py-24 px-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-12">
              <span className="text-violet-500">03.</span> about me
            </h2>
            
            <div className="space-y-6 text-lg text-gray-400 leading-relaxed">
              <p>
                hey! i'm aditya, a first-year computer engineering student at waterloo. 
                started coding in high school, now i'm working on formula electric's firmware team.
              </p>
              <p>
                i love building stuff that solves real problems - from chess AIs that analyze your games 
                to data pipelines that automate boring tasks. comfortable with python, C/C++, and the full stack.
              </p>
              <p>
                when i'm not coding, you'll find me at hackathons (got a special mention at UN Hackathon), 
                working on autonomous systems, or exploring new ML frameworks.
              </p>
              
              <div className="pt-8">
                <h3 className="text-xl font-bold mb-4 text-white">current stack:</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {['python', 'c/c++', 'javascript/typescript', 'tensorflow', 'sql/mysql', 'git/github', 'html/css', 'react'].map((skill, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="text-violet-500">▹</span>
                      <span>{skill}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="py-24 px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-8">
              let's build something
            </h2>
            <p className="text-xl text-gray-400 mb-12">
              open to summer 2025 internships in software, firmware, or AI/ML
            </p>
            <a 
              href="mailto:aditya.shm64@gmail.com"
              className="inline-block px-8 py-4 border-2 border-violet-500 text-violet-500 hover:bg-violet-500 hover:text-black transition-all font-bold text-lg"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              aditya.shm64@gmail.com
            </a>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 px-8 text-center text-gray-600 text-sm border-t border-zinc-900">
          <p>designed & built by aditya sharma © 2025</p>
        </footer>
      </div>
    </div>
  );
}