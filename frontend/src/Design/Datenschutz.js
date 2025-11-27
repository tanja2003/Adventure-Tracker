import { useState } from "react";

function DatenschutzCheckbox({ onChange }) {
  const [checked, setChecked] = useState(false);

  const handleChange = (e) => {
    setChecked(e.target.checked);
    if (onChange) onChange(e.target.checked);
  };

  return (
    <div className="flex items-center space-x-2 mb-4" style={{marginTop:"15px"}}>
      <input
        type="checkbox"
        id="datenschutz"
        style={{marginRight:"10px"}}
        checked={checked}
        onChange={handleChange}
        className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
      />
      <label htmlFor="datenschutz" className="text-gray-700" style={{fontSize:"18px"}}>
        Ich stimme den <a href="/datenschutz" className="text-blue-600 underline">Datenschutzbestimmungen</a> zu
      </label>
    </div>
  );
}

export default DatenschutzCheckbox;
