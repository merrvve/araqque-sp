import { SideBar } from "@/components/trainer/TrainerSidebar";

export default function TrainerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="w-full flex flex-col sm:flex-row gap-20">
        <SideBar />

        <div className="flex-1 w-full flex flex-col gap-12">{children}</div>
      </div>
    </>
  );
}
