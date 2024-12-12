// api/createHomework.ts

import { createClient } from "@/utils/supabase/server";

import { NextResponse } from "next/server";





export const POST = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).end(); // Method Not Allowed
  }

  const { trainer_id, trainer_name, name } = await req.json();
  console.log(trainer_id, trainer_name, name)
  const supabase = await createClient();
  try {
    const { data, error } = await supabase
      .from('homework')
      .insert([{ trainer_id, trainer_name, name }])
      .select()
      .single()

    if (error) {
      console.error('Error creating homework1:', error);
      return NextResponse.json({ error: "Failed to create homework." }, { status: 500 });
     
    }

    let query = supabase.from('homework').select('*');
    const { data2, error2 } = await query;
    console.log(data2,error2,"22")
    console.log("data",data,"error",error)
    return NextResponse.json({ id: data.id }, { status: 201 });
  } catch (error) {
    console.error('Error creating homework2:', error);
    return NextResponse.json({ message: 'Failed to create homework'  }, { status: 500 });
 }
}

