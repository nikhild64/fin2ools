interface ThemedInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const ThemedInput = ({
  label,
  error,
  className = '',
  ...props
}: ThemedInputProps) => {

  return (
    <div className="w-full">
      {label && (
        <label
          className="block font-medium mb-2 text-sm text-text-secondary"
        >
          {label}
        </label>
      )}
      <input
        {...props}
        className={`w-full rounded-lg px-4 py-2 transition border bg-bg-secondary border-border-main text-text-primary focus:border-primary-main ${className}`}
        onFocus={(e) => {
          e.currentTarget.classList.add('border-primary-main');
        }}
        onBlur={(e) => {
          e.currentTarget.classList.remove('border-primary-main');
        }}
      />
      {error && (
        <p className="text-sm mt-1 text-error">
          {error}
        </p>
      )}
    </div>
  );
};

export default ThemedInput;
