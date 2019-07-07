import { useState, useCallback, useEffect } from 'react';
import { ColumnProps, TableStateFilters } from 'antd/lib/table';

interface UseTableListOptions {
  fetchData: (query: any) => void;
}

interface ReturnValue<T> {
  tableProps: {
    loading: boolean;
    dataSource: T[];
    // pagination: PaginationProps;
  };
  getFilter: (field: string) => any | any[];
  setFilters: (filters: { [key: string]: any | any[] }) => void;
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

  function yieldQueryFromState() {
    const { filters } = state;
    let query: any = {};

    if (objectCantainsValue(filters)) {
      const filtersPayload: any = {};

      Object.keys(filters).forEach(key => {
        const filter = filters[key];
        if (Array.isArray(filter)) {
          if (filter.length > 1) {
            filtersPayload[key] = filter.join(',');
          } else {
            filtersPayload[key] = filter[0];
          }
        }
      });
      query = { ...query, ...filtersPayload };
    }
    return query;
  }

  async function fetchData() {
    const query = yieldQueryFromState();

    const res = await options.fetchData(query);
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
      let mapedColumn: ExportColumnProps<T> = column;
      return mapedColumn;
    });
  }

  const setFilters: ReturnValue<T>['setFilters'] = filters => {
    const filtersResult = {};
    Object.keys(filters).forEach(key => {
      filtersResult[key] = [filters[key]];
    });
    setState({
      ...state,
      loading: true,
      filters: { ...state.filters, ...filtersResult },
    });
    console.log('setFilter:', state);
  };

  const getFilter: ReturnValue<T>['getFilter'] = field => {
    if (state.filters[field]) {
      if (state.filters[field].length > 1) {
        return state.filters[field];
      }
      return state.filters[field][0];
    }
    console.log('getFilter: ', state);
    return undefined;
  };

  return {
    tableProps: {
      loading: state.loading,
      dataSource: state.dataSource,
    },
    getColumns,
    setFilters,
    getFilter,
  };
}

function objectCantainsValue(obj: any) {
  if (typeof obj === 'object' && !Array.isArray(obj)) {
    return Object.keys(obj).length > 0;
  }
  throw Error(`param obj is not of type object! \n Type: ${typeof obj} \n Value: ${obj}`);
}
