import { Book, ClipboardList, UserCircle, LogOut } from "lucide-react";


export const SideBar = () => {
    return (
        <div className="hidden md:flex flex-col w-64 border border-slate-100 rounded-lg shadow-lg overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-center h-16">
                <span className="text-xl font-bold uppercase">Menu</span>
            </div>

            {/* Navigation */}
            <div className="flex flex-col flex-1 overflow-y-auto">
                <nav className="flex-1 px-4 py-4 space-y-2">
                    {/* Homeworks */}
                    <a
                        href="/trainer/homework"
                        className="flex items-center px-4 py-3 rounded-lg hover:bg-gray-100 transition"
                    >
                        <Book size={24}  />
                        <span className="mx-3">Ödevler</span>
                    </a>

                    {/* Exam Results */}
                    <a
                        href="#"
                        className="flex items-center px-4 py-3 rounded-lg hover:bg-gray-100 transition"
                    >
                        <ClipboardList size={24}  />
                        <span className="mx-3">Değerlendirme Sonuçları</span>
                    </a>

                    {/* User Profile */}
                    <a
                        href="#"
                        className="flex items-center px-4 py-3 rounded-lg hover:bg-gray-100 transition"
                    >
                        <UserCircle size={24}  />
                        <span className="mx-3">Kullanıcı Profilim</span>
                    </a>

                    {/* Sign Out */}
                    <a
                        href="#"
                        className="flex items-center px-4 py-3 rounded-lg hover:bg-red-300 transition"
                    >
                        <LogOut size={24}  />
                        <span className="mx-3">Çıkış Yap</span>
                    </a>
                </nav>
            </div>
        </div>
    );
};
