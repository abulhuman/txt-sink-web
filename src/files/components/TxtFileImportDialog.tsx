

export function TxtFileImportDialog({
  open,
  closeDialog
}: {
  open: boolean;
  closeDialog: () => void;
  }) {
  closeDialog();
  return (
    <div>
      <h1>Upload File {open ? "1" : "2"}</h1>
    </div>
  );
}