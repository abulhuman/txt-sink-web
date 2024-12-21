import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './App.css';
import TxtFilesTable from './files/components/TxtFilesTable';
import { useState } from 'react';

function App({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <div className="flex flex-col flex-grow overflow-auto">
          {children}
          <div className="grow p-3">
            <TxtFilesTable />
          </div>
        </div>
      </QueryClientProvider>
    </>);
}

export default App;
