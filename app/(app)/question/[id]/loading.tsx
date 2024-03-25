import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <div className="w-full px-3 lg:px-32 mt-3 flex flex-col gap-5">
      <Skeleton className="w-full bg-hslvar px-4 py-5 rounded-lg h-[300px]">
      </Skeleton>
      <Skeleton className="w-[150px] bg-hslvar px-4 py-5 rounded-lg h-[50px]">
      </Skeleton>
      <Skeleton className="w-full bg-hslvar px-4 py-5 rounded-lg h-[100px]">
      </Skeleton>
      <Skeleton className="w-full bg-hslvar px-4 py-5 rounded-lg h-[100px]">
      </Skeleton>
    </div>
  );
};
export default Loading;
