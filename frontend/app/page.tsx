import Link from 'next/link';
import Logo from '../components/Logo';
import BackgroundAnimation from '../components/BackgroundAnimation';
import MockChart from '../components/MockChart';
import { ShieldCheck, Activity, Users } from 'lucide-react';

export default function Landing() {
  return (
    <main className="relative min-h-screen bg-white dark:bg-gray-900">
      <BackgroundAnimation />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16 lg:py-28">
        <header className="flex items-center justify-between mb-8">
          <Logo />
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/features" className="text-sm text-gray-600 dark:text-gray-300 hover:text-primary-600">Fonctionnalités</Link>
            <Link href="/about" className="text-sm text-gray-600 dark:text-gray-300 hover:text-primary-600">À propos</Link>
            <Link href="/login" className="px-4 py-2 rounded-md bg-primary-600 text-white text-sm">Connexion</Link>
          </nav>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <section className="lg:col-span-6">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight text-gray-900 dark:text-white">MentalSense — Comprendre et améliorer votre bien-être</h1>
            <p className="mt-6 text-lg text-gray-600 dark:text-gray-300 max-w-2xl">Suivi discret, analyses basées sur l’IA et recommandations pratiques pour vous accompagner au quotidien.</p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/register" className="inline-flex items-center justify-center px-6 py-3 bg-primary-600 text-white rounded-lg shadow hover:opacity-95">Commencer gratuitement</Link>
              <Link href="/about" className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-200">En savoir plus</Link>
            </div>

            <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white/90 dark:bg-gray-800 rounded-lg shadow">
                  <ShieldCheck className="text-primary-600" />
                </div>
                <div>
                  <h4 className="font-semibold">Confidentialité</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Vos données restent privées et sécurisées.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-white/90 dark:bg-gray-800 rounded-lg shadow">
                  <Activity className="text-primary-600" />
                </div>
                <div>
                  <h4 className="font-semibold">Insights</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Rapports clairs et exploitables pour suivre vos progrès.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-white/90 dark:bg-gray-800 rounded-lg shadow">
                  <Users className="text-primary-600" />
                </div>
                <div>
                  <h4 className="font-semibold">Accompagnement</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Recommandations pratiques et ressources utiles.</p>
                </div>
              </div>
            </div>
          </section>

          <aside className="lg:col-span-6">
            <div className="mx-auto w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl border border-gray-100 dark:border-gray-800 bg-white/80 dark:bg-gray-800/60">
              <div className="p-6 sm:p-8">
                <h3 className="font-semibold mb-4">Tableau de bord — Aperçu rapide</h3>
                <div className="h-64 rounded-md bg-gradient-to-b from-gray-100 to-white dark:from-gray-800 dark:to-gray-700 overflow-hidden">
                  <MockChart />
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="p-4 bg-white rounded-lg dark:bg-gray-900/60 border border-gray-100 dark:border-gray-700">
                    <p className="text-sm text-gray-500">Score émotionnel</p>
                    <p className="mt-2 font-semibold text-xl">72%</p>
                  </div>
                  <div className="p-4 bg-white rounded-lg dark:bg-gray-900/60 border border-gray-100 dark:border-gray-700">
                    <p className="text-sm text-gray-500">Tendance hebdo</p>
                    <p className="mt-2 font-semibold text-xl">Stable</p>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>

        <div className="mt-12 border-t border-gray-100 dark:border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">© {new Date().getFullYear()} MentalSense</p>
          <div className="flex items-center gap-4">
            <Link href="/terms" className="text-sm text-gray-500 hover:text-primary-600">Conditions</Link>
            <Link href="/privacy" className="text-sm text-gray-500 hover:text-primary-600">Confidentialité</Link>
          </div>
        </div>
      </div>
    </main>
  );
}