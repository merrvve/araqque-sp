import OpenAI from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req:any) {
  const { text } = await req.json();
  
  // Define a clear and structured prompt for generating questions in Turkish
  const systemPrompt = `
    Aşağıdaki ödev metnine dayanarak, ödevin hazırlandığı dilde toplam 9 soru oluştur. Aşağıdaki formatı kullanarak her soru için doğru cevabı da ekle:
    
    - *Doğru-Yanlış Soruları*: 3 adet
      - Soru [i]: [Soru metni]
      - Cevap [i]: [Doğru veya Yanlış]

    - *Boşluk Doldurma Soruları*: 3 adet
      - Soru [i]: [Metin içerisinde eksik bırakılan kısım (tek kelimelik)]
      - Cevap [i]: [Eksik kısma gelecek doğru kelime]

    - *Çoktan Seçmeli Test Soruları*: 3 adet
      - Soru [i]: [Soru metni]
      - A) [Seçenek A]
      - B) [Seçenek B]
      - C) [Seçenek C]
      - D) [Seçenek D]
      - Cevap [i]: [Doğru Seçenek (A, B, C veya D şeklinde yalnızca tek harf)]

    
    
    **Geri Dönen JSON Formatı**:
    "questions":
    [
      {
        "id" : 0,
        "question_type": "Doğru Yanlış Sorusu",
        "question": "Soru metni",
        "choices": ["Doğru", "Yanlış"],
        "correct_answer": "Doğru",
      },
      {
        "id" : 1,
        "question_type": "Boşluk Doldurma Sorusu",
        "question": "Kelime eksikliğini içeren soru metni",
        "choices": ["Doğru kelime"],
        "correct_answer": "Doğru kelime",
      },
      {
        "id" : 2,
        "question_type": "Çoktan Seçmeli Test Sorusu",
        "question": "Soru metni",
        "choices": ["A) Seçenek", "B) Seçenek", "C) Seçenek", "D) seçenek"],
        "correct_answer": "A",

      }
    ]
  `;

  const sysprompt2 = `Verilen ödev metnine dayanarak toplam 9 soru oluştur. Soruların dili ödev metniyle aynı olmalı ve aşağıdaki yapıya göre hazırlanmalı:

1. *Doğru/Yanlış Soruları*: 3 soru
   - Format: "S[i]: [Soru metni]" | "C[i]: [Doğru veya Yanlış]"

2. *Boşluk Doldurma Soruları*: 3 soru
   - Format: "S[i]: [Bir kelime eksik bırakılmış soru metni]" | "C[i]: [Doğru kelime]"

3. *Çoktan Seçmeli Sorular*: 3 soru
   - Format: "S[i]: [Soru metni]" | Şıklar: A) [Seçenek A] B) [Seçenek B] C) [Seçenek C] D) [Seçenek D] | "C[i]: [Doğru seçenek]"

**Geri Dönen JSON Formatı**:
"questions": [
      {
        "id" : 0,
        "question_type": "Doğru Yanlış Sorusu",
        "question": "Soru metni",
        "choices": ["Doğru", "Yanlış"],
        "correct_answer": "Doğru",
      },
      {
        "id" : 1,
        "question_type": "Boşluk Doldurma Sorusu",
        "question": "Kelime eksikliğini içeren soru metni",
        "choices": ["Doğru kelime"],
        "correct_answer": "Doğru kelime",
      },
      {
        "id" : 2,
        "question_type": "Çoktan Seçmeli Test Sorusu",
        "question": "Soru metni",
        "choices": ["A) Seçenek", "B) Seçenek", "C) Seçenek", "D) seçenek"],
        "correct_answer": "A",

      }
    ]

`

  const userPrompt = `
  **Ödev Metni**:
    "${text}"`

  // Check if text exists
  if (text) {
  //   const response = await openai.chat.completions.create({
  //     model: "gpt-3.5-turbo",
  //     messages: [{"role": "user", "content": [{type:'text', text:prompt}]}]  ,
  //     response_format:{ "type": "json_object" }
  //   });
   
  //   const completion = await openai.completions.create({
  //     model: "gpt-3.5-turbo-instruct",
  //     prompt: prompt,
  //     max_tokens: 20,
  //     temperature: 0,
  //   });
  //  console.log(response)

   
  //     return NextResponse.json({result: response.choices[0].message.content});
    const sampleResponse = `
    {
      "questions": [
        {
          "id": 0,
          "question_type": "Doğru Yanlış Sorusu",
          "question": "Türkiye Cumhuriyeti'nin kuruluşu 29 Ekim 1923'te gerçekleşmiştir.",
          "choices": ["Doğru", "Yanlış"],
          "correct_answer": "Doğru"
        },
        {
          "id": 1,
          "question_type": "Doğru Yanlış Sorusu",
          "question": "Osmanlı İmparatorluğu'nun çöküş süreci I. Dünya Savaşı sonrasında yavaşlamıştır.",
          "choices": ["Doğru", "Yanlış"],
          "correct_answer": "Yanlış"
        },
        {
          "id": 2,
          "question_type": "Doğru Yanlış Sorusu",
          "question": "Amasya Genelgesi, Türk Kurtuluş Savaşı sırasında bağımsızlık ruhunun örgütlendiği toplantılardan biridir.",
          "choices": ["Doğru", "Yanlış"],
          "correct_answer": "Doğru"
        },
        {
          "id": 3,
          "question_type": "Boşluk Doldurma Sorusu",
          "question": "Mustafa Kemal Atatürk, 19 Mayıs 1919'da __________ çıkarak ulusal direnişi başlatmıştır.",
          "choices": ["Samsun"],
          "correct_answer": "Samsun"
        },
        {
          "id": 4,
          "question_type": "Boşluk Doldurma Sorusu",
          "question": "1 Kasım 1922'de __________ kaldırılmış ve böylece Osmanlı Devleti'nin resmî olarak sonu gelmiştir.",
          "choices": ["Saltanat"],
          "correct_answer": "Saltanat"
        },
        {
          "id": 5,
          "question_type": "Boşluk Doldurma Sorusu",
          "question": "Lozan Barış Antlaşması, __________ 1923'te imzalanarak Türkiye'nin bağımsızlığı uluslararası alanda tanındı.",
          "choices": ["24 Temmuz"],
          "correct_answer": "24 Temmuz"
        },
        {
          "id": 6,
          "question_type": "Çoktan Seçmeli Test Sorusu",
          "question": "Türkiye Büyük Millet Meclisi (TBMM) hangi tarihte açılmıştır?",
          "choices": ["A) 29 Ekim 1923", "B) 23 Nisan 1920", "C) 19 Mayıs 1919", "D) 1 Kasım 1922"],
          "correct_answer": "B"
        },
        {
          "id": 7,
          "question_type": "Çoktan Seçmeli Test Sorusu",
          "question": "Aşağıdakilerden hangisi Türkiye Cumhuriyeti'nin ilk cumhurbaşkanıdır?",
          "choices": ["A) İsmet İnönü", "B) Abdülmecid Efendi", "C) Mustafa Kemal Atatürk", "D) Kazım Karabekir"],
          "correct_answer": "C"
        },
        {
          "id": 8,
          "question_type": "Çoktan Seçmeli Test Sorusu",
          "question": "Cumhuriyetin ilanından sonra Türkiye’nin benimsemediği yönetim biçimi hangisidir?",
          "choices": ["A) Cumhuriyet", "B) Oligarşi", "C) Monarşi", "D) Demokrasi"],
          "correct_answer": "C"
        }
      ]
    }
    `;

    //return NextResponse.json({result: sampleResponse});
      try {
        const response = await openai.chat.completions.create({
          model: "gpt-4o-mini", 
          messages: [
            {
              role: "system",
              content: sysprompt2,
            },
            {
              role: "user",
              content: userPrompt,
            },
          ],
          
          response_format: { "type": "json_object" },
          
        });
    
    
        return NextResponse.json({result: response.choices[0].message.content});
      } catch (error) {
        return NextResponse.json({ Message: error, status: 500 });
      }
  } else {
    return NextResponse.json({ Message: 'No Text Input', status: 500 });
  }

  
}



