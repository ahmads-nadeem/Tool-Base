"use client"

import CommanInput from "@/components/CommanInput";
import LanguageSelection from "./LanguageSelection";
import { useState } from "react";

export default function ResumeInput() {
    const [languages, setLanguages] = useState<string[]>([]);

    return (
        <>
            <div className="flex justify-center flex-wrap w-[90%] h-auto mx-auto mt-[2%] bg-zinc-900 rounded-4xl ">
                <CommanInput title='Job Title' placeholder='WEB DEVELOPER & SEO Expert' />
                <CommanInput title='Full Name' placeholder='Ahmads Nadeem' />
                <CommanInput title='Cell Number' placeholder='etc   +(Contry Code) 0000000' />
                <CommanInput title='Age' placeholder='etc   30/03/2005  OR  07/Mar/2005' />
                <CommanInput title='Mail' placeholder='asyouknowme@gmail.com' />
                <CommanInput title='Mail' placeholder='Street # 1 Johar Sargodha Pakistan' />
            </div>
            <LanguageSelection value={languages} onChange={setLanguages} />
        </>
    )
}
