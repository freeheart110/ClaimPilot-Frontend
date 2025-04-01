'use client';

import Dropzone from "react-dropzone";

export default function DragDropUpload({ label, onDropAction }: { label: string; onDropAction: (acceptedFiles: File[]) => void }) {
    return (
        <div className="mb-4">
            <label className="block text-gray-700">{label}</label>
            <Dropzone onDrop={onDropAction}>
                {({ getRootProps, getInputProps }) => (
                    <div {...getRootProps()} className="w-full p-4 border-dashed border-2 border-gray-300 text-center cursor-pointer">
                        <input {...getInputProps()} />
                        <p className="text-gray-500">Drag and drop a file here or click to upload</p>
                    </div>
                )}
            </Dropzone>
        </div>
    );
}