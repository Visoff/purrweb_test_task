import { fetcher } from "@/lib/fetch"
import { useEffect, useState } from "react"
import { WorkSpacePage } from "./workspace"

type Workspace = {
    id: string,
    name: string
}

export function WorkSpaceSelection() {
    const [WorkSpaces, setWorkSpaces] = useState<Workspace[]>([])

    function selectWorkspace(id: string) {
        localStorage.setItem('workspace', id)
        location.reload()
    }

    function createWorkspace() {
        fetcher(
            '/workspace',
            {
                method: 'POST',
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

    useEffect(() => {
        fetcher(
            '/workspace',
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            },
        )
        .then(res => res.json())
        .then(setWorkSpaces)
    }, [])

    if (localStorage.getItem('workspace')) {
        return <WorkSpacePage /> 
    }
    return <div className="w-full h-screen flex justify-center items-center">
        <ul className="flex flex-col p-4 gap-2 bg-gray-100 rounded-xl shadow-md items-center">
            {WorkSpaces.map(workspace => <li className="w-1/3 min-w-fit bg-blue-200 h-fit p-2 px-4 rounded-xl cursor-pointer flex items-center justify-center hover:px-8 transition-all" key={workspace.id} onClick={() => selectWorkspace(workspace.id)}>{workspace.name}</li>)}
            <li className="w-1/3 min-w-fit bg-blue-200 h-fit p-2 px-4 rounded-xl cursor-pointer flex items-center justify-center hover:px-8 transition-all" onClick={createWorkspace}>+</li>
        </ul>
    </div>
}
