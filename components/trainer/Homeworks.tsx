"use client";

import { Homework } from "@/types/Homework";
import { useRouter } from "next/navigation";

type Props = {
  user: any;
  homeworks: Homework[];
};

const Homeworks: React.FC<Props> = ({ user, homeworks }) => {
  const router = useRouter();

  const handleRowClick = (homeworkId: string | undefined) => {
    if(homeworkId) {
        router.push(`/trainer/homework/${homeworkId}`); // Navigate to the results page
    }

  };
  return (
    <>
      <h1 className="text-lg font-semibold m-2">Ödevler</h1>
      <div>
        <table  className="table-auto w-full border-collapse border border-gray-200">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2">Ödev Adı</th>
              <th className="border border-gray-300 px-4 py-2">Ödev Kodu</th>
              <th className="border border-gray-300 px-4 py-2">Değerlendirme Sonuçları</th>
            </tr>
          </thead>
          <tbody>
            {homeworks.map((homework: Homework) => (
              <tr key={homework.id}
                className="cursor-pointer hover:bg-slate-100"
                onClick={() => handleRowClick(homework.id)}
              >
                <td className="border border-gray-300 px-4 py-2">{homework.name}</td>
                <td className="border border-gray-300 px-4 py-2">{homework.id}</td>
                <td className="border border-gray-300 px-4 py-2">Detay</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Homeworks;
