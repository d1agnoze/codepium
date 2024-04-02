import { Home, MessageCircleQuestion, Newspaper } from "lucide-react";
import Link from "next/link";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="drawer lg:drawer-open">
        <input id="drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col items-center">
          {children}
        </div>
        <div className="drawer-side">
          <label
            htmlFor="drawer"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <ul className="menu p-4 w-56 min-h-full bg-hslvar text-base-content">
            {/* Sidebar content here */}
            <li>
              <Link className="text-primary text-md flex gap-2" href={"/"}>
                <Home size={20} />
                <span>Home</span>
              </Link>
            </li>
            <li>
              <Link
                className="text-primary text-md flex gap-2"
                href={"/question/"}
              >
                <MessageCircleQuestion size={20} />
                <span>Questions</span>
              </Link>
            </li>
            <li>
              <Link className="text-primary text-md flex gap-2" href={"/post/"}>
                <Newspaper size={20} />
                <span>Articles</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
