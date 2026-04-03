import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, User, Eye, EyeOff, ArrowLeft, Chrome, Apple, Sparkles, MapPin, Zap } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { useUser } from './UserContext';

type AuthMode = 'welcome' | 'login' | 'register' | 'forgot';

interface AuthScreenProps {
  onAuthComplete: () => void;
}

export function AuthScreen({ onAuthComplete }: AuthScreenProps) {
  const { login, register } = useUser();
  const [mode, setMode] = useState<AuthMode>('welcome');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Form states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  // Errors
  const [loginError, setLoginError] = useState('');
  const [regError, setRegError] = useState('');

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    // Simulate Google OAuth delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    login('google');
    setIsLoading(false);
    onAuthComplete();
  };

  const handleAppleLogin = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    login('apple');
    setIsLoading(false);
    onAuthComplete();
  };

  const handleEmailLogin = async () => {
    setLoginError('');
    if (!loginEmail.trim()) {
      setLoginError('Введите email');
      return;
    }
    if (!loginPassword.trim()) {
      setLoginError('Введите пароль');
      return;
    }
    if (loginPassword.length < 6) {
      setLoginError('Пароль минимум 6 символов');
      return;
    }
    setIsLoading(true);
    try {
      await login('email', { email: loginEmail, password: loginPassword });
      onAuthComplete();
    } catch (error: any) {
      setLoginError(error.message || 'Ошибка входа');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
    setRegError('');
    if (!regName.trim()) {
      setRegError('Введите имя');
      return;
    }
    if (!regEmail.trim()) {
      setRegError('Введите email');
      return;
    }
    if (!regEmail.includes('@')) {
      setRegError('Некорректный email');
      return;
    }
    if (regPassword.length < 6) {
      setRegError('Пароль минимум 6 символов');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setRegError('Пароли не совпадают');
      return;
    }
    setIsLoading(true);
    try {
      await register({ name: regName, email: regEmail, password: regPassword });
      onAuthComplete();
    } catch (error: any) {
      setRegError(error.message || 'Ошибка регистрации');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!forgotEmail.trim() || !forgotEmail.includes('@')) return;
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setForgotSent(true);
    setIsLoading(false);
  };

  // Floating particles animation
  const particles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    emoji: ['🎶', '🔥', '💜', '⚡', '✨', '🎯', '🌟', '💫', '🎪', '🎭', '🌆', '🗺️'][i],
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 5,
    duration: 4 + Math.random() * 6,
  }));

  return (
    <div className="fixed inset-0 h-screen w-screen bg-gradient-to-b from-gray-950 via-purple-950 to-gray-950 overflow-hidden relative flex flex-col z-50">
      {/* Background floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute text-2xl opacity-20"
            style={{ left: `${p.x}%`, top: `${p.y}%` }}
            animate={{
              y: [0, -30, 0],
              x: [0, 15, -15, 0],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            {p.emoji}
          </motion.div>
        ))}
      </div>

      {/* Glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-pink-600/15 rounded-full blur-[100px]" />

      <AnimatePresence mode="wait">
        {mode === 'welcome' && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="flex-1 flex flex-col justify-between p-6 relative z-10"
          >
            {/* Logo & Title */}
            <div className="flex-1 flex flex-col items-center justify-center">
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, type: 'spring' }}
                className="mb-8"
              >
                <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center shadow-2xl shadow-purple-500/30 relative">
                  <MapPin className="w-12 h-12 text-white" />
                  <motion.div
                    className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-green-400 flex items-center justify-center"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Zap className="w-3 h-3 text-green-900" />
                  </motion.div>
                </div>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-center mb-4"
              >
                <h1 className="text-4xl font-bold text-white mb-3">
                  AI Reality Map
                </h1>
                <p className="text-purple-300/80 text-lg max-w-xs mx-auto">
                  Живая карта города. Эмоции, события, люди в реальном времени.
                </p>
              </motion.div>

              {/* Feature highlights */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex gap-6 mt-6"
              >
                {[
                  { emoji: '🗺️', label: 'Вайб-карта' },
                  { emoji: '⚡', label: 'Чек-ины' },
                  { emoji: '🎯', label: 'Квесты' },
                ].map((feat, i) => (
                  <div key={i} className="text-center">
                    <div className="text-2xl mb-1">{feat.emoji}</div>
                    <span className="text-xs text-purple-300/60">{feat.label}</span>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Auth Buttons */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="space-y-3"
            >
              {/* Google */}
              <Button
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="w-full py-6 rounded-2xl bg-white hover:bg-gray-100 text-gray-900 flex items-center justify-center gap-3 shadow-xl shadow-white/10 disabled:opacity-50"
              >
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full"
                  />
                ) : (
                  <>
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    <span className="font-semibold">Войти через Google</span>
                  </>
                )}
              </Button>

              {/* Apple */}
              <Button
                onClick={handleAppleLogin}
                disabled={isLoading}
                className="w-full py-6 rounded-2xl bg-black hover:bg-gray-900 text-white flex items-center justify-center gap-3 border border-gray-700 disabled:opacity-50"
              >
                <Apple className="w-5 h-5" />
                <span className="font-semibold">Войти через Apple</span>
              </Button>

              {/* Divider */}
              <div className="flex items-center gap-3 py-1">
                <div className="flex-1 h-px bg-gray-700" />
                <span className="text-gray-500 text-sm">или</span>
                <div className="flex-1 h-px bg-gray-700" />
              </div>

              {/* Email login */}
              <Button
                onClick={() => setMode('login')}
                className="w-full py-6 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white flex items-center justify-center gap-3 shadow-lg shadow-purple-500/20"
              >
                <Mail className="w-5 h-5" />
                <span className="font-semibold">Войти через Email</span>
              </Button>

              {/* Register link */}
              <div className="text-center pt-2">
                <span className="text-gray-500 text-sm">Нет аккаунта? </span>
                <button
                  onClick={() => setMode('register')}
                  className="text-purple-400 text-sm font-semibold hover:text-purple-300 transition-colors"
                >
                  Зарегистрироваться
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {mode === 'login' && (
          <motion.div
            key="login"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="flex-1 flex flex-col p-6 relative z-10"
          >
            {/* Back button */}
            <button
              onClick={() => { setMode('welcome'); setLoginError(''); }}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 w-fit"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm">Назад</span>
            </button>

            <div className="flex-1 flex flex-col justify-center">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <Sparkles className="w-7 h-7 text-purple-400" />
                  <h2 className="text-3xl font-bold text-white">Добро пожаловать</h2>
                </div>
                <p className="text-gray-400 mb-8">Войдите в свой аккаунт</p>

                <div className="space-y-4">
                  {/* Email */}
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <Input
                      type="email"
                      placeholder="Email"
                      value={loginEmail}
                      onChange={e => setLoginEmail(e.target.value)}
                      className="pl-12 py-6 rounded-2xl bg-gray-800/80 border-gray-700 text-white placeholder:text-gray-500 focus:border-purple-500"
                    />
                  </div>

                  {/* Password */}
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Пароль"
                      value={loginPassword}
                      onChange={e => setLoginPassword(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleEmailLogin()}
                      className="pl-12 pr-12 py-6 rounded-2xl bg-gray-800/80 border-gray-700 text-white placeholder:text-gray-500 focus:border-purple-500"
                    />
                    <button
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>

                  {/* Error */}
                  {loginError && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-400 text-sm px-1"
                    >
                      {loginError}
                    </motion.p>
                  )}

                  {/* Forgot password */}
                  <div className="text-right">
                    <button
                      onClick={() => setMode('forgot')}
                      className="text-purple-400 text-sm hover:text-purple-300"
                    >
                      Забыли пароль?
                    </button>
                  </div>

                  {/* Login button */}
                  <Button
                    onClick={handleEmailLogin}
                    disabled={isLoading}
                    className="w-full py-6 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold shadow-lg shadow-purple-500/20 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      />
                    ) : (
                      'Войти'
                    )}
                  </Button>

                  {/* Divider */}
                  <div className="flex items-center gap-3 py-1">
                    <div className="flex-1 h-px bg-gray-700" />
                    <span className="text-gray-500 text-sm">быстрый вход</span>
                    <div className="flex-1 h-px bg-gray-700" />
                  </div>

                  {/* Social login */}
                  <div className="flex gap-3">
                    <Button
                      onClick={handleGoogleLogin}
                      disabled={isLoading}
                      className="flex-1 py-5 rounded-2xl bg-gray-800 hover:bg-gray-700 border border-gray-700 disabled:opacity-50"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                      </svg>
                    </Button>
                    <Button
                      onClick={handleAppleLogin}
                      disabled={isLoading}
                      className="flex-1 py-5 rounded-2xl bg-gray-800 hover:bg-gray-700 border border-gray-700 disabled:opacity-50"
                    >
                      <Apple className="w-5 h-5 text-white" />
                    </Button>
                  </div>
                </div>

                <div className="text-center mt-6">
                  <span className="text-gray-500 text-sm">Нет аккаунта? </span>
                  <button
                    onClick={() => { setMode('register'); setLoginError(''); }}
                    className="text-purple-400 text-sm font-semibold hover:text-purple-300"
                  >
                    Создать
                  </button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}

        {mode === 'register' && (
          <motion.div
            key="register"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="flex-1 flex flex-col p-6 relative z-10 overflow-y-auto"
          >
            <button
              onClick={() => { setMode('welcome'); setRegError(''); }}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6 w-fit"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm">Назад</span>
            </button>

            <div className="flex-1 flex flex-col justify-center">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <Sparkles className="w-7 h-7 text-pink-400" />
                  <h2 className="text-3xl font-bold text-white">Создать аккаунт</h2>
                </div>
                <p className="text-gray-400 mb-8">Присоединяйся к комьюнити</p>

                <div className="space-y-4">
                  {/* Name */}
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <Input
                      type="text"
                      placeholder="Имя"
                      value={regName}
                      onChange={e => setRegName(e.target.value)}
                      className="pl-12 py-6 rounded-2xl bg-gray-800/80 border-gray-700 text-white placeholder:text-gray-500 focus:border-purple-500"
                    />
                  </div>

                  {/* Email */}
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <Input
                      type="email"
                      placeholder="Email"
                      value={regEmail}
                      onChange={e => setRegEmail(e.target.value)}
                      className="pl-12 py-6 rounded-2xl bg-gray-800/80 border-gray-700 text-white placeholder:text-gray-500 focus:border-purple-500"
                    />
                  </div>

                  {/* Password */}
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Пароль (минимум 6 символов)"
                      value={regPassword}
                      onChange={e => setRegPassword(e.target.value)}
                      className="pl-12 pr-12 py-6 rounded-2xl bg-gray-800/80 border-gray-700 text-white placeholder:text-gray-500 focus:border-purple-500"
                    />
                    <button
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>

                  {/* Confirm Password */}
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Подтвердите пароль"
                      value={regConfirmPassword}
                      onChange={e => setRegConfirmPassword(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleRegister()}
                      className="pl-12 py-6 rounded-2xl bg-gray-800/80 border-gray-700 text-white placeholder:text-gray-500 focus:border-purple-500"
                    />
                  </div>

                  {/* Password strength */}
                  {regPassword.length > 0 && (
                    <div className="flex gap-1">
                      {[1, 2, 3, 4].map(i => (
                        <div
                          key={i}
                          className={`h-1 flex-1 rounded-full transition-colors ${
                            regPassword.length >= i * 3
                              ? i <= 1
                                ? 'bg-red-500'
                                : i <= 2
                                  ? 'bg-yellow-500'
                                  : i <= 3
                                    ? 'bg-blue-500'
                                    : 'bg-green-500'
                              : 'bg-gray-700'
                          }`}
                        />
                      ))}
                    </div>
                  )}

                  {/* Error */}
                  {regError && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-400 text-sm px-1"
                    >
                      {regError}
                    </motion.p>
                  )}

                  {/* Register button */}
                  <Button
                    onClick={handleRegister}
                    disabled={isLoading}
                    className="w-full py-6 rounded-2xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-semibold shadow-lg shadow-pink-500/20 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      />
                    ) : (
                      'Зарегистрироваться'
                    )}
                  </Button>

                  {/* Terms */}
                  <p className="text-center text-gray-500 text-xs px-4">
                    Регистрируясь, вы соглашаетесь с{' '}
                    <span className="text-purple-400">Условиями использования</span> и{' '}
                    <span className="text-purple-400">Политикой конфиденциальности</span>
                  </p>
                </div>

                <div className="text-center mt-6">
                  <span className="text-gray-500 text-sm">Уже есть аккаунт? </span>
                  <button
                    onClick={() => { setMode('login'); setRegError(''); }}
                    className="text-purple-400 text-sm font-semibold hover:text-purple-300"
                  >
                    Войти
                  </button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}

        {mode === 'forgot' && (
          <motion.div
            key="forgot"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="flex-1 flex flex-col p-6 relative z-10"
          >
            <button
              onClick={() => { setMode('login'); setForgotSent(false); }}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 w-fit"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm">Назад</span>
            </button>

            <div className="flex-1 flex flex-col justify-center">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
              >
                {!forgotSent ? (
                  <>
                    <div className="text-center mb-8">
                      <div className="w-16 h-16 rounded-full bg-purple-600/30 flex items-center justify-center mx-auto mb-4">
                        <Lock className="w-8 h-8 text-purple-400" />
                      </div>
                      <h2 className="text-2xl font-bold text-white mb-2">Восстановление пароля</h2>
                      <p className="text-gray-400">Введите email для получения ссылки сброса</p>
                    </div>

                    <div className="space-y-4">
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <Input
                          type="email"
                          placeholder="Email"
                          value={forgotEmail}
                          onChange={e => setForgotEmail(e.target.value)}
                          onKeyDown={e => e.key === 'Enter' && handleForgotPassword()}
                          className="pl-12 py-6 rounded-2xl bg-gray-800/80 border-gray-700 text-white placeholder:text-gray-500 focus:border-purple-500"
                        />
                      </div>

                      <Button
                        onClick={handleForgotPassword}
                        disabled={isLoading || !forgotEmail.includes('@')}
                        className="w-full py-6 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold disabled:opacity-50"
                      >
                        {isLoading ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                          />
                        ) : (
                          'Отправить ссылку'
                        )}
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="text-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring' }}
                      className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6"
                    >
                      <span className="text-4xl">✉️</span>
                    </motion.div>
                    <h2 className="text-2xl font-bold text-white mb-3">Письмо отправлено!</h2>
                    <p className="text-gray-400 mb-6">
                      Проверьте {forgotEmail} для восстановления пароля
                    </p>
                    <Button
                      onClick={() => { setMode('login'); setForgotSent(false); }}
                      className="w-full py-6 rounded-2xl bg-gray-800 hover:bg-gray-700 text-white font-semibold"
                    >
                      Вернуться к входу
                    </Button>
                  </div>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}