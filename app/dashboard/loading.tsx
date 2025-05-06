import Loader from "@/components/ui/loader";

export default function Loading() {
  return (
    <div className="flex items-center justify-center h-full min-h-screen">
      <Loader size={48} />
    </div>
  );
} 