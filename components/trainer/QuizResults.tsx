import { QuizResult } from "@/types/QuizResult";

type Props = {
  quizResults: QuizResult[];
};

export const ShowQuizResults: React.FC<Props> = ({ quizResults }) => {
  const handleRowClick = (resultId: string | undefined) => {};
  return (
    <>
      <h1 className="text-lg font-semibold m-2">Değerlendirme Sonuçları</h1>
      <div>
        <table className="table-auto w-full border-collapse border border-gray-200">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2">
                Değerlendirme Kodu
              </th>
              <th className="border border-gray-300 px-4 py-2">Ödev Kodu</th>
              <th className="border border-gray-300 px-4 py-2">Öğrenci No</th>
              <th>Detay</th>
            </tr>
          </thead>
          <tbody>
            {quizResults.map((quizResult: QuizResult) => (
              <tr
                key={quizResult.id}
                className="cursor-pointer hover:bg-slate-100"
                onClick={() => handleRowClick(quizResult.id)}
              >
                <td className="border border-gray-300 px-4 py-2">
                  {quizResult.id}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {quizResult.homework_id}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {quizResult.student_id}
                </td>
                <td className="border border-gray-300 px-4 py-2">Detay</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};
