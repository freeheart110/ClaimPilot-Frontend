import { ReactNode } from "react";

const Button = ({ children }: { children: ReactNode }) => {
    return (
        <div className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">
            {children}
        </div>
    )
}
export default Button
