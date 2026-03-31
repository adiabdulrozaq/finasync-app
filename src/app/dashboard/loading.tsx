import { PageSkeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="w-full h-full p-4 animate-in fade-in duration-300">
      <PageSkeleton />
    </div>
  );
}
