import { ChangeEvent, useState, useCallback, useEffect } from 'react';
import { txtFilesService } from '../../services/txt-files.service';
import { FileRejection, useDropzone } from 'react-dropzone';
import {
  Button,
  Dialog,
  IconButton,
  Input,
  Typography,
  List
} from '../../components/material-tailwind';
import {
  CloudUpload,
  Page,
  PagePlus,
  UploadSquareSolid,
  Xmark
} from 'iconoir-react';
import toast from 'react-hot-toast';

function AcceptedFiles({ acceptedFiles }: { acceptedFiles: readonly File[]; }) {
  return acceptedFiles.map((file) => (
    <div key={file.name} className='flex items-center gap-2 bg-green-100 p-2 rounded-md'>
      <Page className='h-5 w-5 text-primary' />
      <Typography as='p' type='h6' color='success' className='font-semibold text-primary'>
        {file.name}
      </Typography>
    </div>
  ));
}

function FileRejectionErrors({ fileRejections }: { fileRejections: readonly FileRejection[]; }) {
  return fileRejections.map(({ file, errors }) =>
    <div key={file.name}>
      <Typography as='p' type='h6' color='error' className='font-semibold mb-2 text-gray-500'>
        {file.name}
      </Typography>
      <List className='list-disc list-inside'>
        {errors.map((e) => (
          <List.Item key={e.code} className='text-sm text-red-500'>
            {e.code === 'file-invalid-type' && 'Only .txt files are allowed'}
            {e.code === 'file-too-small' && 'File must be larger than 0.5KB'}
            {e.code === 'file-too-large' && 'File cannot be larger than 2KB'}
          </List.Item>
        ))}
      </List>
    </div>
  );
};

export function TxtFileImportDialog({
  closeDialog
}: {
  closeDialog: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [file, setFile] = useState<File>();
  const [tags, setTags] = useState<string[]>([]);
  const [isFileVisible, setIsFileVisible] = useState<boolean>(false);
  const [isErrorVisible, setIsErrorVisible] = useState<boolean>(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFile(acceptedFiles[0]);
    setIsFileVisible(true);
    setIsErrorVisible(false);
  }, []);

  const { getRootProps, getInputProps, isDragActive, fileRejections, acceptedFiles } =
    useDropzone({
      onDrop,
      maxFiles: 1,
      minSize: 2 ** 9,
      maxSize: 2 ** 11,
      multiple: false,
      accept: { 'text/plain': ['.txt'] }
    });

  useEffect(() => {
    if (fileRejections.length > 0) {
      setIsErrorVisible(true);
      setIsFileVisible(false);
    }
  }, [fileRejections]);

  const handleFileUpload = async () => {
    try {
      if (!file) return;
      const response = await txtFilesService.uploadTxtFile(file, tags);
      if (response.error) {
        throw response.error;
      } else {
        toast.success('File uploaded successfully', { duration: 3000, style: { background: '#10B981', color: '#F9FAFB' } });
        closeDialog();
        setIsOpen(false);
      }
    } catch (err: any) {
      console.error(err);
    }
  };

  return (
    <div className='grid place-items-center w-full'>
      <Dialog open={isOpen} onOpenChange={(isOpen) => {
        setIsOpen(isOpen);
        if (!isOpen) {
          closeDialog();
          setFile(undefined);
          setIsErrorVisible(false);
          setIsFileVisible(false);
        }
      }}>
        <Dialog.Trigger
          as={Button}
          onClick={() => {
            setIsOpen(true);
            setFile(undefined);
            setIsErrorVisible(false);
            setIsFileVisible(false);
          }}
          className='flex items-center gap-2 text-white bg-primary hover:bg-primary-dark'
        >
          <UploadSquareSolid className='h-5 w-5' />
          <Typography>Upload</Typography>
        </Dialog.Trigger>
        <Dialog.Overlay className='bg-black bg-opacity-60 flex items-center justify-center'>
          <Dialog.DismissTrigger
            as={IconButton}
            size='sm'
            variant='ghost'
            color='secondary'
            className='absolute right-2 top-2'
            isCircular
            onClick={() => {
              closeDialog();
              setFile(undefined);
              setIsErrorVisible(false);
              setIsFileVisible(false);
            }}>
            <Xmark className='h-5 w-5' />
          </Dialog.DismissTrigger>
          <Dialog.Content className='p-6 w-1/2 bg-white rounded-lg shadow-lg'>
            <div className='w-full flex flex-row items-center place-content-center bg-primary rounded-lg min-h-20'>
              <Typography
                as='p'
                className='mb-1 font-semibold text-xl text-white'
              >
                Upload a Text File
              </Typography>
            </div>

            <form className='mt-6 flex flex-col gap-4'>
              <div className='w-full'>
                <div className='flex flex-col gap-4 border-none'>
                  <div
                    {...getRootProps()}
                    className={`border-2 border-dashed p-6 rounded-md ${isDragActive ? 'border-blue-500' : 'border-gray-300'
                      }`}
                  >
                    <input {...getInputProps()} />
                    {isDragActive ? (<>
                      <div className='max-w-md mx-auto text-center flex flex-col items-center gap-2'>
                        <PagePlus className='h-12 w-12 text-primary' />
                        <Typography className='font-sans antialiased text-base text-inherit mb-2 font-semibold'>
                          Drop the files here...
                        </Typography>
                      </div>
                    </>
                    ) : (<>
                      <div className='max-w-md mx-auto text-center flex flex-col items-center gap-2'>
                        <CloudUpload className='h-12 w-12 text-primary' />
                        <Typography className='font-sans antialiased text-base text-inherit mb-2 font-semibold'>
                          Drag and Drop or&nbsp;
                          <span className='underline'>Click to Browse</span>
                        </Typography>
                        <Typography className='font-sans antialiased text-sm text-foreground'>
                          Supported format: .txt
                        </Typography>
                        <Typography className='font-sans antialiased text-sm text-foreground'>
                          File size limit: 0.5KB - 2KB
                        </Typography></div>
                    </>
                    )}
                  </div>
                  {isErrorVisible && <FileRejectionErrors fileRejections={fileRejections} />}
                  {isFileVisible && <AcceptedFiles acceptedFiles={acceptedFiles} />}
                  <div className="w-full space-y-1">
                    <Typography
                      as="label"
                      htmlFor="tags"
                      type="small"
                      color="default"
                      className="font-semibold"
                    >
                      Tags (comma separated)
                    </Typography>
                    <Input id="tags" type="text" placeholder="django,aws" className="text-gray-500 p-2 border border-gray-300 rounded-md" onChange={(e: ChangeEvent<HTMLInputElement>) => setTags(e.target.value.split(','))} />
                  </div>
                </div>
              </div>

              <div className='flex items-center place-content-center gap-2'>
                <Button
                  type='button'
                  onClick={handleFileUpload}
                  disabled={!file || isErrorVisible || !isFileVisible}
                  className='bg-primary hover:bg-primary-dark text-white disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed disabled:border-gray-300'
                >
                  Upload
                </Button>
              </div>
            </form>
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog>
    </div>
  );
}