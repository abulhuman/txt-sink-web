import { useEffect, useState } from "react";
import { Card, Input, Typography } from "../../components/material-tailwind";
import { TxtFile } from "../../services/txt-files.service";
import { TxtFileImportDialog } from "./TxtFileImportDialog";
import { formatDate } from "../../services/lib/utils";
import { PageSearch } from "iconoir-react";
import { useTxtFiles } from "../../hooks/useTxtFiles";

const TABLE_HEAD = ["Name", "Created", "Size", "Tags", "URI", "Actions"];

export default function TxtFilesTable() {
  const [tableRows, setTableRows] = useState<TxtFile[]>([]);
  const [loading, setLoading] = useState(true);


  const { data, error, isPending, refetch: refetchRows } = useTxtFiles();


  useEffect(() => {
    if (!data) return;
    if (error) {
      console.log(error);
      return;
    } else if (data) {
      setTableRows(data);
      setLoading(false);
    }
  }, [data, error]);


  return (
    <Card className="max-h-[90vh] w-full flex flex-col border-green-200 border-2 border-dashed">
      <Card.Header
        className="rounded-md shrink-0 bg-zinc-400 px-3">
        <div className="mb-4 flex flex-col md:flex-row md:items-center">
          <div className="p-2 grow self-start">
            <div className="self-start">
              <Typography type="h5" color="primary">
                Recent Uploads
              </Typography>
              <Typography color="info" className="mt-1 font-normal">
                These are details about the last imports
              </Typography>
            </div>
          </div>
          <div className="flex w-full gap-2 md:w-max">
            {false && <div className="w-full md:w-72">
              <Input
                title="Search by tags" >
                <Input.Icon slot="icon" className="text-gray-300" >
                  <PageSearch className="h-5 w-5" />
                </Input.Icon>
              </Input>
            </div>}
            <TxtFileImportDialog closeDialog={refetchRows} />
          </div>
        </div>
      </Card.Header>
      <Card.Body className="p-0 mt-2 shrink overflow-y-auto overflow-x-hidden">
        <table className="w-full min-w-max table-auto text-left relative">
          <thead className="sticky top-0 bg-gray-200">
            <tr>
              {TABLE_HEAD.map((head) => (
                <th
                  key={head}
                  className="border-y border-gray-200 p-2"
                >
                  <Typography
                    variant="h6"
                    color="primary"
                    className="leading-none font-bold"
                  >
                    {head}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.isArray(tableRows) && tableRows.length > 0 ? tableRows.map(
              (
                {
                  id,
                  name,
                  size,
                  tags,
                  uri,
                  created_date,
                },
                index,
              ) => {
                const isLast = index === tableRows.length - 1;
                const classes = isLast
                  ? "px-4 py-2"
                  : "px-4 py-2 border-b border-gray-50";

                return (
                  <tr key={id}>
                    <td className={`${classes} bg-gray-50/75`}>
                      <div className="flex items-center gap-3">
                        <Typography
                          variant="small"
                          color="primary"
                          className="font-bold">
                          {name}
                        </Typography>
                      </div>
                    </td>
                    <td className={classes}>
                      <Typography
                        variant="small"
                        color="primary"
                        className="font-normal"
                      >
                        {formatDate(created_date)}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography
                        variant="small"
                        color="primary"
                        className="font-normal"
                      >
                        {(size / 1024).toFixed(2)} KB
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography
                        variant="small"
                        color="primary"
                        className="font-normal"
                      >
                        {tags}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <div className="w-max">
                        <Typography
                          variant="small"
                          color="primary"
                          className="font-normal"
                        >
                          {uri.slice(0, 5)} ... {uri.slice(-2)}
                        </Typography>
                      </div>
                    </td>
                  </tr>
                );
              },
            ) : (
              <tr>
                <td className="px-4 py-2 bg-gray-50/20" colSpan={6}>
                  <Typography
                    variant="small"
                    color="primary"
                    className="font-normal text-center"
                  >
                    No files found
                  </Typography>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card.Body>
      {/* <Card.Footer className="border-black border-2 border-dashed">
        <Typography
          variant="h6"
          color="primary"
          className="leading-none font-bold"
        >
          Here is the footer
        </Typography>
      </Card.Footer> */}
    </Card>
  );
}