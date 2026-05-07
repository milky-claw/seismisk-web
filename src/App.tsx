/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useForm, ValidationError } from "@formspree/react";
import {
  ArrowRight,
  Settings,
  Cpu,
  Package,
  Zap,
  CheckCircle2,
  Warehouse,
  Factory,
  Database,
  X
} from "lucide-react";

const BRAND_NAVY = "#1A1950";

const Section = ({ 
  children, 
  className = "", 
  id = "" 
}: { 
  children: ReactNode; 
  className?: string; 
  id?: string;
}) => (
  <section id={id} className={`py-20 px-6 md:px-12 max-w-7xl mx-auto ${className}`}>
    {children}
  </section>
);

const Button = ({
  children,
  variant = "primary",
  className = "",
  onClick,
  type = "button",
  disabled = false
}: {
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline";
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}) => {
  const base = "px-8 py-4 font-semibold text-sm transition-all duration-300 flex items-center gap-2 group cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";
  const styles = {
    primary: `bg-[#1A1950] text-white hover:bg-opacity-90`,
    secondary: `bg-[#F8F9FA] text-[#1A1950] hover:bg-gray-100 border border-[#1A1950]/10`,
    outline: `border-2 border-[#1A1950] text-[#1A1950] hover:bg-[#1A1950] hover:text-white`
  };

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`${base} ${styles[variant]} ${className}`}>
      {children}
    </button>
  );
};

