import { useState, useMemo } from "react";

function App() {
  const [count, setCount] = useState(0);
  const [dark, setDark] = useState(false);

  // Expensive calculation
  const double = useMemo(() => {
    console.log("Calculating...");
    return count * 2;
  }, [count]); 
  const themeStyle = {
    backgroundColor: dark ? "black" : "white",
    color: dark ? "white" : "black"
  };

  return (
    <div style={themeStyle}>
      <h1>{double}</h1>
      <button onClick={() => setCount(count + 1)}>Increase</button>
      <button onClick={() => setDark(d => !d)}>Toggle Theme</button>
    </div>
  );
}

export default App;
