"use client"
import { useState } from "react"

export default function SlugInput() {
    const [url, setUrl] = useState('')
    const [slug, setSlug] = useState('')
    function handelChange(e: React.ChangeEvent<HTMLInputElement>) {
        setUrl(e.target.value);
    }
    async function sendUrl() {
        const api = await fetch(`${process.env.NEXT_PUBLIC_FAST_API}/seo/url-slug`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                slug_field: url,
            })
        })
        let result = await api.json()
        setSlug(result.slug)

    }
    const frameDesign = " w-100 h-[80vh] bg-zinc-900 m-5 rounded-4xl"

    return (
        <>
            <section className="w-full bg-black flex justify-between">
                <div className={frameDesign}>
                    <h2 className="block text-center w-50 text-2xl font-bold my-5 mx-auto">Type Your URL:</h2>
                    <input name='slug_field' value={url} onChange={handelChange} type="text" placeholder="Enter your URL . . ."
                        className="outline-none w-80 mx-auto my-10 block rounded-4xl bg-zinc-950 p-5"
                    />
                    <div>
                        {/* <h3 className="text-white">slug:{slug}</h3> */}
                        <input disabled className="w-80 mx-auto my-10 block rounded-4xl bg-zinc-950 p-5 cursor-pointer " placeholder="slug" value={slug} type="text" />
                    </div>

                    <button onClick={sendUrl}
                        className="mx-auto block w-80 my-10 cursor-pointer bg-red-600 text-white p-3 rounded-2xl hover:[box-shadow:0_0_5px_#fff,0_0_5px_#fff,0_0_5px_#fff,0_0_5px_rgba(255,255,255,0.9)] active:bg-white active:text-red-600"
                    >click me</button>
                </div>
                <div className={frameDesign}>
                    {/* <input name='slug_field' value={url} onChange={handelChange} type="text" placeholder="Enter your URl..."
                        className="w-[80%] bg-[#18181b] border-2 rounded-4xl border-red-600 p-5"
                    /> */}
                    {/* <div>
                        <h3 className="text-white">slug:{slug}</h3>
                    </div> */}

                    {/* <button onClick={sendUrl}
                        className="cursor-pointer bg-red-600 text-white p-3 rounded-2xl"
                    >click me</button> */}
                </div>
                <div className={frameDesign}>
                    {/* <input name='slug_field' value={url} onChange={handelChange} type="text" placeholder="Enter your URl..."
                        className="bg-[#18181b] p-5"
                    /> */}
                    {/* <div>
                        <h3 className="text-white">slug:{slug}</h3>
                    </div> */}

                    {/* <button onClick={sendUrl}
                        className="cursor-pointer bg-red-600 text-white p-3 rounded-2xl"
                    >click me</button> */}
                </div>

            </section>
        </>
    )
}


