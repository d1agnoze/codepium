import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <div className="w-full mt-5 flex justify-center">
      <Skeleton className="h-20"/>
    </div>
  );
};
export default Loading;
