'use client';
import DatePicker from 'react-datepicker';

export default function DatePickerWrapper({ label, selected, onChange }: { label: string; selected: Date | null; onChange: (date: Date | null) => void }) {
    return (
        <div>
            <label>{label}</label>
            <DatePicker selected={selected} onChange={onChange} />
        </div>
    );
}