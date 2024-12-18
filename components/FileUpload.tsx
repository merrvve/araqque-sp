"use client";

import { useState } from "react";
import { LoadingModal } from "./LoadingModal";
import { LoadingState } from "@/types/loadingState";
import useQuestionStore from '../stores/questionStore';
import { Question } from '../types/question';
import { Input } from "./ui/input";
import { Label } from "./ui/label";


export const FileUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loadingState, setLoadingState] = useState<LoadingState>({
    fileUploaded: false,
    questionsPrepared: false,
    questionCount: 0,
    time: 0,
    fileError: false,
    questionsError: false,
    statusText: "Dosya Yükleniyor"
  })
  const [openModal, setOpenModal] = useState(false);
  const handleFileChange = (e: any) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };
  const { questions, addQuestion, clearQuestions, setHomeworkId } = useQuestionStore();
  
  let homeworkText = "";
  
  function selectQuestions(questionList1 : Question[],questionList2: Question[]) {
    let selectedQuestions: Question[] = [];
    selectedQuestions = selectedQuestions
      .concat(questionList1.filter(x=>x.question_type==="Doğru Yanlış Sorusu").slice(0,2))
      .concat(questionList2.filter(x=>x.question_type==="Doğru Yanlış Sorusu")[1])
      .concat(questionList1.filter(x=>x.question_type==="Boşluk Doldurma Sorusu")[1])
      .concat(questionList2.filter(x=>x.question_type==="Boşluk Doldurma Sorusu").slice(0,2))
      .concat(questionList1.filter(x=>x.question_type==="Çoktan Seçmeli Test Sorusu").slice(1,3))
      .concat(questionList2.filter(x=>x.question_type==="Çoktan Seçmeli Test Sorusu")[0])
      
    ;

    console.log(selectedQuestions)
    return selectedQuestions;
  }

  const handleSubmit = async (e: any) => {
    
    e.preventDefault();

    if (!file) {
      alert("Lütfen bir dosya yükleyiniz");
      return;
    }
    if (file.size > 5242880) {
      alert("Yüklenecek dosya 5 MB'tan daha büyük olamaz");
      return;
    }

    setOpenModal(true);
    const formDataToSend = new FormData();

    formDataToSend.append("file", file); // Append the file

    setLoadingState({
      fileUploaded: false,
      questionsPrepared: false,
      questionCount: 0,
      time: 0,
      fileError: false,
      questionsError: false,
      statusText: "Dosya Yükleniyor"
    })
    try {
      
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formDataToSend,
      });

      if (!response.ok) {
        setLoadingState((prev) => ({ ...prev, fileError: true }));
        setLoadingState((prev) => ({ ...prev, statusText: "Dosya Yüklenemedi. " }));
        
        console.log(response)
        throw new Error("Dosya gönderilemedi. "+ response.statusText);
      }
      else {
        setLoadingState((prev) => ({ ...prev, fileUploaded: true }));
        const homeworkResult = await response.json();
        homeworkText = homeworkResult.Result.extractedText;
        const wordCount = homeworkResult.Result.wordCount;
        setLoadingState((prev) => ({ ...prev, statusText: `Yüklenen dosyada yaklaşık ${wordCount} adet kelime tespit edildi.` }));
        if(wordCount>40000) {
                
          setLoadingState((prev) => ({ ...prev, fileError: true, statusText: "Yüklenen dosya 40.000'den fazla kelime içermektedir." }));
          return;
        }
        if(wordCount<20001) {
          try { 
            const openaiResponse = await fetch("/api/openai", {
              method: "POST",
              body: JSON.stringify({ text: homeworkText }),
            });
            if (!openaiResponse.ok) {
              setLoadingState({ ...loadingState, questionsError: true, statusText:"Sorular oluşturulurken bir hata ile karşılaşıldı." });
              console.log(openaiResponse);
              throw new Error("Openai hata");
            }
            const qas = await openaiResponse.json();
            try {const questionsList = JSON.parse(qas.result).questions;
              setLoadingState((prev) => ({
                ...prev,
                questionsError: false,
                questionsPrepared: true,
                questionCount: questionsList.length,
                time: 15,
                statusText: "Test oluşturma işlemi başarılı."
              }));
              clearQuestions();
              questionsList.forEach((question: Question) => {
                addQuestion(question)
              });
              
              console.log(questions);
            }
            catch(error) {
              setLoadingState({ ...loadingState, questionsError: true, statusText:"Sorular oluşturulurken bir hata ile karşılaşıldı." });
            console.error("Error openai:", error);
            }
            
            
          } catch (error) {
            setLoadingState({ ...loadingState, questionsError: true, statusText:"Sorular oluşturulurken bir hata ile karşılaşıldı." });
            console.error("Error openai:", error);
          }
        }
        else if(20000<wordCount && wordCount<40000) {
          setLoadingState((prev) => ({ ...prev, statusText: `Yüklenen dosyada yaklaşık ${wordCount} adet kelime tespit edildi. Test oluşturma işlemi iki adımda gerçekleştirilecektir. Bu işlem birkaç dakikanızı alabilir. ` }));
          try{
            const openaiResponse1 = await fetch("/api/openai", {
              method: "POST",
              body: JSON.stringify({ text: homeworkText.slice(0,wordCount/2) }),
            });
            const openaiResponse2 = await fetch("/api/openai", {
              method: "POST",
              body: JSON.stringify({ text: homeworkText.slice(wordCount/2) }),
            });
            const qas1 = await openaiResponse1.json();
            const questionsList1 = JSON.parse(qas1.result).questions;
      
            const qas2 = await openaiResponse2.json();
            const questionsList2 = JSON.parse(qas2.result).questions;

            const selectedQuestions = selectQuestions(questionsList1,questionsList2)
            
            setLoadingState((prev) => ({
              ...prev,
              questionsError: false,
              questionsPrepared: true,
              questionCount: selectedQuestions.length,
              time: 15,
              statusText: "Test oluşturma işlemi başarılı."
            }));
            clearQuestions();
            selectedQuestions.forEach((question: Question) => {
              addQuestion(question)
            });
          }
          catch (error) {
            setLoadingState({ ...loadingState, questionsError: true, statusText:"Sorular oluşturulurken bir hata ile karşılaşıldı." });
            console.error("Error openai:", error);
          }
        }
        
      }
   
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen  pb-20 gap-16 ">
      <div className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <p>
        Merhaba. Araqque&apos;ye hoşgeldiniz. <br /> Lütfen aşağıdaki adımları takip ederek testi başlatın.
        </p>
        
        <ol className="list-inside list-decimal text-sm text-center sm:text-left">
          <li className="mb-2">Ödev Dosyanızı Yükleyin.</li>
          <li>&apos;Testi Oluştur&apos;a tıklayın.</li>
        </ol>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <Label>Ödev Kodu</Label>
            <Input type="text" name="homeworkId" onChange={(e: any)=>setHomeworkId(e.target.value)}
            disabled placeholder="Test amaçlı otomatik atanmıştır"
            />
          </div>
          <div className="flex items-center justify-center w-full mb-3">
            <label
              htmlFor="fileInput"
              className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-800"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg
                  className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 16"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                  />
                </svg>
                <p className="m-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">Dosya yüklemek için tıklayın</span> ya da dosyayı bu alana sürükleyin
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  PDF, PPT, PPTX, DOC, DOCX, TXT
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Maksimum 5 MB, 40.000 kelime
                </p>
              </div>
              <input
                id="fileInput"
                type="file"
                name="fileInput"
                className="hidden"
                onChange={handleFileChange}
                accept=".pdf,.ppt,.pptx,.txt,.doc,.docx"
              />
            </label>
          </div>
          {
            file && 
            <>
              <div className="mt-3 mb-3 text-lg font-bold">{file?.name }</div>
            </>
          }
          
          <div className="flex gap-4 sm:justify-between flex-col sm:flex-row">
            <a
              className="rounded-lg border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4  sm:min-w-44"
              href="/about"
              target="_blank"
              rel="noopener noreferrer"
            >
              Daha Fazla Bilgi
            </a>
            <button
              type="submit"
              className="rounded-lg border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 "
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 15 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3.24182 2.32181C3.3919 2.23132 3.5784 2.22601 3.73338 2.30781L12.7334 7.05781C12.8974 7.14436 13 7.31457 13 7.5C13 7.68543 12.8974 7.85564 12.7334 7.94219L3.73338 12.6922C3.5784 12.774 3.3919 12.7687 3.24182 12.6782C3.09175 12.5877 3 12.4252 3 12.25V2.75C3 2.57476 3.09175 2.4123 3.24182 2.32181ZM4 3.57925V11.4207L11.4288 7.5L4 3.57925Z"
                  fill="currentColor"
                  fillRule="evenodd"
                  clipRule="evenodd"
                ></path>
              </svg>
              Testi Oluştur
            </button>
          </div>
        </form>
      </div>
      {
        <>
          <LoadingModal loadingState={loadingState} openModal={openModal} setOpenModal={setOpenModal}/>
        </>
      }
    </div>
  );
};
