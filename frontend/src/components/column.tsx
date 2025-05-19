import { fetcher } from "@/lib/fetch"
import { Card } from "./card"

type column = {
    id: string
    name: string
    cards: {
        id: string
        name: string
    }[]
}

export function Column({column, ...props}: React.ComponentProps<"div"> & {column: column}) {

    function addCard() {
        fetcher(
            `/column/${column.id}/card`,
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

    return <div {...props} id={column.id} className="i-am-a-table-column h-max min-w-fit flex flex-col gap-2 justify-left bg-gray-200 p-2 shadow-md rounded-xl m-4">
        <h2 className="text-2xl">{column.name}</h2>
        <div className="h-0.5 w-full bg-slate-400"></div>
        {column.cards.map(card => <Card card={card} key={card.id}>{card.name}</Card>)}
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={addCard}>Add</button>
    </div>
}
