import { NextResponse } from "next/server";
import {   extractText } from "./fileParser";
  



export const POST = async (req:any, res: any) => {
  const formData = await req.formData();

  const file = formData.get("file");
  if (!file) {
    return NextResponse.json({ error: "No files received." }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const filename =  file.name.replaceAll(" ", "_");
  let extractedText : string = "";
  try {
    
    const extension = filename.split('.').pop()
    
    if(extension==='txt') {
        extractedText = buffer.toString();
    }
    else {
        extractedText = await extractText(buffer);
    }
    const wordCount = extractedText.split(" ").length;
    
    return NextResponse.json({ Message: "Success", Result: {extractedText, wordCount} ,status: 201 });

  } catch (error) {
    console.log("Error occured ", error);
    return NextResponse.json({ Message: "Failed", status: 500 });
  }
};