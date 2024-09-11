import { useState } from 'react';

const useInput = () => {
  const [input, setInput] = useState('');
  const handleInput = (e) => {
    setInput(e.target.value);
  };
  return { input, handleInput };
};

export default useInput;
