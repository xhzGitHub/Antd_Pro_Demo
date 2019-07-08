import React, { useState, useEffect, useMemo, Fragment } from 'react';
import {
  Card,
  Button,
  Checkbox,
  Input,
  Table
} from 'antd';
import Link from 'umi/link';
import useDocumentTitle from '@/hooks/useDocumentTitle';
// import useTableList, { ExportColumnProps } from '@/hooks/useTableList';
import useTableListV2 from '@/hooks/userTableListV2';
import { getUserList } from '@/services/user';

const { Search } = Input;

export default function UserList() {
  useDocumentTitle("用户列表");
  const { tableProps } = useTableListV2({
    service: getUserList
  });

  const columns = useMemo<Array<ExportColumnProps<any>>>(
    () => [
      {
        title: '用户ID',
        dataIndex: 'id',
        render: id => (<Link to="">{id}</Link>)
      },
      {
        title: '用户名',
        dataIndex: 'name'
      },
      {
        title: '性别',
        dataIndex: 'gender',
        render: value => (Number(value) === 1 ? "男" : "女")
      },
      {
        title: '手机号',
        dataIndex: 'tel',
      },
      {
        title: '用户等级',
        dataIndex: 'bg_level',
      },
      {
        title: '城市',
        dataIndex: 'city',
      },
      {
        title: '注册时间',
        dataIndex: 'created_at',
      },
    ],
    []
  );

  const [ columnData, setColumnData ] = useState(columns);

  const extraContent = (
    <Fragment>
      <Checkbox>分时特权用户</Checkbox>
      <Checkbox>高颜值博主</Checkbox>
      <Button type="primary" style={{ marginLeft: '20px' }}>导出用户信息</Button>
      <Button type="primary" style={{ marginLeft: '20px' }}>导出金币记录</Button>
      <Search 
        placeholder="搜索"
        style={{ width: "270px", marginLeft: "20px" }}
      />
    </Fragment>
  );

  return (
    <Card
      title="用户列表"
      extra={extraContent}
    >
      <Table
        // columns={getColumns(columnData)}
        columns={columnData}
        {...tableProps}
      />
    </Card>
  );
}
