import React from 'react'

const Dropdown = ({ label, value, onChange, options }: { label: string; value: string; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; options: string[] }) => {
    return (
        <div className="mb-4">
            <label className="block text-gray-700">{label}</label>
            <select value={value} onChange={onChange} className="w-full p-2 border rounded">
                <option value="">+ Select -</option>
                {options.map((option) => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>
        </div>
    );
}
export default Dropdown