const Wordmark = ({ className = "" }: { className?: string }) => (
  <div className={`flex flex-col ${className}`}>
    <svg 
      width="180" 
      height="45" 
      viewBox="0 0 375 120" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className="h-auto w-[160px] md:w-[180px]"
    >
      <g transform="translate(0, -125)">
        <g fill="#1a1950">
          <path d="M 3.328 -18.671 L 15.953 -18.671 C 16.117 -15.660 17.210 -13.160 19.234 -11.171 C 21.253 -9.179 24.507 -8.187 29 -8.187 C 33.320 -8.187 36.304 -8.867 37.953 -10.234 C 39.597 -11.597 40.421 -13.414 40.421 -15.687 C 40.421 -19.781 37.890 -22.171 32.828 -22.859 L 20.296 -24.468 C 15.296 -25.093 11.429 -26.769 8.703 -29.5 C 5.972 -32.226 4.609 -35.925 4.609 -40.593 C 4.609 -45.707 6.550 -49.910 10.437 -53.203 C 14.332 -56.503 20.265 -58.156 28.234 -58.156 C 33.910 -58.156 38.507 -57.332 42.031 -55.687 C 45.562 -54.039 48.191 -51.835 49.921 -49.078 C 51.660 -46.316 52.644 -43.257 52.875 -39.906 L 40.171 -39.906 C 39.828 -42.582 38.687 -44.703 36.75 -46.265 C 34.820 -47.828 31.984 -48.609 28.234 -48.609 C 24.765 -48.609 22.132 -47.953 20.343 -46.640 C 18.550 -45.335 17.656 -43.578 17.656 -41.359 C 17.656 -39.710 18.179 -38.320 19.234 -37.187 C 20.285 -36.050 21.976 -35.335 24.312 -35.046 L 36.156 -33.593 C 47.695 -32.289 53.468 -26.75 53.468 -16.968 C 53.468 -13.269 52.644 -10.023 51 -7.234 C 49.351 -4.453 46.722 -2.304 43.109 -0.796 C 39.492 0.703 34.734 1.453 28.828 1.453 C 24.160 1.453 20.218 0.898 17 -0.203 C 13.789 -1.316 11.207 -2.828 9.25 -4.734 C 7.289 -6.640 5.843 -8.800 4.906 -11.218 C 3.968 -13.632 3.441 -16.117 3.328 -18.671 Z" transform="translate(0, 190)" />
          <path d="M 26.359 -7.328 C 29.140 -7.328 31.296 -7.851 32.828 -8.906 C 34.367 -9.957 35.421 -11.281 35.984 -12.875 L 48.093 -12.875 C 47.695 -10.601 46.742 -8.375 45.234 -6.187 C 43.734 -4 41.445 -2.191 38.375 -0.765 C 35.300 0.648 31.207 1.359 26.093 1.359 C 20.582 1.359 16.132 0.296 12.75 -1.828 C 9.363 -3.960 6.914 -6.765 5.406 -10.234 C 3.906 -13.703 3.156 -17.425 3.156 -21.406 C 3.156 -25.550 3.960 -29.328 5.578 -32.734 C 7.203 -36.148 9.718 -38.878 13.125 -40.921 C 16.539 -42.972 20.863 -44 26.093 -44 C 31.5 -44 35.804 -42.960 39.015 -40.890 C 42.222 -38.816 44.550 -36.070 46 -32.656 C 47.457 -29.25 48.187 -25.523 48.187 -21.484 C 48.187 -20.859 48.187 -20.25 48.187 -19.656 C 48.187 -19.062 48.128 -18.535 48.015 -18.078 L 15.515 -18.078 C 15.921 -14.046 17.070 -11.242 18.968 -9.671 C 20.875 -8.109 23.335 -7.328 26.359 -7.328 Z M 26.265 -35.484 C 23.253 -35.484 20.851 -34.769 19.062 -33.343 C 17.269 -31.925 16.117 -29.394 15.609 -25.75 L 36.156 -25.75 C 35.757 -32.238 32.460 -35.484 26.265 -35.484 Z" transform="translate(54, 190)" />
          <path d="M 4.343 -48.265 L 4.343 -56.718 L 18.078 -56.718 L 18.078 -48.265 Z M 4.953 0 L 4.953 -42.640 L 17.562 -42.640 L 17.562 0 Z" transform="translate(105, 190)" />
          <path d="M 2.218 -13.906 L 13.734 -13.906 C 13.898 -11.851 14.781 -10.113 16.375 -8.687 C 17.968 -7.269 20.351 -6.562 23.531 -6.562 C 26.375 -6.562 28.363 -7.015 29.5 -7.921 C 30.644 -8.835 31.218 -10.035 31.218 -11.515 C 31.218 -12.816 30.816 -13.910 30.015 -14.796 C 29.222 -15.679 27.632 -16.265 25.25 -16.546 L 15.687 -17.734 C 11.707 -18.242 8.648 -19.550 6.515 -21.656 C 4.390 -23.757 3.328 -26.601 3.328 -30.187 C 3.328 -33.375 4.148 -35.988 5.796 -38.031 C 7.441 -40.082 9.726 -41.601 12.656 -42.593 C 15.593 -43.593 18.937 -44.093 22.687 -44.093 C 28.425 -44.093 33.097 -42.953 36.703 -40.671 C 40.316 -38.398 42.320 -34.906 42.718 -30.187 L 31.046 -30.187 C 30.816 -31.945 30.031 -33.378 28.687 -34.484 C 27.351 -35.597 25.351 -36.156 22.687 -36.156 C 19.957 -36.156 17.992 -35.703 16.796 -34.796 C 15.609 -33.890 15.015 -32.753 15.015 -31.390 C 15.015 -30.304 15.382 -29.378 16.125 -28.609 C 16.863 -27.835 18.281 -27.312 20.375 -27.031 L 29.343 -26.015 C 34.394 -25.390 37.988 -23.976 40.125 -21.781 C 42.257 -19.593 43.328 -16.597 43.328 -12.796 C 43.328 -10.003 42.687 -7.539 41.406 -5.406 C 40.125 -3.281 38.019 -1.617 35.093 -0.421 C 32.164 0.765 28.253 1.359 23.359 1.359 C 18.304 1.359 14.242 0.648 11.171 -0.765 C 8.097 -2.191 5.863 -4.066 4.468 -6.390 C 3.082 -8.722 2.332 -11.226 2.218 -13.906 Z" transform="translate(127, 190)" />
          <path d="M 61.484 -44 C 66.890 -44 70.851 -42.421 73.375 -39.265 C 75.906 -36.109 77.171 -31.75 77.171 -26.187 L 77.171 0 L 64.562 0 L 64.562 -24.390 C 64.562 -30.640 62 -33.765 56.875 -33.765 C 53.695 -33.765 51.296 -32.628 49.671 -30.359 C 48.054 -28.085 47.25 -24.421 47.25 -19.359 L 47.25 0 L 34.875 0 L 34.875 -24.390 C 34.875 -30.640 32.316 -33.765 27.203 -33.765 C 24.015 -33.765 21.609 -32.628 19.984 -30.359 C 18.367 -28.085 17.562 -24.421 17.562 -19.359 L 17.562 0 L 4.953 0 L 4.953 -42.640 L 17.562 -42.640 L 17.562 -34.875 C 18.875 -37.601 20.707 -39.804 23.062 -41.484 C 25.425 -43.160 28.457 -44 32.156 -44 C 35.957 -44 39.023 -43.144 41.359 -41.437 C 43.691 -39.738 45.312 -37.296 46.218 -34.109 C 47.531 -37.066 49.406 -39.453 51.843 -41.265 C 54.289 -43.085 57.503 -44 61.484 -44 Z" transform="translate(173, 190)" />
          <path d="M 4.343 -48.265 L 4.343 -56.718 L 18.078 -56.718 L 18.078 -48.265 Z M 4.953 0 L 4.953 -42.640 L 17.562 -42.640 L 17.562 0 Z" transform="translate(255, 190)" />
          <path d="M 2.218 -13.906 L 13.734 -13.906 C 13.898 -11.851 14.781 -10.113 16.375 -8.687 C 17.968 -7.269 20.351 -6.562 23.531 -6.562 C 26.375 -6.562 28.363 -7.015 29.5 -7.921 C 30.644 -8.835 31.218 -10.035 31.218 -11.515 C 31.218 -12.816 30.816 -13.910 30.015 -14.796 C 29.222 -15.679 27.632 -16.265 25.25 -16.546 L 15.687 -17.734 C 11.707 -18.242 8.648 -19.550 6.515 -21.656 C 4.390 -23.757 3.328 -26.601 3.328 -30.187 C 3.328 -33.375 4.148 -35.988 5.796 -38.031 C 7.441 -40.082 9.726 -41.601 12.656 -42.593 C 15.593 -43.593 18.937 -44.093 22.687 -44.093 C 28.425 -44.093 33.097 -42.953 36.703 -40.671 C 40.316 -38.398 42.320 -34.906 42.718 -30.187 L 31.046 -30.187 C 30.816 -31.945 30.031 -33.378 28.687 -34.484 C 27.351 -35.597 25.351 -36.156 22.687 -36.156 C 19.957 -36.156 17.992 -35.703 16.796 -34.796 C 15.609 -33.890 15.015 -32.753 15.015 -31.390 C 15.015 -30.304 15.382 -29.378 16.125 -28.609 C 16.863 -27.835 18.281 -27.312 20.375 -27.031 L 29.343 -26.015 C 34.394 -25.390 37.988 -23.976 40.125 -21.781 C 42.257 -19.593 43.328 -16.597 43.328 -12.796 C 43.328 -10.003 42.687 -7.539 41.406 -5.406 C 40.125 -3.281 38.019 -1.617 35.093 -0.421 C 32.164 0.765 28.253 1.359 23.359 1.359 C 18.304 1.359 14.242 0.648 11.171 -0.765 C 8.097 -2.191 5.863 -4.066 4.468 -6.390 C 3.082 -8.722 2.332 -11.226 2.218 -13.906 Z" transform="translate(277, 190)" />
          <path d="M 36.671 0 L 24.312 -16.718 L 17.562 -10.234 L 17.562 0 L 4.953 0 L 4.953 -59.703 L 17.562 -59.703 L 17.562 -22.765 C 19.101 -24.929 20.582 -26.812 22 -28.406 L 35.562 -42.640 L 50.656 -42.640 L 50.656 -42.296 L 32.328 -24.468 L 51.687 0 Z" transform="translate(323, 190)" />
        </g>
        <g fill="#1a1950" opacity="0.6">
          {/* Industrial Consulting subtitle placeholder for layout balance */}
          <path d="M 2.238 0 L 4.152 0 L 4.152 -15.164 L 2.238 -15.164 Z" transform="translate(73, 230) scale(0.6)" />
          <path d="M 6.898 -10.652 C 5.781 -10.652 4.679 -10.234 3.621 -9.324 L 3.261 -10.347 L 1.988 -10.347 L 1.988 0 L 3.789 0 L 3.789 -7.656 C 4.664 -8.566 5.589 -8.984 6.539 -8.984 C 7.789 -8.984 8.414 -8.320 8.414 -6.898 L 8.414 0 L 10.214 0 L 10.214 -7.238 C 10.214 -9.476 9.003 -10.652 6.898 -10.652 Z" transform="translate(78, 230) scale(0.6)" />
          {/* ... keeping it simplified to prevent token overflow while maintaining style ... */}
          <text transform="translate(140, 226)" fontSize="14" fontWeight="bold" letterSpacing="2.5">INDUSTRIAL CONSULTING</text>
        </g>
      </g>
    </svg>
  </div>
);

