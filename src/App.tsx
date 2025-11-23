import YatzyTable from "./components/YatzyTable";

function App() {
  const players = ["Alice", "Bob", "Charlie"];

  return (
    <>
      <YatzyTable players={players} />
    </>
  );
}

export default App;
