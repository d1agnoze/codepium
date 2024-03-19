export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="drawer lg:drawer-open drawer-end">
        <input id="drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col items-center">
          {children}
        </div>
        <div className="drawer-side">
          <label
            htmlFor="drawer"
            aria-label="close sidebar"
            className="drawer-overlay"
          >
          </label>
          <ul className="menu p-4 w-56 min-h-full bg-hslvar text-base-content">
            {/* Sidebar content here */}
            <li>
              <h2 className="text-primary text-md">❓ Lastest Questions</h2>
            </li>
            <li>
              <h2 className="text-primary text-md">📝 Lastest Posts</h2>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
