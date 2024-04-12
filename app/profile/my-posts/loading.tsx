import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <div>
      <div className="p-5">
        <Skeleton className="h-10 font-bold bg-hslvar w-1/3 mb-7"></Skeleton>
        <div className="flex flex-col gap-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton className="w-full h-32 bg-hslvar" key={index} />
          ))}
        </div>
      </div>
    </div>
  );
};
export default Loading;
