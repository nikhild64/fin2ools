
import Header from '../../components/common/Header';
import MutualFundList from './components/MutualFundList';
import { useStorageInit } from '../../lib/hooks/useStorageInit';

export default function MutualFunds() {
  useStorageInit(); // Initialize storage based on auth mode
  return (
    <div className="min-h-screen bg-bg-primary">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Page Header */}
        <section className="mb-12">
          <h1
            className="text-4xl md:text-5xl font-bold mb-4 text-text-primary"
          >
            Mutual{' '}
            <span className="text-secondary-main">
              Funds
            </span>
          </h1>
          <p className="text-lg text-text-secondary">
            Explore and track mutual fund schemes with latest NAV data.
          </p>
        </section>
        <section>
          <MutualFundList />
        </section>
      </main>
    </div>
  );
}
