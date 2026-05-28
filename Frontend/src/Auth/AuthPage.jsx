import { useState, useCallback, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence, useScroll } from 'framer-motion'
import LoginForm from './LoginForm'
import SignupForm from './SignupForm'
import ResetPassword from './ResetPassword'
import VerifyEmail from './VerifyEmail'
import OAuthButtons from './OAuthButtons'

const easeLusion = [0.4, 0, 0.1, 1]

function fadeUp(delay = 0) {
  return {
    initial: { opacity: 0, y: 12, filter: 'blur(2px)' },
    animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
    transition: { duration: 0.5, delay, ease: easeLusion },
  }
}

function CrossDecor() {
  return (
    <>
      <div className="absolute top-8 left-8 text-cool-gray/[0.07]"><span className="cross" /></div>
      <div className="absolute top-8 right-8 text-cool-gray/[0.07]"><span className="cross" /></div>
      <div className="absolute bottom-8 left-8 text-cool-gray/[0.07]"><span className="cross" /></div>
      <div className="absolute bottom-8 right-8 text-cool-gray/[0.07]"><span className="cross" /></div>
    </>
  )
}

export default function AuthPage() {
  const [tab, setTab] = useState('login')
  const [flow, setFlow] = useState('form')
  const [email, setEmail] = useState('')
  const { scrollYProgress } = useScroll()
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    return scrollYProgress.on('change', setProgress)
  }, [scrollYProgress])

  const goToReset = useCallback((e) => {
    setEmail(e || '')
    setFlow('reset')
  }, [])

  const backToLogin = useCallback(() => {
    setFlow('form')
    setTab('login')
  }, [])

  const onSignupSuccess = useCallback((e) => {
    setEmail(e)
    setFlow('verify')
  }, [])

  return (
    <div className="relative min-h-[100dvh] bg-deep-slate flex flex-col overflow-hidden">
      <div className="scroll-progress" role="progressbar" aria-valuenow={Math.round(progress * 100)} aria-label="Page scroll progress">
        <div className="scroll-progress-track" />
        <div className="scroll-progress-bar" style={{ height: `${progress * 100}%` }} />
      </div>

      <CrossDecor />

      <div
        className="pointer-events-none fixed inset-0 opacity-[0.07]"
        style={{
          background:
            'radial-gradient(ellipse 600px 500px at 50% 35%, #e94560, transparent 70%)',
        }}
      />

      <header className="relative z-10 flex items-center justify-between px-6 py-6">
        <motion.div {...fadeUp(0)}>
          <Link
            to="/"
            className="font-sora text-2xl font-bold tracking-tight text-glacier-white flex items-center gap-3"
          >
            <span className="w-2 h-2 rounded-full bg-crisis-red" />
            DisasterTracker
          </Link>
        </motion.div>
        <motion.div {...fadeUp(0.08)}>
          <Link
            to="/"
            className="text-sm text-cool-gray/70 hover:text-glacier-white transition-colors duration-300"
          >
            Back to home
          </Link>
        </motion.div>
      </header>

      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-sm">
          <AnimatePresence mode="wait">
            {flow === 'form' && (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 16, filter: 'blur(4px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -12, filter: 'blur(4px)' }}
                transition={{ duration: 0.4, ease: easeLusion }}
              >
                <div className="text-center mb-12">
                  <motion.h1 {...fadeUp(0.1)} className="font-sora text-4xl font-bold tracking-tight text-glacier-white leading-[1.1]">
                    {tab === 'login' && 'Welcome back'}
                    {tab === 'signup' && 'Join the network'}
                  </motion.h1>
                  <motion.p {...fadeUp(0.16)} className="mt-3 text-sm text-cool-gray/70">
                    {tab === 'login' && 'Emergency response command center'}
                    {tab === 'signup' && 'Create your command center account'}
                  </motion.p>
                </div>

                <motion.div {...fadeUp(0.22)}>
                  <div className="flex mb-8 bg-white/[0.04] rounded-xl p-1 ring-1 ring-white/[0.06]">
                    <button
                      onClick={() => setTab('login')}
                      className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition-all duration-300 ${
                        tab === 'login'
                          ? 'bg-deep-slate text-glacier-white shadow-[0_1px_3px_rgba(0,0,0,0.3)] ring-1 ring-white/[0.06]'
                          : 'text-cool-gray/60 hover:text-glacier-white'
                      }`}
                    >
                      Sign in
                    </button>
                    <button
                      onClick={() => setTab('signup')}
                      className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition-all duration-300 ${
                        tab === 'signup'
                          ? 'bg-deep-slate text-glacier-white shadow-[0_1px_3px_rgba(0,0,0,0.3)] ring-1 ring-white/[0.06]'
                          : 'text-cool-gray/60 hover:text-glacier-white'
                      }`}
                    >
                      Create account
                    </button>
                  </div>
                </motion.div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={tab}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25, ease: easeLusion }}
                  >
                    {tab === 'login' && <LoginForm onForgotPassword={goToReset} />}
                    {tab === 'signup' && <SignupForm onSuccess={onSignupSuccess} />}
                  </motion.div>
                </AnimatePresence>

                <motion.div {...fadeUp(0.34)}>
                  <OAuthButtons />
                </motion.div>
              </motion.div>
            )}

            {flow === 'reset' && (
              <motion.div
                key="reset"
                initial={{ opacity: 0, y: 16, filter: 'blur(4px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -12, filter: 'blur(4px)' }}
                transition={{ duration: 0.4, ease: easeLusion }}
              >
                <div className="text-center mb-12">
                  <h1 className="font-sora text-4xl font-bold tracking-tight text-glacier-white leading-[1.1]">
                    Reset password
                  </h1>
                  <p className="mt-3 text-sm text-cool-gray/70">
                    We'll send you a reset link
                  </p>
                </div>
                <ResetPassword email={email} onBack={backToLogin} />
              </motion.div>
            )}

            {flow === 'verify' && (
              <motion.div
                key="verify"
                initial={{ opacity: 0, y: 16, filter: 'blur(4px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -12, filter: 'blur(4px)' }}
                transition={{ duration: 0.4, ease: easeLusion }}
              >
                <div className="text-center mb-12">
                  <h1 className="font-sora text-4xl font-bold tracking-tight text-glacier-white leading-[1.1]">
                    Check your email
                  </h1>
                  <p className="mt-3 text-sm text-cool-gray/70">
                    Almost there
                  </p>
                </div>
                <VerifyEmail email={email} onBack={backToLogin} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <motion.p
        {...fadeUp(0.5)}
        className="relative z-10 text-center pb-8 text-[11px] text-cool-gray/40"
      >
        Protected by end-to-end encryption
      </motion.p>
    </div>
  )
}
