import { fetcher } from "@/lib/fetch"
import { useEffect, useRef, useState } from "react"

type card = {
    id: string
    name: string
}

export function Card({card, ...props}: React.ComponentProps<"div"> & {card: card}) {
    const cmd = useRef<HTMLDivElement>(null)

    function callCmd(e: React.MouseEvent<HTMLDivElement>) {
        cmd.current!.style.display = "block"
        cmd.current!.style.left = `${e.clientX}px`
        cmd.current!.style.top = `${e.clientY}px`
    }

    function closeCmd() {
        cmd.current!.style.display = "none"
    }

    function ctx(e: React.MouseEvent<HTMLDivElement>) {
        e.preventDefault()
        callCmd(e)

        const click = () => {
            closeCmd()
            document.removeEventListener("click", click)
        }
        document.addEventListener("click", click)
    }

    function Delete() {
        fetcher(
            `/card/${card.id}`,
            {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            },
        )
        location.reload()
    }

    function Rename() {
        fetcher(
            `/card/${card.id}/name`,
            {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ name: prompt('Card name') }),
            },
        )
        location.reload()
    }

    const cardref = useRef<HTMLElement>(null)

    function clickStart(e: React.MouseEvent<HTMLDivElement>) {
        if (e.button !== 0) return
        cardref.current!.style.position = "absolute"
        cardref.current!.style.transform = "translate(-50%, -50%)"
    }

    function clickMove(e: React.MouseEvent<HTMLDivElement>) {
        if (e.button !== 0) return
        cardref.current!.style.left = `${e.clientX}px`
        cardref.current!.style.top = `${e.clientY}px`
    }

    function clickEnd(e: React.MouseEvent<HTMLDivElement>) {
        if (e.button !== 0) return
        cardref.current!.style.position = "static"
        const col = document.elementsFromPoint(e.clientX, e.clientY).filter((e) => e.classList.contains("i-am-a-table-column"))[0]
        if (!col) return;
        fetcher(
            `/card/${card.id}/move`,
            {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ column_id: col.id }),
            },
        ).then(() => location.reload())
    }

    const comments_dialog = useRef<HTMLDivElement>(null)

    function EnableComments() {
        comments_dialog.current!.style.display = "block"
    }

    function closeComment(e: React.MouseEvent<HTMLDivElement>) {
        if (e.target !== comments_dialog.current) return
        comments_dialog.current!.style.display = "none"
    }

    type comment = {
        id: string
        content: string
        author_id: string,
        card_id: string
    }

    const [Commnets, setComments] = useState<comment[]>([])

    function updateComments() {
        fetcher(
            `/card/${card.id}/comments`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            },
        )
        .then(res => res.json())
        .then((e) => {setComments(e)})
    }

    useEffect(() => {
        updateComments()
    }, [])

    function sendComment(e: React.FormEvent) {
        e.preventDefault()
        fetcher(
            `/card/${card.id}/comment`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ content: ((e.currentTarget as HTMLFormElement)[0] as HTMLInputElement).value }),
            },
        )
        .then(res => res.json())
        .then(() => updateComments())
        .then(() => ((e.currentTarget as HTMLFormElement)[0] as HTMLInputElement).value = "")
    }

    return <div {...props}>
        <span ref={cardref} onMouseDown={clickStart} onMouseMove={clickMove} onMouseUp={clickEnd} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer" onContextMenu={ctx}>{card.name}</span>

        <div ref={cmd} className="absolute rounded-md border border-slate-400 bg-white p-0.5" style={{display: "none"}}>
            <div className="flex flex-col gap-2">
                <button className="bg-red-200 cursor-pointer" onClick={Delete}>Delete</button>
                <button className="bg-green-200 cursor-pointer" onClick={Rename}>Rename</button>
                <button className="bg-green-200 cursor-pointer" onClick={EnableComments}>Comments</button>
            </div>
        </div>

        <div ref={comments_dialog} onClick={closeComment} className="absolute top-0 left-0 bg-black opacity-20 w-screen h-screen" style={{display: "none"}}>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-md border border-slate-400 bg-white p-0.5 text-black text-2xl">
                {card.name}
                <ul>
                    {Commnets.map(comment => <li key={comment.id}>{comment.content}</li>)}
                </ul>
                <form onSubmit={sendComment}>
                    <input type="text" name="comment" />
                </form>
            </div>
        </div>
    </div>
}
