'use client';
import DatePicker from 'react-datepicker';

export default function DatePickerWrapper({ label, selected, onChangeAction }: { label: string; selected: Date | null; onChangeAction: (date: Date | null) => void }) {
    return (
        <div>
            <label>{label}</label>
            <DatePicker selected={selected} onChange={onChangeAction} />
        </div>
    );
}