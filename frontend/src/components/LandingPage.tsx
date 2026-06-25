import { useState } from 'react';
import type { FormEvent } from 'react';
import { ArrowRight, CheckCircle2, ChevronLeft, ChevronRight, GraduationCap, Code, Database, Briefcase, Award } from 'lucide-react';

interface LandingPageProps {
  onLoginClick: () => void;
}

export default function LandingPage({ onLoginClick }: LandingPageProps) {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const testimonials = [
    {
      id: 1,
      quote: "The practical skills I gained here directly led to my current role as a Senior Cloud Engineer. The curriculum is perfectly aligned with what top tech companies are looking for.",
      name: "Aarav Sharma",
      role: "Cloud Engineer at Microsoft",
      image: "/avatar-1.png"
    },
    {
      id: 2,
      quote: "Exceptional faculty and modern facilities. The placement support was phenomenal, helping me secure a highly competitive role before I even graduated.",
      name: "Priya Mehta",
      role: "Software Developer at Google",
      image: "/avatar-2.png"
    },
    {
      id: 3,
      quote: "Switching my career to Data Science felt daunting, but the structured courses and expert mentorship made the transition incredibly smooth and successful.",
      name: "Rahul Desai",
      role: "Data Scientist at Amazon",
      image: "/avatar-3.png"
    }
  ];

  const handleInquirySubmit = (e: FormEvent) => {
    e.preventDefault();
    alert("Thank you for your interest! Our admissions team will contact you shortly.");
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-800 selection:bg-emerald-200">
      
      {/* Navigation */}
      <nav className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="bg-emerald-500 p-2 rounded-lg">
            <GraduationCap className="text-white w-6 h-6" />
          </div>
          <span className="text-2xl font-extrabold text-white tracking-tight drop-shadow-md">
            Edu<span className="text-emerald-400">Bot</span> Institute
          </span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-white/90 font-medium drop-shadow-sm">
          <a href="#courses" className="hover:text-emerald-300 transition-colors">Programs</a>
          <a href="#benefits" className="hover:text-emerald-300 transition-colors">Why Us</a>
          <a href="#testimonials" className="hover:text-emerald-300 transition-colors">Success Stories</a>
        </div>
        <button 
          onClick={onLoginClick}
          className="px-6 py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white font-semibold rounded-lg transition-all duration-300"
        >
          Portal Login
        </button>
      </nav>

      {/* 1. Hero Header */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-20">
        <div className="absolute inset-0 z-0">
          <img 
            src="/hero_bg.png" 
            alt="Students collaborating" 
            className="w-full h-full object-cover"
          />
          {/* Deep blue overlay for contrast */}
          <div className="absolute inset-0 bg-[#0f172a]/80 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent opacity-90" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-12">
          <span className="inline-block py-1 px-3 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 font-semibold text-sm uppercase tracking-wider mb-6 backdrop-blur-sm">
            Admissions Open 2025
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight tracking-tight">
            Launch Your Tech Career <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
              With Industry Leaders
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            Master highly demanded skills through our intensive degree programs. Build your portfolio, land top-tier jobs, and connect with a global alumni network.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="#inquiry" className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all duration-300 hover:-translate-y-1 flex items-center gap-2">
              Apply Now <ArrowRight size={20} />
            </a>
            <a href="#courses" className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white font-bold rounded-xl transition-all duration-300">
              Explore Programs
            </a>
          </div>
        </div>
      </section>

      {/* 2. Trust Bar */}
      <section className="bg-[#0f172a] border-b border-slate-800 py-12 relative z-20 -mt-2">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-slate-800">
            <div>
              <p className="text-4xl font-extrabold text-white mb-1">94%</p>
              <p className="text-slate-400 text-sm font-medium uppercase tracking-wider">Job Placement</p>
            </div>
            <div>
              <p className="text-4xl font-extrabold text-white mb-1">50+</p>
              <p className="text-slate-400 text-sm font-medium uppercase tracking-wider">Expert Faculty</p>
            </div>
            <div>
              <p className="text-4xl font-extrabold text-white mb-1">10k+</p>
              <p className="text-slate-400 text-sm font-medium uppercase tracking-wider">Global Alumni</p>
            </div>
            <div>
              <p className="text-4xl font-extrabold text-white mb-1">#1</p>
              <p className="text-slate-400 text-sm font-medium uppercase tracking-wider">Tech Institute Ranking</p>
            </div>
          </div>
          
          <div className="mt-16 pt-10 border-t border-slate-800 flex flex-col items-center">
            <p className="text-slate-500 text-sm uppercase tracking-widest font-semibold mb-6">Our Graduates Work At</p>
            <div className="flex flex-wrap justify-center gap-12 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
              {/* Placeholder text for logos */}
              <span className="text-2xl font-bold text-white flex items-center gap-2"><Award /> Google</span>
              <span className="text-2xl font-bold text-white flex items-center gap-2"><Briefcase /> Microsoft</span>
              <span className="text-2xl font-bold text-white flex items-center gap-2"><Database /> Amazon</span>
              <span className="text-2xl font-bold text-white flex items-center gap-2"><Code /> Meta</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Featured Courses Grid */}
      <section id="courses" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-4xl font-extrabold text-[#0f172a] mb-4">World-Class Degree Programs</h2>
            <p className="text-slate-600 text-lg">Curricula designed in collaboration with industry leaders to ensure you learn exactly what employers need.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-xl shadow-slate-200/40 hover:-translate-y-2 transition-transform duration-300">
              <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                <Code size={28} />
              </div>
              <h3 className="text-2xl font-bold text-[#0f172a] mb-3">B.C.A</h3>
              <p className="text-slate-600 mb-6 line-clamp-3">Bachelor of Computer Applications. Master software engineering, web development, and foundational computer science.</p>
              <div className="flex flex-wrap gap-2 mb-8">
                <span className="px-3 py-1 bg-slate-100 text-slate-700 text-sm font-semibold rounded-md">3 Years</span>
                <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-sm font-semibold rounded-md">Beginner Friendly</span>
              </div>
              <a href="#inquiry" className="block w-full py-3 text-center text-blue-700 font-bold bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors">Download Syllabus</a>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-2xl p-8 border-2 border-emerald-500 shadow-2xl shadow-emerald-200/40 relative hover:-translate-y-2 transition-transform duration-300">
              <div className="absolute top-0 right-8 -translate-y-1/2 bg-emerald-500 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                Most Popular
              </div>
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-6">
                <Database size={28} />
              </div>
              <h3 className="text-2xl font-bold text-[#0f172a] mb-3">M.C.A</h3>
              <p className="text-slate-600 mb-6 line-clamp-3">Master of Computer Applications. Deep dive into advanced computing, AI, machine learning, and big data analytics.</p>
              <div className="flex flex-wrap gap-2 mb-8">
                <span className="px-3 py-1 bg-slate-100 text-slate-700 text-sm font-semibold rounded-md">2 Years</span>
                <span className="px-3 py-1 bg-blue-50 text-blue-700 text-sm font-semibold rounded-md">Advanced Level</span>
              </div>
              <a href="#inquiry" className="block w-full py-3 text-center text-white font-bold bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-colors">Download Syllabus</a>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-xl shadow-slate-200/40 hover:-translate-y-2 transition-transform duration-300">
              <div className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mb-6">
                <Briefcase size={28} />
              </div>
              <h3 className="text-2xl font-bold text-[#0f172a] mb-3">B.Tech (CS)</h3>
              <p className="text-slate-600 mb-6 line-clamp-3">Bachelor of Technology in Computer Science. A rigorous engineering program focusing on system architecture and core tech.</p>
              <div className="flex flex-wrap gap-2 mb-8">
                <span className="px-3 py-1 bg-slate-100 text-slate-700 text-sm font-semibold rounded-md">4 Years</span>
                <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-sm font-semibold rounded-md">Beginner Friendly</span>
              </div>
              <a href="#inquiry" className="block w-full py-3 text-center text-blue-700 font-bold bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors">Download Syllabus</a>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Split-Screen Inquiry & Benefits */}
      <section id="benefits" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            {/* Left: Benefits */}
            <div className="space-y-8">
              <div>
                <h2 className="text-4xl font-extrabold text-[#0f172a] mb-6 leading-tight">Fast-Track Your Career in Technology</h2>
                <p className="text-lg text-slate-600">Join thousands of students who have transformed their lives through our immersive, career-focused education model.</p>
              </div>
              
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <div className="shrink-0 mt-1 w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                    <CheckCircle2 size={16} />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-[#0f172a] mb-1">100% Placement Assistance</h4>
                    <p className="text-slate-600">Dedicated career team to help you prepare for interviews and connect with hiring partners.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="shrink-0 mt-1 w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                    <CheckCircle2 size={16} />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-[#0f172a] mb-1">Industry-Vetted Curriculum</h4>
                    <p className="text-slate-600">Syllabus constantly updated by a board of tech executives to match current market demands.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="shrink-0 mt-1 w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                    <CheckCircle2 size={16} />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-[#0f172a] mb-1">State-of-the-art Infrastructure</h4>
                    <p className="text-slate-600">24/7 high-speed labs, modern libraries, and smart classrooms designed for collaboration.</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Right: Form */}
            <div id="inquiry" className="bg-[#0f172a] rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-emerald-500 rounded-full blur-[100px] opacity-20" />
              
              <h3 className="text-2xl font-bold text-white mb-2 relative z-10">Request Information</h3>
              <p className="text-slate-400 mb-8 relative z-10">Fill out the form below and our admission counselor will call you within 24 hours.</p>
              
              <form onSubmit={handleInquirySubmit} className="space-y-5 relative z-10">
                <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-300">First Name</label>
                    <input required type="text" className="w-full bg-slate-900/50 border border-slate-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl px-4 py-3 text-white placeholder-slate-500 outline-none transition-colors" placeholder="John" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-300">Last Name</label>
                    <input required type="text" className="w-full bg-slate-900/50 border border-slate-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl px-4 py-3 text-white placeholder-slate-500 outline-none transition-colors" placeholder="Doe" />
                  </div>
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-300">Email Address</label>
                  <input required type="email" className="w-full bg-slate-900/50 border border-slate-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl px-4 py-3 text-white placeholder-slate-500 outline-none transition-colors" placeholder="john@example.com" />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-300">Phone Number</label>
                  <input required type="tel" className="w-full bg-slate-900/50 border border-slate-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl px-4 py-3 text-white placeholder-slate-500 outline-none transition-colors" placeholder="+91 98765 43210" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-300">Course of Interest</label>
                  <select className="w-full bg-slate-900/50 border border-slate-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl px-4 py-3 text-white outline-none transition-colors appearance-none">
                    <option value="bca">Bachelor of Computer Applications (BCA)</option>
                    <option value="mca">Master of Computer Applications (MCA)</option>
                    <option value="btech">B.Tech Computer Science</option>
                  </select>
                </div>

                <button type="submit" className="w-full py-4 mt-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-colors shadow-lg shadow-emerald-900/50">
                  Get Free Counseling
                </button>
              </form>
            </div>

          </div>
        </div>
      </section>

      {/* 5. Testimonial Slider */}
      <section id="testimonials" className="py-24 bg-slate-50 border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-extrabold text-[#0f172a] mb-12">Hear From Our Alumni</h2>
          
          <div className="relative bg-white rounded-3xl p-8 md:p-12 shadow-xl shadow-slate-200/50">
            <div className="absolute top-8 left-8 text-8xl text-emerald-100 font-serif leading-none opacity-50 pointer-events-none">"</div>
            
            <div className="relative z-10">
              <p className="text-2xl font-medium text-slate-700 leading-relaxed mb-10 italic">
                "{testimonials[activeTestimonial].quote}"
              </p>
              
              <div className="flex items-center justify-center gap-4">
                <img 
                  src={testimonials[activeTestimonial].image} 
                  alt={testimonials[activeTestimonial].name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-emerald-500"
                />
                <div className="text-left">
                  <h4 className="font-bold text-[#0f172a] text-lg">{testimonials[activeTestimonial].name}</h4>
                  <p className="text-slate-500 text-sm">{testimonials[activeTestimonial].role}</p>
                </div>
              </div>
            </div>

            {/* Slider Controls */}
            <div className="absolute bottom-1/2 translate-y-1/2 -left-5 md:-left-6">
              <button 
                onClick={() => setActiveTestimonial((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1))}
                className="w-12 h-12 rounded-full bg-white border border-slate-200 shadow-md flex items-center justify-center text-slate-600 hover:text-emerald-600 hover:border-emerald-200 transition-colors"
              >
                <ChevronLeft size={24} />
              </button>
            </div>
            <div className="absolute bottom-1/2 translate-y-1/2 -right-5 md:-right-6">
              <button 
                onClick={() => setActiveTestimonial((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1))}
                className="w-12 h-12 rounded-full bg-white border border-slate-200 shadow-md flex items-center justify-center text-slate-600 hover:text-emerald-600 hover:border-emerald-200 transition-colors"
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </div>
          
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, idx) => (
              <button 
                key={idx}
                onClick={() => setActiveTestimonial(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${idx === activeTestimonial ? 'bg-emerald-500 w-8' : 'bg-slate-300'}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Footer minimal */}
      <footer className="bg-[#0f172a] py-8 text-center border-t border-slate-800">
        <p className="text-slate-500 text-sm">&copy; {new Date().getFullYear()} EduBot Institute. All rights reserved.</p>
      </footer>
    </div>
  );
}
