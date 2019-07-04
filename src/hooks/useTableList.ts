import { useState, useCallback, useEffect } from 'react';
import { Pagination } from 'antd';
import { PaginationProps, PaginationConfig } from 'antd/lib/pagination';
import { ColumnProps, TableStateFilters } from 'antd/lib/table';
import { object } from 'prop-types';

interface UseTableListOptions {
  fetchData: () => void;
}

interface ReturnValue<T> {
  tableProps: {
    loading: boolean;
    dataSource: T[];
    // pagination: PaginationProps;
  };
  // getFilter: (field: string) => any | any[];
  // setFilters: (filters: { [key: string]: any | any[] }) => void;
  getColumns: (columns: Array<ExportColumnProps<T>>) => Array<ExportColumnProps<T>>;
  // refreshList: () => void;
}

type ExportFunc<T> = (record: T) => string;

export type ExportColumnProps<T> = ColumnProps<T> & {
  export?: boolean | ExportFunc<T>;
};

interface State<T> {
  loading: boolean;
  dataSource: T[];
  filters: TableStateFilters;
}

export default function useTableList<T = any>(options: UseTableListOptions): ReturnValue<T> {
  const getStateFromLocation = useCallback(() => {
    const page: number = 1;
    const filters = {};

    return {
      loading: true,
      dataSource: [],
      filters,
    };
  }, [undefined]);
  const [state, setState] = useState(getStateFromLocation() as State<T>);

  console.log('state:', state);

  useEffect(() => {
    if (state.loading) {
      fetchData();
    }
  }, [state.loading]);

  async function fetchData() {
    const res = await options.fetchData();
    const newState = { ...state, loading: false };
    if (res) {
      newState.dataSource = res.data;
    } else {
      newState.dataSource = [];
    }
    setState(newState);
  }

  function getColumns(columns: Array<ExportColumnProps<T>>) {
    return columns.map(column => {
      // 	const hasFilters = objectContainsValue(state.filters);
      let mapedColumn: ExportColumnProps<T> = column;
      return mapedColumn;
    });
  }

  return {
    tableProps: {
      loading: state.loading,
      dataSource: state.dataSource,
    },
    getColumns,
  };
}
