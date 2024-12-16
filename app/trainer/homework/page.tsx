import Homeworks from "@/components/trainer/Homeworks";
import { SideBar } from "@/components/trainer/TrainerSidebar";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function HomeworksPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Fetch homeworks server-side
  const { data: homeworks, error } = await supabase
    .from("homework")
    .select("*")
    .eq("trainer_id", user.id);

  if (error) {
    console.error("Error fetching homeworks:", error);
    return <div>Error loading homeworks.</div>;
  }
console.log(homeworks,error)
  return (
    <div className="w-full flex flex-row gap-20">
      <SideBar />

      <div className="flex-1 w-full flex flex-col gap-12">
        <Homeworks user={user} homeworks={homeworks} />
      </div>
    </div>
  );
}
