import { fetcher } from "@/lib/fetch"
import { useRef, useState } from "react"

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

    return <div {...props}>
        <span ref={cardref} onMouseDown={clickStart} onMouseMove={clickMove} onMouseUp={clickEnd} className="text-lg bg-blue-200 rounded-xl px-1 m-2 cursor-pointer" onContextMenu={ctx}>{card.name}</span>

        <div ref={cmd} className="absolute rounded-md border border-slate-400 bg-white p-0.5" style={{display: "none"}}>
            <div className="flex flex-col gap-2">
                <button className="bg-red-200 cursor-pointer" onClick={Delete}>Delete</button>
                <button className="bg-green-200 cursor-pointer" onClick={Rename}>Rename</button>
            </div>
        </div>
    </div>
}
