import { Column } from "@/components/column"
import { fetcher } from "@/lib/fetch"
import { useEffect, useState } from "react"

type Workspace = {
    id: string
    name: string
    columns: {
        id: string
        name: string
        cards: {
            id: string
            name: string
        }[]
    }[]
}

export function WorkSpacePage() {
    const [WorkSpace, setWorkSpace] = useState<Workspace | null>(null)

    useEffect(() => {
        fetcher(
            `/workspace/${localStorage.getItem('workspace')}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            },
        )
        .then(res => res.json())
        .then((e) => {setWorkSpace(e)})
    }, [])

    function addColumn() {
        fetcher(
            `/workspace/${localStorage.getItem('workspace')}/column`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ name: prompt('Column name') }),
            },
        )
        .then(res => res.json())
        .then(() => location.reload())
    }

    function renameWorkspace() {
        fetcher(
            `/workspace/${localStorage.getItem('workspace')}/name`,
            {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ name: prompt('Workspace name') }),
            },
        )
        .then(res => res.json())
        .then(() => location.reload())
    }

    return <div className="w-full h-screen flex flex-col gap-5 justify-center items-center">
        <h1 className="flex w-full text-4xl gap-5 justify-between">
            <button onClick={() => {localStorage.removeItem('workspace'); location.reload()}}>&larr;</button>
            <button onClick={() => {renameWorkspace()}}>{WorkSpace?.name}</button>
            <div></div>
        </h1>
        <div className="flex-1 flex gap-2 flex-row">
            {WorkSpace?.columns.map(column => (
                <Column key={column.id} column={column} />
            ))}
            <button className="h-max min-w-fit flex flex-col justify-left bg-gray-200 p-2 shadow-md rounded-xl m-4" onClick={addColumn}>+</button>
        </div>
    </div>
}
