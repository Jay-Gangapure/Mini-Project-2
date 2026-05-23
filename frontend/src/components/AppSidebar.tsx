import {
  Home,
  MessageSquare,
  FileText,
  BookOpen,
  Scale,
  Menu,
  X,
} from "lucide-react";

interface Props {
  open: boolean;
  setOpen: (v: boolean) => void;
}

export default function AppSidebar({
  open,
  setOpen,
}: Props) {
  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed top-4 left-4 z-50 bg-white p-2 rounded-xl shadow-lg md:hidden"
      >
        {open ? <X /> : <Menu />}
      </button>

      <div
        className={`
        fixed md:static z-40 top-0 left-0 h-full
        bg-white border-r w-72
        transition-transform duration-300
        ${
          open
            ? "translate-x-0"
            : "-translate-x-full md:translate-x-0"
        }
      `}
      >
        <div className="p-6">
          <h1 className="text-2xl font-bold text-blue-700">
            NyaySathi
          </h1>
        </div>

        <nav className="px-4 space-y-2">
          {[
            {
              icon: Home,
              label: "Dashboard",
            },
            {
              icon: MessageSquare,
              label: "AI Chat",
            },
            {
              icon: FileText,
              label: "Documents",
            },
            {
              icon: BookOpen,
              label: "Schemes",
            },
            {
              icon: Scale,
              label: "Legal Directory",
            },
          ].map((item, i) => (
            <button
              key={i}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-blue-50 text-slate-700"
            >
              <item.icon size={20} />
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </>
  );
}