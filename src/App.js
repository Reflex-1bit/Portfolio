import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, Terminal, Zap, X } from 'lucide-react';

export default function Portfolio() {
  const [terminalText, setTerminalText] = useState('');
  const [showPopup, setShowPopup] = useState(null);
  const [gameComplete, setGameComplete] = useState(false);
  const canvasRef = useRef(null);
  const bgCanvasRef = useRef(null);
  const cursorRef = useRef(null);

  const projects = [
    {
      title: "chess trainer ai",
      desc: "neural network that analyzes chess.com games and identifies tactical weaknesses",
      tech: "python, tensorflow, javascript",
      impact: "10k+ games analyzed"
    },
    {
      title: "discord housing pipeline", 
      desc: "automated data pipeline scraping and monitoring housing listings",
      tech: "python, mysql",
      impact: "5k+ listings tracked"
    },
    {
      title: "cognitive assessment system",
      desc: "state-based game with timing tests and modular architecture",
      tech: "c/c++, javascript, html/css",
      impact: "reaction testing"
    }
  ];

  useEffect(() => {
    let i = 0;
    const text = "const aditya = { role: 'computer eng @ waterloo', status: 'seeking s25 coop' };";
    const timer = setInterval(() => {
      if (i <= text.length) {
        setTerminalText(text.slice(0, i));
        i++;
      } else clearInterval(timer);
    }, 50);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const moveCursor = (e) => {
      if (cursorRef.current) {
        cursorRef.current.style.left = e.clientX - 10 + 'px';
        cursorRef.current.style.top = e.clientY - 10 + 'px';
      }
    };
    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, []);

  useEffect(() => {
    const canvas = bgCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = Array.from({ length: 80 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      r: Math.random() * 2
    }));

    function draw() {
      ctx.fillStyle = 'rgba(0,0,0,0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(139,92,246,0.3)';
        ctx.fill();

        particles.slice(i + 1).forEach(p2 => {
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(139,92,246,${0.15 * (1 - d / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        });
      });
      requestAnimationFrame(draw);
    }
    draw();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = 400;

    const keys = {};
    let scroll = 0;
    let score = 0;
    const collected = [];
    let isComplete = false;

    const player = { x: 50, y: 300, w: 40, h: 40, vy: 0, jump: false };
    const boxes = projects.map((p, i) => ({
      x: 200 + i * 300,
      y: 250,
      w: 120,
      h: 120,
      proj: p,
      got: false,
      f: 0,
      parts: []
    }));

    const stars = Array.from({ length: 100 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      s: Math.random() * 2,
      sp: Math.random() * 2 + 0.5
    }));

    window.addEventListener('keydown', (e) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd', ' '].includes(e.key)) e.preventDefault();
      keys[e.key] = true;
      if ((e.key === ' ' || e.key === 'ArrowUp' || e.key === 'w') && !player.jump) {
        player.vy = -15;
        player.jump = true;
      }
    });

    window.addEventListener('keyup', (e) => {
      keys[e.key] = false;
    });

    function loop() {
      if (isComplete) return;
      
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      stars.forEach(s => {
        s.x -= s.sp;
        if (s.x < 0) s.x = canvas.width;
        ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.5 + 0.5})`;
        ctx.fillRect(s.x, s.y, s.s, s.s);
      });

      if (keys['ArrowRight'] || keys['d']) scroll += 5;
      if (keys['ArrowLeft'] || keys['a']) scroll = Math.max(0, scroll - 5);

      player.vy += 0.8;
      player.y += player.vy;
      if (player.y >= 300) {
        player.y = 300;
        player.vy = 0;
        player.jump = false;
      }

      const gy = 350;
      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(0, gy, canvas.width, 50);
      ctx.strokeStyle = '#8b5cf6';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, gy);
      ctx.lineTo(canvas.width, gy);
      ctx.stroke();

      boxes.forEach((b, i) => {
        if (!b.got) {
          b.f += 0.05;
          const fy = Math.sin(b.f) * 10;
          const bx = b.x - scroll;

          ctx.save();
          ctx.translate(bx, b.y);
          ctx.shadowBlur = 30;
          ctx.shadowColor = '#a78bfa';
          ctx.fillStyle = 'rgba(139,92,246,0.2)';
          ctx.strokeStyle = '#8b5cf6';
          ctx.lineWidth = 3;
          ctx.fillRect(0, fy, b.w, b.h);
          ctx.strokeRect(0, fy, b.w, b.h);
          ctx.font = '48px Arial';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = '#fff';
          ctx.fillText(['🚀', '⚡', '🎯'][i], b.w / 2, b.h / 2 + fy);
          ctx.restore();

          if (player.x < bx + b.w && player.x + player.w > bx && player.y < b.y + b.h && player.y + player.h > b.y) {
            b.got = true;
            score++;
            collected.push(b.proj);
            setShowPopup(b.proj);
            if (score === 3) {
              setTimeout(() => {
                isComplete = true;
                setGameComplete(true);
              }, 2000);
            }
          }
        }
      });

      ctx.save();
      ctx.translate(player.x + 20, player.y + 20);
      ctx.fillStyle = '#8b5cf6';
      ctx.shadowBlur = 20;
      ctx.shadowColor = '#8b5cf6';
      ctx.fillRect(-20, -20, 40, 40);
      ctx.fillStyle = '#000';
      ctx.fillRect(-10, -10, 8, 8);
      ctx.fillRect(2, -10, 8, 8);
      ctx.restore();

      ctx.fillStyle = '#fff';
      ctx.font = '20px monospace';
      ctx.fillText(`COLLECTED: ${score}/3`, 20, 30);

      requestAnimationFrame(loop);
    }
    loop();
    
    return () => {
      window.removeEventListener('keydown', (e) => keys[e.key] = true);
      window.removeEventListener('keyup', (e) => keys[e.key] = false);
    };
  }, []);

  return (
    <div className="bg-black text-white font-mono min-h-screen" style={{ cursor: 'none' }}>
      <canvas ref={bgCanvasRef} className="fixed inset-0 opacity-40" />
      <div ref={cursorRef} className="fixed w-5 h-5 border-2 border-violet-500 rounded-full pointer-events-none z-50 mix-blend-difference" />

      <div className="relative z-10">
        <nav className="fixed top-0 w-full px-8 py-6 flex justify-between backdrop-blur-sm">
          <div className="text-sm"><span className="text-violet-500">&gt;</span> aditya_sharma</div>
          <div className="flex gap-8 text-sm">
            <a href="#work" className="hover:text-violet-400">work</a>
            <a href="#about" className="hover:text-violet-400">about</a>
            <a href="mailto:aditya.shm64@gmail.com" className="hover:text-violet-400">contact</a>
          </div>
        </nav>

        <section className="min-h-screen flex items-center justify-center px-8">
          <div className="max-w-5xl w-full">
            <div className="mb-12">
              <div className="flex items-center gap-2 text-sm mb-6">
                <Terminal className="w-4 h-4 text-violet-500" />
                <span className="text-gray-500">~/portfolio</span>
              </div>
              <h1 className="text-6xl md:text-8xl font-bold mb-6 leading-tight">
                i build<br/><span className="text-violet-500">experiences</span><br/>on the web
              </h1>
              <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800 mb-8 text-sm">
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <span className="text-gray-600 ml-2">terminal</span>
                </div>
                <div className="text-green-400">{terminalText}<span className="animate-pulse">|</span></div>
              </div>
            </div>
            <p className="text-xl text-gray-400 mb-8">
              comp eng @ waterloo. firmware dev on formula electric. building AI tools, data pipelines. seeking summer 2025 internships.
            </p>
            <div className="flex gap-4 text-sm">
              <a href="#work" className="px-6 py-3 bg-violet-600 hover:bg-violet-500 inline-flex items-center gap-2">
                see my work <ArrowRight className="w-4 h-4" />
              </a>
              <a href="/Aditya_Sharma_Resume.pdf" download className="px-6 py-3 border border-zinc-700 hover:border-violet-500">resume</a>
            </div>
          </div>
        </section>

        <section id="work" className="min-h-screen py-24 px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-8"><span className="text-violet-500">02.</span> selected work</h2>
            <p className="text-gray-400 mb-8 text-lg">arrow keys to move • space to jump • collect all!</p>
            
            {!gameComplete ? (
              <canvas ref={canvasRef} className="w-full border-2 border-violet-500 bg-black" style={{ imageRendering: 'pixelated' }} />
            ) : (
              <div>
                <div className="text-center mb-12">
                  <h3 className="text-4xl font-bold text-violet-400 mb-4">🎉 ALL COLLECTED!</h3>
                  <p className="text-gray-400 text-lg">here's what i built</p>
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                  {projects.map((p, i) => (
                    <div key={i} className="border-2 border-violet-500 bg-zinc-900 p-6">
                      <div className="text-4xl mb-4">{['🚀', '⚡', '🎯'][i]}</div>
                      <h3 className="text-2xl font-bold mb-3">{p.title}</h3>
                      <p className="text-gray-400 mb-4">{p.desc}</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {p.tech.split(', ').map((t, j) => (
                          <span key={j} className="text-xs px-2 py-1 bg-zinc-800 text-violet-400 border border-zinc-700">{t}</span>
                        ))}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-violet-400">
                        <Zap className="w-4 h-4" />{p.impact}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        <section id="about" className="min-h-screen py-24 px-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-12"><span className="text-violet-500">03.</span> about me</h2>
            <div className="space-y-6 text-lg text-gray-400">
              <p>first-year CE @ waterloo. firmware team for formula electric. building chess AIs, data pipelines, cognitive systems.</p>
              <p>comfortable with python, C/C++, tensorflow, sql. UN hackathon mention, healthcare prototypes.</p>
              <div className="pt-8">
                <h3 className="text-xl font-bold mb-4 text-white">stack:</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {['python', 'c/c++', 'javascript', 'tensorflow', 'sql/mysql', 'git', 'linux', 'bash'].map((s, i) => (
                    <div key={i} className="flex items-center gap-2"><span className="text-violet-500">▹</span>{s}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-8">let's build something</h2>
            <p className="text-xl text-gray-400 mb-12">summer 2025 internships - software/firmware/AI</p>
            <a href="mailto:aditya.shm64@gmail.com" className="inline-block px-8 py-4 border-2 border-violet-500 text-violet-500 hover:bg-violet-500 hover:text-black font-bold text-lg">
              aditya.shm64@gmail.com
            </a>
          </div>
        </section>

        <footer className="py-8 text-center text-gray-600 text-sm border-t border-zinc-900">
          <p>designed & built by aditya sharma © 2025</p>
        </footer>
      </div>

      {showPopup && !gameComplete && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50" onClick={() => setShowPopup(null)}>
          <div className="bg-zinc-900 border-2 border-violet-500 p-8 max-w-2xl mx-4" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setShowPopup(null)} className="float-right text-gray-400 hover:text-white"><X className="w-6 h-6" /></button>
            <div className="text-sm text-violet-400 mb-3">✨ UNLOCKED!</div>
            <h3 className="text-3xl font-bold mb-3">{showPopup.title}</h3>
            <p className="text-gray-400 text-lg mb-6">{showPopup.desc}</p>
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <h4 className="text-sm text-gray-500 mb-3">TECH</h4>
                <div className="flex flex-wrap gap-2">
                  {showPopup.tech.split(', ').map((t, i) => (
                    <span key={i} className="text-sm px-3 py-1 bg-zinc-800 text-violet-400 border border-zinc-700">{t}</span>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-sm text-gray-500 mb-3">IMPACT</h4>
                <div className="flex items-center gap-2 text-lg">
                  <Zap className="w-5 h-5 text-violet-400" />
                  <span className="text-violet-400 font-bold">{showPopup.impact}</span>
                </div>
              </div>
            </div>
            <button onClick={() => setShowPopup(null)} className="w-full px-6 py-3 bg-violet-600 hover:bg-violet-500 font-bold">
              CONTINUE →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}