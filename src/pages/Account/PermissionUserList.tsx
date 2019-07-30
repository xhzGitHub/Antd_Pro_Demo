import React from 'react';
import {
  Card,
  Button,
  Input,
  Table,
  Divider,
} from 'antd';
import useDocumentTitle from '@/hooks/useDocumentTitle';
import useTableList from '@/hooks/useTableList';
import { getAdmins } from '@/services/user';
import { getUrl } from '@/utils/routes';
import { navigateTo } from "@/utils/routes";
import Link from "umi/link";

const { Search } = Input;

export default function PermissionUserList() {
  useDocumentTitle('管理员列表');
  const { tableProps } = useTableList({ fetchData: getAdmins });
  const columns = [
    {
      title: '用户ID',
      dataIndex: 'id',
      render: id => (
        <Link to={getUrl("user-detail", id)}>{ id }</Link>
      )
    },
    {
      title: '用户名',
      dataIndex: 'name',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
    },
    {
      title: '操作',
      dataIndex: 'operate',
      render: () => (
        <div>
          <a>重置密码</a>
          <Divider type="vertical" />
          <a>修改密码</a>
          <Divider type="vertical" />
          <a style={{ color: 'red' }}>删除</a>
        </div>
      )
    }
  ];


  return (
    <Card
      title="管理员列表"
      extra={(
        <>
          <Button
            style={{ display: 'inline-block', width: '35%' }}
            type="primary"
          >
            添加管理员
          </Button>
          <Search
            style={{ display: 'inline-block', width: 'calc(65% - 10px)', marginLeft: '10px'}}
            placeholder="搜索"
          />
        </>
      )}
    >
      <Table
        // rowKey={}
        columns={columns}
        { ...tableProps }
      />
    </Card>
  )
}
