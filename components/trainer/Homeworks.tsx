"use client";

import { Homework } from "@/types/Homework";

type Props = {
    user: any;
    homeworks: Homework[];
  };

const Homeworks: React.FC<Props> = ({ user, homeworks }) => {

    
    return (
        <>
        <h1 className="text-lg font-semibold m-2" >Ödevler</h1>
        <div>
            <table>
                <thead>
                    <th>Ödev Adı</th>
                    <th>Ödev Kodu</th>
                    <th>Değerlendirme Sonuçları</th>
                </thead>
                <tbody>
                    {
                        homeworks.map((homework:Homework)=> 
                            <tr>
                                 <td>{homework.name}</td>
                                 <td>{homework.id}</td>
                                 <td></td>

                            </tr>
                           
                           
                        )
                    }
                </tbody>
            </table>
        </div>
        </>
    )
 }

 export default Homeworks;
