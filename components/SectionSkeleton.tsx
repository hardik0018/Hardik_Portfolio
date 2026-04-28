export default function SectionSkeleton({
  className = "min-h-[60vh]",
}: {
  className?: string;
}) {
  return <div className={className} aria-hidden="true" />;
}
