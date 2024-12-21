import './App.css';
import TxtFilesTable from './files/components/TxtFilesTable';

function App({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <>
      <div className="flex flex-col flex-grow overflow-auto">
        {children}
        <div className="grow p-3">
          <TxtFilesTable />
        </div>
      </div>
    </>);
}

export default App;
