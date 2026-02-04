import { useState } from 'react';
import Modal from './Modal';
import { storageService } from '../../lib/storage';
import { useAuth } from '../../context/AuthContext';

interface MigrationPromptProps {
  onComplete: () => void;
}

export default function MigrationPrompt({ onComplete }: MigrationPromptProps) {
  const { user } = useAuth();
  const [showPrompt, setShowPrompt] = useState(true);
  const [migrating, setMigrating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleMigrate = async () => {
    if (!user?.uid) return;

    setMigrating(true);
    setError(null);

    try {
      await storageService.migrateToRealtimeDB(user.uid);
      
      // Clear local data after successful migration
      localStorage.removeItem('fin2ools_my_funds');
      localStorage.removeItem('fin2ools_mf_watchlist');
      
      // Mark migration as completed
      localStorage.setItem('fin2ools_data_migrated', 'true');
      
      setShowPrompt(false);
      onComplete();
    } catch (err: any) {
      console.error('Migration error:', err);
      setError(err.message || 'Failed to migrate data. Please try again.');
    } finally {
      setMigrating(false);
    }
  };

  const handleSkip = () => {
    // Mark as skipped so we don't show again
    localStorage.setItem('fin2ools_data_migrated', 'skipped');
    setShowPrompt(false);
    onComplete();
  };

  if (!showPrompt) return null;

  return (
    <Modal onClose={handleSkip}>
      <div className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-primary-main/10 flex items-center justify-center">
            <svg className="w-6 h-6 text-primary-main" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-text-primary">Migrate Your Data</h2>
            <p className="text-sm text-text-secondary">Sync your local data to the cloud</p>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <p className="text-text-primary">
            We detected existing data on this device. Would you like to migrate it to your cloud account?
          </p>

          <div className="bg-bg-secondary rounded-lg p-4 space-y-2">
            <div className="flex items-start gap-2">
              <svg className="w-5 h-5 text-success-main mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="text-sm font-medium text-text-primary">Access from any device</p>
                <p className="text-xs text-text-secondary">Your data will be synced across all devices</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <svg className="w-5 h-5 text-success-main mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="text-sm font-medium text-text-primary">Automatic backup</p>
                <p className="text-xs text-text-secondary">Never lose your data again</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <svg className="w-5 h-5 text-success-main mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="text-sm font-medium text-text-primary">Safe migration</p>
                <p className="text-xs text-text-secondary">Data is copied to cloud, then removed locally</p>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-error-light/10 border border-error-main rounded-lg p-3">
              <p className="text-sm text-error-main">{error}</p>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleSkip}
            disabled={migrating}
            className="flex-1 px-4 py-2 rounded-lg border border-border-main text-text-primary hover:bg-bg-secondary transition disabled:opacity-50"
          >
            Skip for Now
          </button>
          <button
            onClick={handleMigrate}
            disabled={migrating}
            className="flex-1 px-4 py-2 rounded-lg bg-primary-main text-text-inverse hover:bg-primary-dark transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {migrating ? (
              <>
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Migrating...
              </>
            ) : (
              'Migrate Data'
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
}
