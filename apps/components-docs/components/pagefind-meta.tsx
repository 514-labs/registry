export function PagefindMeta({ type }: { type: string }) {
  return (
    <span
      data-pagefind-filter={`type:${type}`}
      className="hidden"
      aria-hidden="true"
    />
  );
}
