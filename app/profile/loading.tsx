import { Skeleton } from "@/components/ui/skeleton";

const loading = () => {
  return (
    <div className="w-full flex justify-center gap-3 px-4 border-box">
      <Skeleton className="w-20 bg-hslvar max-sm:mb-6 md:mb-8"></Skeleton>
      <Skeleton className="w-full border-box bg-hslvar max-sm:mb-6 md:mb-8"></Skeleton>
      <Skeleton className="w-full border-box bg-hslvar max-sm:mb-6 md:mb-8"></Skeleton>
      <Skeleton className="w-full border-box bg-hslvar max-sm:mb-6 md:mb-8"></Skeleton>
    </div>
  );
};
export default loading;
