interface LanguageSelectionProps {
  value: string[];
  onChange: (languages: string[]) => void;
}
export default function LanguageSelection({ value, onChange, }: LanguageSelectionProps) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedLanguages = Array.from(e.target.selectedOptions, (option) => option.value);
    onChange(selectedLanguages);
  };
  return (
    <div className="p-3">
      <label className="block text-xl font-bold mb-2"> Select Languages </label>
      <select multiple value={value} onChange={handleChange} className="w-80 h-48 rounded-xl bg-zinc-950 p-4 outline-none" >
        <option value="english">English</option>
        <option value="urdu">Urdu</option>
        <option value="arabic">Arabic</option>
        <option value="spanish">Spanish</option>
        <option value="french">French</option>
      </select>
    </div>
  );
}