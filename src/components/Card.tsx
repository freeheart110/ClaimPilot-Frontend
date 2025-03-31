import { ReactNode } from 'react'

const Card = ( { children }: { children: ReactNode } ) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto mt-8">
            {children}
        </div>
    )
}
export default Card
