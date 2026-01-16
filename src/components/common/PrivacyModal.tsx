import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

const PRIVACY_ACCEPTANCE_KEY = 'fin2ools_privacy_accepted';

interface PrivacyModalProps {
  onAccept: () => void;
  onDecline: () => void;
}

function PrivacyModalContent({ onAccept, onDecline }: PrivacyModalProps) {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-99 p-4">
      <div className="bg-bg-secondary border border-border-main rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-bg-secondary border-b border-border-main p-6">
          <h2 className="text-2xl font-bold text-text-primary">Privacy & Disclaimer</h2>
          <p className="text-text-secondary text-sm mt-1">Please read carefully before using fin2ools</p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Hobby Project */}
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <p className="text-blue-100 font-semibold mb-2">📚 Hobby Project</p>
            <p className="text-text-secondary text-sm leading-relaxed">
              fin2ools is a <strong>hobby project</strong> created for personal purposes only. However , it is made available to the public. As they say sharing is caring.
            </p>
          </div>

          {/* Data Storage */}
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
            <p className="text-green-100 font-semibold mb-2">✓ Local Storage Only</p>
            <ul className="text-text-secondary text-sm space-y-2">
              <li className="flex items-start">
                <span className="text-green-500 mr-2 mt-0.5">✓</span>
                <span>All data used or entered is stored in your browser only. It never leaves the users browser.</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2 mt-0.5">✓</span>
                <span>No data is sent to any server or external service at all</span>
              </li>
            </ul>
          </div>

          {/* Important Disclaimer */}
          <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
            <p className="text-orange-100 font-semibold mb-2">⚠️ Important Disclaimer</p>
            <p className="text-text-secondary text-sm leading-relaxed mb-3">
              The developer is <strong>not responsible</strong> for:
            </p>
            <ul className="text-text-secondary text-sm space-y-1.5">
              <li className="flex items-start">
                <span className="text-orange-500 mr-2 mt-0.5">•</span>
                <span>Financial losses or calculation inaccuracies</span>
              </li>
              <li className="flex items-start">
                <span className="text-orange-500 mr-2 mt-0.5">•</span>
                <span>Accuracy of mutual fund data or NAV values</span>
              </li>
              <li className="flex items-start">
                <span className="text-orange-500 mr-2 mt-0.5">•</span>
                <span>Unauthorized access or data loss</span>
              </li>
              <li className="flex items-start">
                <span className="text-orange-500 mr-2 mt-0.5">•</span>
                <span>Any damages arising from use of this application</span>
              </li>
            </ul>
          </div>

          {/* Info */}
          <div className="text-text-secondary text-sm leading-relaxed">
            <p className="mb-3">
              This is a hobby project. Always verify calculations independently and consult with professional financial advisors before making investment decisions.
            </p>
            <p>
              By clicking "Accept", you agree to these terms and acknowledge that you use this application at your own risk.
            </p>
          </div>

          {/* MFapi.in Attribution */}
          <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
            <p className="text-purple-100 font-semibold mb-2">📊 Data Source</p>
            <p className="text-text-secondary text-sm leading-relaxed">
              Mutual Fund NAV data is sourced from <a href="https://www.mfapi.in" target="_blank" rel="noopener noreferrer" className="text-primary-main hover:text-primary-dark underline">MFapi.in</a>. 
              This is a public API provided for accessing Indian mutual fund data.
            </p>
          </div>

          {/* Credits */}
          <div className="bg-teal-500/10 border border-teal-500/30 rounded-lg p-4">
            <p className="text-teal-100 font-semibold mb-2">🙏 Credits</p>
            <p className="text-text-secondary text-sm leading-relaxed">
              fin2ools is built with React, Tailwind CSS, and Chart.js. Special thanks to the open-source community for the libraries and tools that make this project possible.
            </p>
          </div>

          {/* Full Notice Link */}
          <button
            onClick={() => navigate('/privacy')}
            className="text-primary-main hover:text-primary-dark text-sm font-medium transition"
          >
            Read full Privacy Notice →
          </button>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-bg-secondary border-t border-border-main p-6 flex gap-3 justify-end">
          <button
            onClick={onDecline}
            className="px-6 py-2.5 rounded-lg font-medium transition border border-border-main text-text-secondary hover:bg-bg-primary"
          >
            Decline
          </button>
          <button
            onClick={onAccept}
            className="px-6 py-2.5 rounded-lg font-medium transition bg-primary-main text-text-inverse hover:bg-primary-dark"
          >
            Accept & Continue
          </button>
        </div>
      </div>
    </div>
  );
}

export function PrivacyModal() {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user has already accepted privacy notice
    const hasAccepted = localStorage.getItem(PRIVACY_ACCEPTANCE_KEY);
    if (!hasAccepted) {
      setShowModal(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(PRIVACY_ACCEPTANCE_KEY, 'true');
    setShowModal(false);
  };

  const handleDecline = () => {
    // If declined, show a message and redirect to home
    navigate('/');
    setShowModal(false);
  };

  if (!showModal) return null;

  return <PrivacyModalContent onAccept={handleAccept} onDecline={handleDecline} />;
}

export function resetPrivacyAcceptance() {
  localStorage.removeItem(PRIVACY_ACCEPTANCE_KEY);
}
