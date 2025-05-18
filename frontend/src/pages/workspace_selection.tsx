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
    return <ul>
        {WorkSpaces.map(workspace => <li key={workspace.id}><button onClick={() => selectWorkspace(workspace.id)}>{workspace.name}</button></li>)}
        <li><button onClick={createWorkspace}>+</button></li>
    </ul>
}
