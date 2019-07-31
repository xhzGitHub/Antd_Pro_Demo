import React, { useReducer, useContext } from 'react';
import {
  Card,
  Button,
  Input,
  Table,
  Divider,
  Popconfirm,
} from 'antd';
import useDocumentTitle from '@/hooks/useDocumentTitle';
import useTableList from '@/hooks/useTableList';
import {
  getAdmins,
  resetAdminPassword
} from '@/services/user';
import { getUrl } from '@/utils/routes';
import Link from "umi/link";
import EditUserAuthModal from "./partials/EditUserAuthModal";

interface State {
  admin: Auth.Admin;
  isShowModal: boolean;
}

interface Context {
  state: State;
  dispatch: (action: Action) => void
}

const { Search } = Input;

const initialState = {
  admin: {
    id: '',
    name: '',
    email: ''
  },
  isShowModal: false
} as State;

type Action = 
  | { type: 'SHOW_MODAL'; admin: Auth.Admin; isShowModal: boolean }
  | { type: 'HIDE_MODAL'; isShowModal: boolean };

const reducer = (state, action) => {
  switch(action.type) {
    case 'SHOW_MODAL':
      return {
        ...state,
        admin: action.admin,
        isShowModal: true
      }
    case 'HIDE_MODAL':
      return {
        ...state,
        isShowModal: false
      }
    default:
      return state;
  }
};

export const AdminContext = React.createContext({} as Context);

export default function PermissionUserList() {
  useDocumentTitle('管理员列表');

  const [state, dispatch] = useReducer(reducer, initialState);

  const { tableProps } = useTableList({ fetchData: getAdmins });

  console.log('admin state', state);

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
      render: (_, record) => (
        <div>
          <Popconfirm
            title="确认要重置此用户密码吗？"
            onConfirm={() => handleResetPwd(record)}
            okText="确定"
            cancelText="取消"
          >
            <a>重置密码</a>
          </Popconfirm>
          <Divider type="vertical" />
          <a onClick={() => dispatch({
            type: 'SHOW_MODAL',
            admin: record
          })}>
            修改权限
          </a>
          <Divider type="vertical" />
          <a style={{ color: 'red' }}>删除</a>
        </div>
      )
    }
  ];

  const handleResetPwd = async ({ email, id }) => {
    const payload = {
      email,
      user_id: id
    };
    await resetAdminPassword(payload);
  };

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
      <AdminContext.Provider value={{ state, dispatch }}>
        <EditUserAuthModal />
      </AdminContext.Provider>

      <Table
        rowKey="id"
        columns={ columns }
        { ...tableProps }
      />
    </Card>
  )
}
