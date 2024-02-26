import {
  BarChart3,
  Book,
  MessageCircleQuestion,
  PanelRightOpen,
  PlusSquare,
  Settings,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import '@mdxeditor/editor/style.css'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="drawer lg:drawer-open">
        <input id="drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col">
          <label htmlFor="drawer" className="drawer-button lg:hidden 
            max-sm:absolute top-[-2.8rem] left-1
            " >
            <PanelRightOpen size={"1.7rem"} />
          </label>
          {children}
        </div>
        <div className="drawer-side md:ml-2 z-30">
          <label
            htmlFor="drawer"
            aria-label="close sidebar"
            className="drawer-overlay"
          >
          </label>
          <ul className="rounded-md menu p-4 w-56 min-h-full bg-hslvar shadow-md max-md:pt-20">
            {/* Sidebar content here */}
            <li>
              <Link
                href={"/profile/create"}
                className="flex flex-col justify-center items-center border-1"
              >
                <PlusSquare />
                <p>Post / Ask</p>
              </Link>
            </li>
            <div className="divider my-2"></div>
            <li>
              <Link href={"/profile/"}>
                <UserRound /> My profile
              </Link>
            </li>
            <li>
              <Link href={"#"}>
                <MessageCircleQuestion /> My questions
              </Link>
            </li>
            <li>
              <Link href={"#"}>
                <Book /> My posts
              </Link>
            </li>
            <li>
              <Link href={"#"}>
                <BarChart3 /> Progressions
              </Link>
            </li>
            <li>
              <Link href={"#"}>
                <Settings /> Account Settings
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
