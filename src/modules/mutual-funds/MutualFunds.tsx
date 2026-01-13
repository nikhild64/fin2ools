
import Header from '../../components/common/Header';
import MutualFundList from './components/MutualFundList';

export default function MutualFunds() {
  return (
    <div className="min-h-screen" style={{
      backgroundColor: 'var(--color-bg-primary)',
    }}>
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Page Header */}
        <section className="mb-12">
          <h1
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{ color: 'var(--color-text-primary)' }}
          >
            Mutual{' '}
            <span style={{ color: 'var(--color-secondary-main)' }}>
              Funds
            </span>
          </h1>
          <p className="text-lg" style={{ color: 'var(--color-text-secondary)' }}>
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
