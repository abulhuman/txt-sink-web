import { useEffect, useState } from "react";
import { Card, Chip, Input, Tabs, Typography } from "../../components/material-tailwind";
import { TxtFile, TxtFileSearchBy } from "../../services/txt-files.service";
import { TxtFileImportDialog } from "./TxtFileImportDialog";
import { formatDate } from "../../services/lib/utils";
import { PageSearch } from "iconoir-react";
import { useTxtFiles } from "../../hooks/useTxtFiles";

const TABLE_HEAD = ["Name", "Created", "Size", "Tags"]; //, "URI", "Actions"];

function SearchBy({
  value,
  onChange,
}: {
  value?: string;
  onChange: React.Dispatch<React.SetStateAction<TxtFileSearchBy | undefined>>;
}) {
  return (
    <Tabs value={value} onValueChange={(e) => onChange(e as TxtFileSearchBy)} className="bg-white rounded-md h-9">
      <Tabs.List className="w-full bg-transparent p-1">
        <Tabs.Trigger className="w-full rounded-md" value="tags">
          Tags
        </Tabs.Trigger>
        <Tabs.Trigger className="w-full rounded-md" value="contents">
          Contents
        </Tabs.Trigger>
        <Tabs.Trigger className="w-full rounded-md" value="name">
          Filename
        </Tabs.Trigger>
        <Tabs.TriggerIndicator className="rounded-lg bg-secondary opacity-50" />
      </Tabs.List>
    </Tabs>
  );
}

export default function TxtFilesTable() {
  const [tableRows, setTableRows] = useState<TxtFile[]>([]);
  const [searchBy, setSearchBy] = useState<TxtFileSearchBy | undefined>();
  const [searchValue, setSearchValue] = useState("");
  // const [loading, setLoading] = useState(true);

  const { data, error, refetch: refetchRows } = useTxtFiles({
    searchBy, query: searchValue,
  });

  useEffect(() => {
    if (!data) return;
    if (error) {
      console.log(error);
      return;
    } else if (data) {
      setTableRows(data);
      // setLoading(false);
    }
  }, [data, error]);

  useEffect(() => {
    // setLoading(true);
    refetchRows();
  }, [searchBy, searchValue, refetchRows]);

  return (
    <Card className="max-h-[90vh] w-full flex flex-col">
      <Card.Header
        className="rounded-md shrink-0 bg-gray-100 px-3">
        <div className="flex flex-col md:flex-row md:items-center">
          <div className="p-2 grow text-left">
            <div className="self-start">
              <Typography type="h5" color="primary">
                Recent Uploads
              </Typography>
              <Typography color="info" className="mt-1 font-normal">
                These are details about the latest files uploaded
              </Typography>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-[300px] space-y-4">
              <Input placeholder="Search" className="pl-2" value={searchValue} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchValue(e.target.value)}>
                <Input.Icon className="text-gray-500 items-center">
                  <PageSearch className="w-full h-full -ml-7 mt-2" />
                </Input.Icon>
              </Input>
            </div>
            <div className="w-72 flex items-center justify-stretch justify-items-stretch gap-1">
              by
              <SearchBy onChange={setSearchBy} value={searchBy} />
            </div>
            <div className="">
              <TxtFileImportDialog closeDialog={refetchRows} />
            </div>
          </div>
        </div>
      </Card.Header>
      <Card.Body className="p-0 shrink overflow-y-auto overflow-x-hidden">
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
                  // uri,
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
                    <td className={`${classes} flex flex-wrap`}>
                      {tags && tags.split(",").map((tag, i) => (
                        <Chip key={i} className={`mr-1 px-1 bg-gray-${i % 2 === 0 ? "2" : "4"
                          }00`} size="sm" variant="outline">
                          <Chip.Label>{tag}</Chip.Label>
                        </Chip>
                      ))}
                    </td>
                    {/* <td className={classes}>
                      <div className="w-max">
                        <Typography
                          variant="small"
                          color="primary"
                          className="font-normal"
                        >
                          {uri.slice(0, 5)} ... {uri.slice(-2)}
                        </Typography>
                      </div>
                    </td> */}
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
    </Card >
  );
}