import { Skeleton } from "@/components/ui/skeleton";

const loading = () => {
  return (
    <div className="w-full flex justify-center gap-3 mx-4">
      <Skeleton className="w-full bg-hslvar md:h-[24vh] max-sm:h-[20dvh] max-sm:mb-6 md:mb-8"></Skeleton>
    </div>
  );
};
export default loading;
