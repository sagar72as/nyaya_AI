
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface OpenAiApiKeyInputProps {
  apiKey: string;
  onChange: (key: string) => void;
}

const OpenAiApiKeyInput: React.FC<OpenAiApiKeyInputProps> = ({ apiKey, onChange }) => {
  const [tempKey, setTempKey] = useState(apiKey);

  const handleSave = () => {
    if (tempKey.trim()) {
      onChange(tempKey.trim());
    }
  };

  return (
    <div className="mb-4 p-3 bg-yellow-50 border border-yellow-300 rounded">
      <p className="text-xs text-yellow-800 mb-2">
        Enter your OpenAI API key. It will only be saved in your browser (localStorage), and used for chat requests.
      </p>
      <div className="flex space-x-2">
        <Input
          type="password"
          value={tempKey}
          onChange={(e) => setTempKey(e.target.value)}
          placeholder="sk-..."
          className="flex-1"
        />
        <Button type="button" onClick={handleSave} disabled={!tempKey.trim()}>Save</Button>
      </div>
    </div>
  );
};

export default OpenAiApiKeyInput;
