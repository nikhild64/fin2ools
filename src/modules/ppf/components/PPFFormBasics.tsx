interface PPFFormBasicsProps {
  startYear: number | null;
  onStartYearChange: (year: number | null) => void;
  interestRate: number;
  onInterestRateChange: (rate: number) => void;
  currentYear: number;
}

const PPFFormBasics = ({
  startYear,
  onStartYearChange,
  interestRate,
  onInterestRateChange,
  currentYear,
}: PPFFormBasicsProps) => {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Start Year - REQUIRED */}
      <div>
        <label
          className="block font-medium mb-2 text-text-secondary"
        >
          Start Year <span className="text-error">*</span>
        </label>
        <input
          type="number"
          value={startYear || ''}
          onChange={(e) => onStartYearChange(e.target.value ? parseInt(e.target.value) : null)}
          min="1900"
          max={currentYear}
          placeholder="Enter start year"
          className={`w-full rounded-lg px-4 py-2 transition border bg-bg-secondary text-text-primary focus:border-primary-main ${
            startYear ? 'border-border-main' : 'border-error'
          }`}
          onFocus={(e) => {
            e.currentTarget.classList.add('border-primary-main');
          }}
          onBlur={(e) => {
            if (!startYear) {
              e.currentTarget.classList.add('border-error');
            }
          }}
        />
        {!startYear && (
          <p className="text-xs mt-2 text-error">
            Start year is required
          </p>
        )}
      </div>

      {/* Interest Rate */}
      <div>
        <label
          className="block font-medium mb-2 text-text-secondary"
        >
          Interest Rate (% per annum)
        </label>
        <input
          type="number"
          value={interestRate}
          onChange={(e) => onInterestRateChange(parseFloat(e.target.value))}
          min="0"
          step="0.01"
          className="w-full rounded-lg px-4 py-2 transition border bg-bg-secondary border-border-main text-text-primary focus:border-primary-main"
          onFocus={(e) => {
            e.currentTarget.classList.add('border-primary-main');
          }}
          onBlur={(e) => {
            e.currentTarget.classList.remove('border-primary-main');
          }}
        />
      </div>
    </div>
  );
};

export default PPFFormBasics;
