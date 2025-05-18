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

    return <>
        <h1 className="text-4xl flex gap-5">
            <button onClick={() => {localStorage.removeItem('workspace'); location.reload()}}>&larr;</button>
            <button onClick={() => {renameWorkspace()}}>{WorkSpace?.name}</button>
        </h1>
        <div className="flex gap-2 flex-row">
            {WorkSpace?.columns.map(column => (
                <Column key={column.id} column={column} />
            ))}
            <button onClick={addColumn}>+</button>
        </div>
    </>
}
