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

    return <div {...props} id={column.id} className="i-am-a-table-column border-slate-400 border-r-2">
        <h2 className="text-2xl">{column.name}</h2>
        <div className="h-0.5 w-full bg-slate-400"></div>
        {column.cards.map(card => <Card card={card} key={card.id}>{card.name}</Card>)}
        <button onClick={addCard}>Add</button>
    </div>
}
