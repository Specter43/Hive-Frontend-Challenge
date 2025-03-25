import { useState } from 'react';
import Dropdown from './components/Dropdown';

const OPTIONS = Array.from({ length: 10 }, (_, i) => `Option ${i + 1}`);

const App = () => {
  const [singleSelect, setSingleSelect] = useState([]);
  const [multiSelect, setMultiSelect] = useState([]);

  return (
    <div className="p-4 space-y-8">
      <h1 className="text-2xl font-bold">Dropdown Component</h1>

      <div>
        <h2 className="font-semibold mb-2">Single Select Dropdown:</h2>
        <Dropdown
          options={OPTIONS}
          isMultiSelect={false}
          selectedOptions={singleSelect}
          onChange={setSingleSelect}
          placeholder="Select an option"
        />
      </div>

      <div>
        <h2 className="font-semibold mb-2">Multi Select Dropdown:</h2>
        <Dropdown
          options={OPTIONS}
          isMultiSelect={true}
          selectedOptions={multiSelect}
          onChange={setMultiSelect}
          placeholder="Select multiple options"
        />
      </div>
    </div>
  );
};

export default App;
