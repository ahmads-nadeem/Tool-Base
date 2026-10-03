interface typeRst {
    title:string,
    placeholder:string
}
export default function CommanInput({title, placeholder}:typeRst) {
    // const place = `Enter you ${placeholder}`
    const heading = `Enter Your ${title}`

    return (
        <div className="p-5">
            <h2 className="block w-full text-2xl font-bold  p-2 mx-auto">{heading}</h2>
            <input name='slug_field' type="text" placeholder={placeholder}
                className="outline-none w-80 mx-auto my-2 block rounded-4xl bg-zinc-950 p-5"
            />
        </div>
    )
}
