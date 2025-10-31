export default function CenteredContainer({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`w-full flex justify-center ${className}`}>
      <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>
    </div>
  );
}
