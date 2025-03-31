import React from 'react'

const TextInput = ({ label, value, onChange }: { label: string, value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) => {
    return (
        <div className="mb-4">
            <label className="block text-gray-700">{label}</label>
            <input
                type="text"
                value={value}
                onChange={onChange}
                className="w-full p-2 border rounded"
            />
        </div>
    );
}
export default TextInput
