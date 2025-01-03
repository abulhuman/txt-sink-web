import { useEffect, useState } from "react";
import {
  Card,
  Chip,
  Input,
  Typography,
  Spinner
} from "../../components/material-tailwind";
import {
  TxtFileListResponse,
  TxtFileSearchBy
} from "../../repositories/txt-files.repository";
import { TxtFileImportDialog } from "./TxtFileImportDialog";
import { SearchByTabs } from "./SearchByTabs";
import { formatDate } from "../../services/lib/utils";
import { PageSearch } from "iconoir-react";
import { useTxtFiles } from "../../hooks/useTxtFiles";

const TABLE_HEAD = ["Name", "Modified", "Size", "Tags"]; //, "URI", "Actions"];

export default function TxtFilesTable() {
  const [tableRows, setTableRows] = useState<TxtFileListResponse[]>([]);
  const [searchBy, setSearchBy] = useState<TxtFileSearchBy | undefined>();
  const [searchValue, setSearchValue] = useState("");

  const {
    data,
    error,
    isFetching,
    refetch: refetchRows
  } = useTxtFiles({
    searchBy,
    query: searchValue
  });

  useEffect(() => {
    if (!data) return;
    if (error) {
      console.log(error);
      return;
    } else if (data) {
      setTableRows(data);
    }
  }, [data, error]);

  useEffect(() => {
    refetchRows();
  }, [searchBy, searchValue, refetchRows]);

  return (
    <Card className="max-h-[90vh] w-[80%] mx-auto mt-12 flex flex-col">
      <Card.Header className="rounded-md shrink-0 bg-gray-100 px-3">
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
              <Input
                data-testid="txt-files-search-input"
                placeholder="Search"
                className="pl-2"
                value={searchValue}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearchValue(e.target.value)
                }
              >
                <Input.Icon className="text-gray-500 items-center">
                  <PageSearch className="w-full h-full -ml-7 mt-2" />
                </Input.Icon>
              </Input>
            </div>
            <div className="w-72 flex items-center justify-stretch justify-items-stretch gap-1">
              by
              <SearchByTabs onChange={setSearchBy} value={searchBy} />
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
                <th key={head} className="border-y border-gray-200 p-2">
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
          <tbody data-testid="txt-files-table-body">
            {Array.isArray(tableRows) && tableRows.length > 0 ? (
              tableRows.map(
                (
                  {
                    id,
                    name,
                    size,
                    tags,
                    // uri,
                    modified_date
                  },
                  index
                ) => {
                  const isLast = index === tableRows.length - 1;
                  const classes = isLast
                    ? "px-4 py-2"
                    : "px-4 py-2 border-b border-gray-50";

                  return (
                    <tr data-testid={`txt-file-row-${index}`} key={id}>
                      <td className={`${classes} bg-gray-50/75`}>
                        <div className="flex items-center gap-3">
                          <Typography
                            data-testid="txt-file-name"
                            variant="small"
                            color="primary"
                            className="font-bold"
                          >
                            {name}
                          </Typography>
                        </div>
                      </td>
                      <td className={classes}>
                        <Typography
                          data-testid="txt-file-modified-date"
                          variant="small"
                          color="primary"
                          className="font-normal"
                        >
                          {formatDate(modified_date)}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography
                          data-testid="txt-file-size"
                          variant="small"
                          color="primary"
                          className="font-normal"
                        >
                          {(size / 1024).toFixed(2)} KB
                        </Typography>
                      </td>
                      <td
                        data-testid={`txt-file-${index}-tags`}
                        className={`${classes} flex flex-wrap`}
                      >
                        {tags &&
                          tags.split(",").map((tag, i) => (
                            <Chip
                              key={i}
                              className={`mr-1 px-1 bg-gray-${i % 2 === 0 ? "2" : "4"
                                }00`}
                              size="sm"
                              variant="outline"
                            >
                              <Chip.Label
                                data-testid={`txt-file-${index}-tag-${i}`}
                              >
                                {tag}
                              </Chip.Label>
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
                }
              )
            ) : isFetching ? (
              <tr>
                <td className="px-4 py-2 bg-gray-50/20" colSpan={6}>
                  <div
                    className="flex flex-col items-center justify-center"
                    data-testid="txt-files-table-loading-spinner"
                  >
                    <Spinner
                      size="xxl"
                      className="animate-spin my-4 text-gray-200 dark:text-transparent"
                    />
                    <Typography
                      variant="small"
                      color="primary"
                      className="font-normal text-center text-gray-500"
                    >
                      Loading...
                    </Typography>
                  </div>
                </td>
              </tr>
            ) : (
              <tr>
                <td className="px-4 py-2 bg-gray-50/20" colSpan={6}>
                  <Typography
                    data-testid="txt-files-table-empty-message"
                    variant="small"
                    color="primary"
                    className="font-normal text-center text-gray-500"
                  >
                    No files found
                  </Typography>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card.Body>
    </Card>
  );
}

