import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
  createRef,
  Fragment,
} from 'react';
import { Card, Button, Select, Table, DatePicker, Skeleton } from 'antd';
import { getBargainFunnel } from '@/services/stats';
import downloadCSV from '@/components/ExportTableDataModal/utils';
import useDocumentTitle from '@/hooks/useDocumentTitle';
import useTableList, { ExportColumnProps } from '@/hooks/useTableList';
import { CLIENTS } from './constants';
import moment from 'moment';

const { RangePicker } = DatePicker;
let initData = true;
const DATA_FORMAT = 'YYYY-MM-DD';

export default function BargainFunnel() {
  const columns = useMemo<Array<ExportColumnProps<any>>>(
    () => [
      {
        title: '时间',
        dataIndex: 'date',
      },
      {
        title: '终端路径',
        dataIndex: 'client',
        filters: CLIENTS,
      },
      {
        title: '首页',
        dataIndex: 'index',
      },
      {
        title: '业务首页',
        dataIndex: 'list',
      },
      {
        title: '商家详情页',
        dataIndex: 'detail',
      },
      {
        title: '确认页',
        dataIndex: 'confirm',
      },
      {
        title: '支付页',
        dataIndex: 'pay',
      },
      {
        title: '支付成功',
        dataIndex: 'payed',
      },
    ],
    []
  );
  const [columnData, setColumnData] = useState(columns);
  const [dataSource, setDataSource] = useState([]);
  const [exporting, setExporting] = useState(false);

  useDocumentTitle('砍价大盘漏斗');
  const { tableProps, getColumns, setFilters, getFilter } = useTableList({
    fetchData: getBargainFunnel,
  });

  const startAt = getFilter('start_at');
  const endAt = getFilter('end_at');
  const range: any = startAt && endAt ? [moment(startAt), moment(endAt)] : [];

  function handleExport() {
    setExporting(true);
    downloadCSV(dataSource, columnData);
    setExporting(false);
  }

  const renderTableTitle = useCallback(
    () => (
      <div>
        <RangePicker
          format={DATA_FORMAT}
          style={{ padding: '0 20px 25px 0' }}
          value={range}
          onChange={(_, dataString) => {
            setFilters({ start_at: dataString[0], end_at: dataString[1] });
          }}
        />
        <Select
          style={{ width: 70 }}
          defaultValue="UV"
          onChange={type => setFilters({ type })}
          value={getFilter('type') || 'UV'}
        >
          <Select.Option value="uv">UV</Select.Option>
          <Select.Option value="pv">PV</Select.Option>
        </Select>
      </div>
    ),
    [getFilter]
  );

  return (
    <Card
      title="砍价大盘"
      extra={
        <Button type="primary" disabled={exporting} loading={exporting} onClick={handleExport}>
          导出数据
        </Button>
      }
    >
      <Table
        scroll={{ x: true }}
        rowKey={(_, index) => index.toString()}
        columns={getColumns(columnData)}
        title={renderTableTitle}
        {...tableProps}
      />
    </Card>
  );
}

// *** the demo of useCallback and useMemo ***//

// export default function BargainFunnel() {
//   const [count, setCount] = useState(1);
//   const [val, setValue] = useState('');

// const expensive = useMemo(() => {
//   console.log('compute');
//   let sum = 0;
//   for (let i = 0; i < count * 100; i++) {
//       sum += i;
//   }
//   return sum;
// }, [count]);

// const callback = useCallback(() => {
//   console.log('compute');
//   return count;
// }, [count])

//   const callback = () => {
//     console.log('compute');
//     return count;
//   }

//   return (
//   <div>
//     <h4>{count}</h4>
//     <Child callback={callback} />
//     <div>
//         <button onClick={() => setCount(count + 1)}>+c1</button>
//         <input value={val} onChange={event => setValue(event.target.value)}/>
//     </div>
//   </div>);
// }

// function Child({callback}) {
//   const [count, setCount] = useState(() => callback());
//   useEffect(() => {
//     setCount(callback());
//   }, [callback]);
//   return <div>
//     {count}
//   </div>
// }
