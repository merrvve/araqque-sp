// File: app/api/route.ts

import { NextRequest, NextResponse } from "next/server";

export interface Question {
    id: number;
    question_type: string;
    question: string;
    choices: string[];
    correct_answer: string;
}

// Soru yanıtlarını hızlıca parse etmek için bir yardımcı fonksiyon
function parseQuestions(responseText: string): Question[] {
    const questions: Question[] = [];
    const lines = responseText.split("\n").filter(line => line.trim() !== "");
    
    let id = 1;
    let currentType = "";
    let questionText = "";
    let choices: string[] = [];
    let correctAnswer = "";

    lines.forEach(line => {
        if (line.startsWith("1-3: Doğru/Yanlış")) currentType = "True/False";
        else if (line.startsWith("4-6: Çoktan Seçmeli")) currentType = "Multiple Choice";
        else if (line.startsWith("7-9: Boşluk Doldurma")) currentType = "Fill in the Blank";
        else if (line.startsWith("(") && line.includes("Cevap:")) {
            correctAnswer = line.split("Cevap:")[1].trim().replace(")", "");
            questions.push({
                id: id++,
                question_type: currentType,
                question: questionText.trim(),
                choices,
                correct_answer: correctAnswer,
            });
            questionText = "";
            choices = [];
        } else if (line.match(/^\d+\./)) {
            questionText = line.replace(/^\d+\./, "").trim();
        } else if (line.match(/^[a-d]\)/)) {
            choices.push(line.trim());
        }
    });
    
    return questions;
}

export async function POST(req: NextRequest) {
    try {
        const { prompt } = await req.json();
        
        // ChatGPT API çağrısını burada simüle ediyoruz. prompt burada kullanılacak.
        const simulatedResponseText = `
            1-3: Doğru/Yanlış
            1. [Doğru/Yanlış] "Güneş doğudan doğar." (Cevap: Doğru)
            2. [Doğru/Yanlış] "Su 0°C'de donar." (Cevap: Doğru)
            3. [Doğru/Yanlış] "Ay bir gezegendir." (Cevap: Yanlış)
            4-6: Çoktan Seçmeli
            4. [Çoktan Seçmeli] "Dünyanın en büyük okyanusu hangisidir?"
                a) Hint Okyanusu
                b) Atlas Okyanusu
                c) Büyük Okyanus
                d) Kuzey Buz Denizi
                (Cevap: c)
            5. [Çoktan Seçmeli] "Elektriği kim icat etmiştir?"
                a) Albert Einstein
                b) Thomas Edison
                c) Nikola Tesla
                d) Michael Faraday
                (Cevap: b)
            6. [Çoktan Seçmeli] "Hangi element suyun bir bileşenidir?"
                a) Oksijen
                b) Karbon
                c) Azot
                d) Heliyum
                (Cevap: a)
            7-9: Boşluk Doldurma
            7. [Boşluk Doldurma] "Fotosentez süreci bitkilerde _______ üretir." (Cevap: oksijen)
            8. [Boşluk Doldurma] "İnsan vücudundaki en büyük organ _______dır." (Cevap: deri)
            9. [Boşluk Doldurma] "Dünya'nın uydusu _______dır." (Cevap: Ay)
        `;

        const questions = parseQuestions(simulatedResponseText);
        console.log(questions)
        return NextResponse.json({ result: {questions}});
    } catch (error) {
        return NextResponse.json({ error: "Soru oluşturma veya işleme hatası" }, { status: 500 });
    }
}
