

import { createClient } from "@/utils/supabase/server";

import { NextResponse } from "next/server";





export const GET = async (req, res) => {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId'); // Replace with actual logic to extract user ID from request

    if (!userId) {
      return NextResponse.json({ error: "User ID is required." }, { status: 400 });
    }
  
  const supabase = await createClient();
  try {
    const { data, error } = await supabase
      .from('homework')
      .select('*')
      .eq('trainer_id', userId);

    if (error) {
      console.error('Error getting homeworkS:', error);
      return NextResponse.json({ error: "Failed to get homeworks." }, { status: 500 });
     
    }

    
    console.log("data",data,"error",error)
    return NextResponse.json({ data:data }, { status: 201 });
  } catch (error) {
    console.error('Error getting homeworks:', error);
    return NextResponse.json({ message: 'Failed to get homeworks'  }, { status: 500 });
 }
}