const Modal = ({ isOpen, onClose, title, children }: { isOpen: boolean, onClose: () => void, title: string, children: ReactNode }) => (
  <AnimatePresence>
    {isOpen && (
      <>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#1A1950]/60 backdrop-blur-sm z-[60]"
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white p-8 md:p-12 z-[70] shadow-2xl"
        >
          <button onClick={onClose} className="absolute right-6 top-6 opacity-40 hover:opacity-100 transition-opacity">
            <X className="w-6 h-6" />
          </button>
          <h2 className="text-2xl font-bold mb-8">{title}</h2>
          {children}
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

export default function App() {
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [formState, handleFormSubmit] = useForm("mojrlzba");

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6,
        staggerChildren: 0.1 
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-[#1A1950] font-sans selection:bg-[#1A1950] selection:text-white">
      {/* Task Modal */}
      <Modal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        title={formState.succeeded ? "Task received." : "Send us a task"}
      >
        {formState.succeeded ? (
          <div className="space-y-6">
            <p className="text-base opacity-80 leading-relaxed">
              Thanks. We'll respond within 48 hours with whether we'll take it, what we would do first, and what it would cost.
            </p>
            <Button variant="outline" onClick={() => setIsTaskModalOpen(false)} className="w-full justify-center py-5">
              Close
            </Button>
          </div>
        ) : (
          <form className="space-y-6" onSubmit={handleFormSubmit}>
            <div className="space-y-2">
              <label htmlFor="name" className="text-xs uppercase font-bold tracking-widest opacity-40">Your Name</label>
              <input id="name" name="name" type="text" required className="w-full border-b-2 border-gray-100 py-3 focus:outline-none focus:border-[#1A1950] transition-colors bg-transparent" placeholder="John Doe" />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-xs uppercase font-bold tracking-widest opacity-40">E-mail address</label>
              <input id="email" name="email" type="email" required className="w-full border-b-2 border-gray-100 py-3 focus:outline-none focus:border-[#1A1950] transition-colors bg-transparent" placeholder="john@company.com" />
              <ValidationError field="email" errors={formState.errors} className="text-xs text-red-600" />
            </div>
            <div className="space-y-2">
              <label htmlFor="message" className="text-xs uppercase font-bold tracking-widest opacity-40">Tell us about you</label>
              <textarea id="message" name="message" rows={4} required className="w-full border-b-2 border-gray-100 py-3 focus:outline-none focus:border-[#1A1950] transition-colors bg-transparent resize-none" placeholder="How can we help?" />
              <ValidationError field="message" errors={formState.errors} className="text-xs text-red-600" />
            </div>
            <ValidationError errors={formState.errors} className="text-xs text-red-600" />
            <Button variant="primary" type="submit" disabled={formState.submitting} className="w-full justify-center py-5">
              {formState.submitting ? "Sending..." : "Submit task"}
            </Button>
          </form>
        )}
      </Modal>

      {/* Privacy Modal */}
      <Modal isOpen={isPrivacyModalOpen} onClose={() => setIsPrivacyModalOpen(false)} title="Legal & Privacy Information">
        <div className="prose prose-sm opacity-70 max-h-[60vh] overflow-y-auto pr-4 space-y-6 text-sm leading-relaxed">
          <section>
            <h4 className="font-bold text-[#1A1950] uppercase tracking-wider text-xs mb-2">1. Company Information</h4>
            <p>We are SIA "Lietus", registration number: 40203302687, legal address: Iecavas iela 1-32, Riga, LV-1083. Our data protection point of contact is dati@lietus.agency.</p>
          </section>

          <section>
            <h4 className="font-bold text-[#1A1950] uppercase tracking-wider text-xs mb-2">2. Data Subject Rights</h4>
            <p>You have the right to access your personal data, request its correction or deletion, restrict or object to its processing, and exercise the right to data portability in accordance with the General Data Protection Regulation (GDPR).</p>
          </section>

          <section>
            <h4 className="font-bold text-[#1A1950] uppercase tracking-wider text-xs mb-2">3. Purpose and Legal Basis</h4>
            <p>We process personal data (name, email, communication history) for the following purposes:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Provision of industrial consulting services (Article 6(1)(b) of the GDPR).</li>
              <li>Compliance with legal obligations, including accounting and archiving (Article 6(1)(c)).</li>
              <li>Legitimate business interests including direct identification and communication (Article 6(1)(f)).</li>
            </ul>
          </section>

          <section>
            <h4 className="font-bold text-[#1A1950] uppercase tracking-wider text-xs mb-2">4. Data Retention</h4>
            <p>Data is stored for as long as necessary to fulfill the relevant purposes:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Accounting documents: 5 years minimum.</li>
              <li>Legal claim defense: 10 years (general limitation period).</li>
            </ul>
          </section>

          <section>
            <h4 className="font-bold text-[#1A1950] uppercase tracking-wider text-xs mb-2">5. Complaints</h4>
            <p>If you believe your data protection rights have been violated, you have the right to lodge a complaint with the Data State Inspectorate (Datu Valsts Inspekcija).</p>
          </section>
        </div>
      </Modal>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 md:px-12 h-20 flex items-center justify-between">
          <Wordmark />
          
          <div className="hidden md:flex items-center gap-10">
            {['Work', 'Mechanism', 'About'].map((item) => (
              <a 
                key={item} 
                href={`#${item.toLowerCase()}`} 
                className="text-sm font-medium hover:opacity-100 opacity-60 transition-opacity"
              >
                {item}
              </a>
            ))}
            <Button variant="primary" onClick={() => setIsTaskModalOpen(true)} className="py-2.5 px-6">Send a task</Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <Section className="pt-48 pb-32">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="max-w-5xl"
        >
          <motion.h1 
            variants={itemVariants}
            className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-12"
            style={{ color: BRAND_NAVY }}
          >
            Ops consulting <br />
            that <span className="italic">executes</span>, <br className="md:hidden" />
            not just diagnoses.
          </motion.h1>
          <motion.p 
            variants={itemVariants}
            className="text-xl md:text-2xl opacity-70 mb-12 font-medium whitespace-nowrap"
          >
            For businesses expanding faster than their back office can hold.
          </motion.p>
          <motion.div variants={itemVariants}>
            <Button variant="primary" onClick={() => setIsTaskModalOpen(true)}>
              Send us a task <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
        </motion.div>
      </Section>

      {/* Problem Section */}
      <div className="bg-gray-50 border-y border-gray-100">
        <Section id="problem" className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-xs uppercase tracking-[0.2em] font-bold opacity-40 mb-8 block">The Context</span>
            <h2 className="text-3xl font-bold mb-8 leading-tight">You are growing too fast to feel safe.</h2>
            <p className="text-lg opacity-80 leading-relaxed mb-6">
              Three decisions are open on your desk and each one has a six-figure tail: manufacture or outsource, your own warehouse or a 3PL, automate this process or staff it. 
            </p>
            <p className="text-lg opacity-80 leading-relaxed">
              Errors compound across the back office and the last two hires did not slow them down. Half the day is spent picking which fire is the expensive one. The other half is spent winging it.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col justify-center"
          >
            <div className="bg-white p-10 border border-gray-100 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-[#1A1950]" />
              <h3 className="text-xl font-bold mb-6">The Agitation</h3>
              <p className="text-gray-600 mb-8 leading-relaxed">
                The generalist ops hire learned the spreadsheets and the next month had three more spreadsheets. The consultancy showed up, billed for ninety days of discovery, and left a deck. 
              </p>
              <div className="bg-[#1A1950]/5 p-6 border border-[#1A1950]/10 italic text-[#1A1950]/80">
                "The third option — keep winging it — works until the bet you wing is the one that breaks the year."
              </div>
            </div>
          </motion.div>
        </Section>
      </div>

      {/* Solution Section */}
      <Section id="work" className="py-32">
        <div className="mb-20">
          <span className="text-xs uppercase tracking-[0.2em] font-bold opacity-40 mb-4 block">Our Approach</span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">The implementation-first model.</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Stage 1 */}
          <div className="space-y-10">
            <div className="pb-8 border-b border-[#1A1950]/10">
              <span className="text-sm font-bold opacity-60 mb-2 block">Stage 1</span>
              <h3 className="text-2xl font-bold">Research-grounded answers.</h3>
              <p className="opacity-70 mt-2">The questions you cannot afford to guess at, answered against your own numbers and the public evidence.</p>
            </div>
            
            <div className="space-y-8">
              {[
                { icon: <Factory className="w-5 h-5" />, title: "Make or buy", text: "In-house manufacturing vs. contract — landed cost, lead time, capital tied up, exit cost." },
                { icon: <Warehouse className="w-5 h-5" />, title: "Own warehouse or 3PL", text: "Square footage, headcount, throughput, lease vs. per-pallet math." },
                { icon: <Settings className="w-5 h-5" />, title: "Automate or staff", text: "Which processes pay back automation in twelve months, which ones do not, and which ones stay manual on purpose." }
              ].map((item, i) => (
                <div key={i} className="flex gap-6">
                  <div className="w-12 h-12 bg-[#1A1950] text-white flex items-center justify-center shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">{item.title}</h4>
                    <p className="text-sm opacity-70 leading-relaxed">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stage 2 */}
          <div className="space-y-10">
            <div className="pb-8 border-b border-[#1A1950]/10">
              <span className="text-sm font-bold opacity-60 mb-2 block">Stage 2</span>
              <h3 className="text-2xl font-bold">AI-powered implementation.</h3>
              <p className="opacity-70 mt-2">The answer is not a deck. The answer is the system running.</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { title: "Systems set up", text: "ERP, process automation, systems and structures — configured against the answer from Stage 1." },
                { title: "Integrations built", text: "The glue between systems, owned and maintained, with someone on the hook when APIs move." },
                { title: "Analysis on live data", text: "Research engine reads live data for exceptions, drift, and where the next bet is forming." },
                { title: "A scoped action plan", text: "Named outcomes, named gates, named owners for the next 3 and 12 months." }
              ].map((item, i) => (
                <div key={i} className="p-6 bg-gray-50 border border-gray-100 hover:border-[#1A1950]/30 transition-colors">
                  <h4 className="font-bold mb-2 text-sm">{item.title}</h4>
                  <p className="text-xs opacity-70 leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* Small task Offer */}
      <div className="bg-[#1A1950] text-[#FDFDFD]">
        <Section className="py-24 text-center max-w-5xl">
          <span className="text-xs uppercase tracking-[0.2em] font-bold opacity-60 mb-8 block">The Entry Point</span>
          <h2 className="text-3xl md:text-5xl font-bold mb-10 leading-tight">
            Send us a small task.<br />We onboard while we complete it.
          </h2>
          <p className="text-lg opacity-70 mb-12 max-w-3xl mx-auto leading-relaxed">
            We do not gate the relationship behind a paid discovery phase or a 60-page SOW. Pick the smallest real thing on your list — a re-quote you have been postponing, a carrier integration that keeps breaking, a make-vs-buy question with a number attached. We deliver it. You see how we work.
          </p>
          <div className="flex flex-col items-center gap-6">
            <Button variant="secondary" onClick={() => setIsTaskModalOpen(true)} className="px-12 py-5 text-lg">
              Send a task <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <p className="text-sm opacity-50 italic italic font-light">
              See how we work, on something that mattered anyway.
            </p>
          </div>
        </Section>
      </div>

      {/* Mechanism */}
      <Section id="mechanism" className="py-32 grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
        <div>
          <span className="text-xs uppercase tracking-[0.2em] font-bold opacity-40 mb-6 block">The Mechanism</span>
          <h2 className="text-4xl font-bold mb-8 leading-[1.1]">Built for speed and high stakes.</h2>
          <div className="space-y-6 text-lg opacity-80 leading-relaxed">
            <p>Work starts on day one. While solving the first challenge, we onboard, day by day, all while providing a solution that fits you, and is used by your staff.</p>
            <p>With AI at the core of our ops, solutions come in days, not months. We just make sure the AI part can be reliable. </p>
            <div className="p-6 border-l-2 border-[#1A1950] bg-gray-50 italic mt-8">
              Most "AI consultancies" mean <span className="font-bold underline decoration-1 underline-offset-4">we typed your problem into a chatbot</span>. This is not that.
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="aspect-square bg-gray-50 border border-gray-100 p-8 flex flex-col justify-between group hover:bg-[#1A1950] hover:text-white transition-all">
            <Zap className="w-8 h-8 opacity-40 group-hover:opacity-100" />
            <div>
              <p className="text-2xl font-bold">24h</p>
              <p className="text-xs uppercase font-bold tracking-wider opacity-60">Initial Response</p>
            </div>
          </div>
          <div className="aspect-square bg-gray-50 border border-gray-100 p-8 flex flex-col justify-between group hover:bg-[#1A1950] hover:text-white transition-all">
            <Cpu className="w-8 h-8 opacity-40 group-hover:opacity-100" />
            <div>
              <p className="text-2xl font-bold">2-4W</p>
              <p className="text-xs uppercase font-bold tracking-wider opacity-60">Systems Deployment</p>
            </div>
          </div>
          <div className="aspect-square bg-gray-50 border border-gray-100 p-8 flex flex-col justify-between group hover:bg-[#1A1950] hover:text-white transition-all">
            <Database className="w-8 h-8 opacity-40 group-hover:opacity-100" />
            <div>
              <p className="text-2xl font-bold">100%</p>
              <p className="text-xs uppercase font-bold tracking-wider opacity-60">Data Ownership</p>
            </div>
          </div>
          <div className="aspect-square bg-gray-50 border border-gray-100 p-8 flex flex-col justify-between group hover:bg-[#1A1950] hover:text-white transition-all">
            <CheckCircle2 className="w-8 h-8 opacity-40 group-hover:opacity-100" />
            <div>
              <p className="text-2xl font-bold">Fixed</p>
              <p className="text-xs uppercase font-bold tracking-wider opacity-60">Outcome-based</p>
            </div>
          </div>
        </div>
      </Section>

      {/* Case highlight */}
      <div className="bg-gray-50 border-y border-gray-100">
        <Section className="py-32">
          <div className="flex flex-col md:flex-row gap-20">
            <div className="md:w-1/3">
              <span className="text-xs uppercase tracking-[0.2em] font-bold opacity-40 mb-6 block">Case highlight</span>
              <h2 className="text-3xl font-bold mb-6">Multi-manufacturer fulfillment.</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Package className="w-5 h-5 opacity-40" />
                  <span className="text-sm font-medium">US importer / EU Brands</span>
                </div>
                <div className="flex items-center gap-3">
                  <Warehouse className="w-5 h-5 opacity-40" />
                  <span className="text-sm font-medium">3PL + Distribution Hub</span>
                </div>
              </div>
            </div>
            
            <div className="md:w-2/3 space-y-8">
              <div>
                <p className="text-sm font-bold opacity-60 uppercase tracking-wider mb-4">The Challenge</p>
                <p className="text-lg opacity-80 leading-relaxed">
                  The back office was a storefront duct-taped to a spreadsheet. Orders fulfilled by free-text emails to suppliers. 3PL partners couldn't connect because it was all random spreadsheets and phone calls. Fulfillment just couldn't keep up with growth.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-6 bg-white border border-gray-100 shadow-sm">
                  <p className="text-xs font-bold opacity-40 uppercase mb-3">Stage 1 Implementation</p>
                  <p className="text-sm leading-relaxed opacity-70">ERP integration strategy, 3PL scope definition, warehouse selection based on financial modeling of historical order destinations.</p>
                </div>
                <div className="p-6 bg-white border border-gray-100 shadow-sm">
                  <p className="text-xs font-bold opacity-40 uppercase mb-3">Stage 2 Implementation</p>
                  <p className="text-sm leading-relaxed opacity-70">ERP live, hardened storefront-to-ERP connector, custom carrier integration, own warehouse lease and configuration.</p>
                </div>
              </div>

              <div className="pt-8 border-t border-gray-200">
                <div className="text-4xl font-bold mb-2">80 hours</div>
                <p className="text-sm font-bold opacity-60 uppercase tracking-widest leading-none">Manhours returned per month</p>
              </div>
            </div>
          </div>
        </Section>
      </div>

      {/* About */}
      <Section id="about" className="py-32 max-w-4xl">
        <span className="text-xs uppercase tracking-[0.2em] font-bold opacity-40 mb-10 block">About Seismisk</span>
        <h2 className="text-3xl font-bold mb-10">Strategic advisors to the next generation of brands.</h2>
        <div className="space-y-8 text-xl md:text-2xl font-medium leading-relaxed">
          <p>Seismisk advises rapidly expanding light-manufacturing, ecommerce, and own-product brands selling in US, from EU.</p>
          <p className="opacity-60">Ten years of strategic consulting to corporations; the last two spent rebuilding how that work is done with AI under strict governance.</p>
        </div>
      </Section>

      {/* Final CTA */}
      <Section className="py-40 bg-[#F8F9FA] rounded-[3rem] my-20 border border-gray-100 shadow-sm max-w-6xl">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-10 tracking-tight leading-[1.1]">Send us a task.</h2>
          <p className="text-xl md:text-2xl opacity-70 mb-12 leading-relaxed">
            Not a brief. Not an RFP. The smallest real thing on your list. We will tell you within 48 hours whether we will take it, what we would do first, and what it would cost.
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-6">
            <Button variant="primary" onClick={() => setIsTaskModalOpen(true)} className="px-10 py-5 text-lg justify-center">Send a task</Button>
            <Button variant="outline" onClick={() => setIsTaskModalOpen(true)} className="px-10 py-5 text-lg justify-center">I have a task</Button>
          </div>
        </div>
      </Section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-20 px-6 md:px-12 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-12">
          <div className="space-y-6">
            <Wordmark />
            <a href="mailto:task@seismisk.com" className="text-lg font-medium hover:underline block">task@seismisk.com</a>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-12 text-sm">
            <div className="space-y-4">
              <p className="font-bold opacity-30 uppercase tracking-widest text-[10px]">Follow</p>
              <a href="https://www.linkedin.com/in/olegs-nikitins/" target="_blank" rel="noopener noreferrer" className="block hover:opacity-70 opacity-60">LinkedIn</a>
            </div>
            <div className="space-y-4">
              <p className="font-bold opacity-30 uppercase tracking-widest text-[10px]">Company</p>
              <a href="#work" className="block hover:opacity-70 opacity-60">Works</a>
              <a href="#mechanism" className="block hover:opacity-70 opacity-60">Mechanism</a>
              <a href="#about" className="block hover:opacity-70 opacity-60">About</a>
              <button onClick={() => setIsPrivacyModalOpen(true)} className="block hover:opacity-70 opacity-60 text-left cursor-pointer">Privacy Policy</button>
            </div>
            <div className="space-y-4 max-w-[160px]">
              <p className="font-bold opacity-30 uppercase tracking-widest text-[10px]">Legal</p>
              <p className="opacity-40 leading-relaxed">
                © 2026 SIA Lietus<br />
                40203302687<br />
                Riga, Latvia
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
