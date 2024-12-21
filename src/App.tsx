import './App.css';

function App({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <>
      <div className="flex flex-col flex-grow overflow-auto">
        {children}
      </div>
    </>);
}

export default App;
