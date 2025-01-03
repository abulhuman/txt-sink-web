import { vi } from 'vitest';
import * as useTxtFilesHooks from '../../src/hooks/useTxtFiles';
import React from 'react';
import { TxtFileListResponse } from '../../src/repositories/txt-files.repository';
import { act, cleanup, fireEvent, getAllByTestId, render } from '@testing-library/react';
import TxtFilesTable from '../../src/files/components/TxtFilesTable';
import { formatDate } from '../../src/services/lib/utils';

const items: TxtFileListResponse[] = [
  { id: 1, name: "test1.txt", modified_date: "2025-01-01T00:00:00Z", tags: "tag-one,tag-two", size: 100, url: "http://test1.txt" },
  { id: 2, name: "test2.txt", modified_date: "2025-01-02T00:00:00Z", tags: "tag-one,tag-two", size: 200, url: "http://test2.txt" },
];

describe('TxtFilesTable', () => {
  const useTxtFilesSpy = vi.spyOn(useTxtFilesHooks, 'useTxtFiles');

  describe('Basic rendering', () => {

    it('should render the table of txt file items', async () => {

      // Arrange
      const itemsDisplay = items.map((item) => ({
        ...item,
        modified_date: formatDate(item.modified_date),
        size: `${(item.size / 1024).toFixed(2)} KB`,
      }));

      useTxtFilesSpy.mockReturnValue({
        isFetching: false,
        isSuccess: true,
        data: items,
        error: null,
        refetch: vi.fn(),
      });

      // Act
      const { getByTestId } = render(<TxtFilesTable />);

      // Assert
      const tableBody = getByTestId('txt-files-table-body');
      expect(tableBody.children.length).toBe(items.length);
      expect(getAllByTestId(tableBody, 'txt-file-name')
        .map((el) => el.textContent)).toEqual(items
          .map((item) => item.name));
      expect(getAllByTestId(tableBody, 'txt-file-modified-date')
        .map((el) => el.textContent)).toEqual(itemsDisplay
          .map((item) => item.modified_date));
      expect(getAllByTestId(tableBody, 'txt-file-size')
        .map((el) => el.textContent)).toEqual(itemsDisplay
          .map((item) => item.size));

      tableBody.childNodes.forEach((_, index) => {
        const tags = items[index].tags.split(',');
        const rowTestId = `txt-file-${index}-tag`;
        const tagsEl = getByTestId(`${rowTestId}s`);
        expect(tagsEl.childNodes.length).toBe(tags.length);
        tags.forEach((tag, i) => {
          expect(getByTestId(`${rowTestId}-${i}`).textContent).toBe(tag);
        });
      });
    });

    it('should render an empty table with a message when there are no items', async () => {
      // Arrange
      useTxtFilesSpy.mockReturnValue({
        isFetching: false,
        isSuccess: true,
        data: [],
        error: null,
        refetch: vi.fn(),
      });

      // Act
      const { getByTestId } = render(<TxtFilesTable />);
      const tableBody = getByTestId('txt-files-table-body');
      const emptyMessage = getByTestId('txt-files-table-empty-message');

      // Assert
      expect(tableBody.children.length).toBe(1);
      expect(tableBody.childNodes[0].textContent).toBe(emptyMessage.textContent);
      expect(emptyMessage.textContent).toBe('No files found');

    });

    it('should render a loading spinner when fetching data', async () => {
      // Arrange
      useTxtFilesSpy.mockReturnValue({
        isFetching: true,
        isSuccess: false,
        data: null,
        error: null,
        refetch: vi.fn(),
      });

      // Act
      const { getByTestId } = render(<TxtFilesTable />);
      const loadingSpinner = getByTestId('txt-files-table-loading-spinner');

      // Assert
      expect(loadingSpinner.textContent).toBe('Loading...');
    });
  });

  describe.skip('Error handling', () => {
    it('should render an error message when fetching data fails');
  });

  describe('Search functionality', () => {

    describe('Input field', () => {

      it('should render a search input field', async () => {
        // Arrange
        // Act
        const { getByTestId } = render(<TxtFilesTable />);
        const searchInput = getByTestId('txt-files-search-input');

        // Assert
        expect(searchInput).toBeTruthy();
      });

      it('should change the table content when the search query changes', async () => {
        // Arrange
        useTxtFilesSpy.mockReturnValue({
          isFetching: false,
          isSuccess: true,
          data: items,
          error: null,
          refetch: vi.fn(),
        });

        // Act
        const { getByTestId, rerender } = render(<TxtFilesTable />);
        const tableBody = getByTestId('txt-files-table-body');
        const searchInput = getByTestId('txt-files-search-input') as HTMLInputElement;
        const searchItem = items[0];
        const searchValue = searchItem.name.substring(0, 5);

        act(() => {
          fireEvent.change(searchInput, { target: { value: searchValue } });
        });

        useTxtFilesSpy.mockReturnValue({
          isFetching: false,
          isSuccess: true,
          data: items.filter((item) => item.name.includes(searchValue)),
          error: null,
          refetch: vi.fn(),
        });
        rerender(<TxtFilesTable />);

        // Assert
        expect(tableBody.children.length).toBe(1);
        expect(getByTestId('txt-file-name').textContent).toBe(searchItem.name);

        // Act
        act(() => {
          fireEvent.change(searchInput, { target: { value: 'not-found' } });
        });

        useTxtFilesSpy.mockReturnValue({
          isFetching: false,
          isSuccess: true,
          data: [],
          error: null,
          refetch: vi.fn(),
        });
        rerender(<TxtFilesTable />);
        const emptyMessage = getByTestId('txt-files-table-empty-message');

        // Assert
        expect(tableBody.children.length).toBe(1);
        expect(tableBody.childNodes[0].textContent).toBe(emptyMessage.textContent);
        expect(emptyMessage.textContent).toBe('No files found');
      });
    });

    describe('SearchByTabs', () => {
      it('should render the SearchByTabs component', async () => {
        // Arrange
        useTxtFilesSpy.mockReturnValue({
          isFetching: false,
          isSuccess: true,
          data: items,
          error: null,
          refetch: vi.fn(),
        });

        // Act
        const { getByTestId } = render(<TxtFilesTable />);
        const searchByTabs = getByTestId('txt-files-search-by-tabs');

        // Assert
        expect(searchByTabs).toBeTruthy();
      });
    });

    describe('TxtFileImportDialog', () => {
      it('should render the TxtFileImportDialog component', async () => {
        // Arrange
        // Act
        const { getByTestId } = render(<TxtFilesTable />);
        const txtFileImportDialog = getByTestId('txt-file-import-dialog');

        // Assert
        expect(txtFileImportDialog).toBeTruthy();
      });
    });

  });


  afterEach(() => {
    useTxtFilesSpy.mockClear();
    cleanup();
  });
});

