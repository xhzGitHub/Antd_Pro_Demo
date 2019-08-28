import React, { CSSProperties } from "react";
import { Card, Button, Table, Switch } from "antd";
import { ColumnProps } from "antd/lib/table";
import useTableList from "@/hooks/useTableList";
import { getPopupList, updatePopupList } from "@/services/notification";
import { getUrl, navigateTo } from "@/utils/routes";
import Link from "umi/link";
import { AppPopup } from "@/types/app-popup";

const IMG_SIZE: CSSProperties = {
  width: 150,
  height: 150
};

export default function PopupList() {
  const { tableProps, refreshList } = useTableList({ fetchData: getPopupList });

  const columns: Array<ColumnProps<AppPopup.ListItem>> = [
    {
      title: "弹窗名称",
      dataIndex: "title"
    },
    {
      title: "弹窗预览",
      dataIndex: "picture_url",
      render: value => value && <img style={{ ...IMG_SIZE }} src={value} />
    },
    {
      title: "跳转H5预览",
      dataIndex: "h5_picture_url",
      render: value => (value ? <img style={{ ...IMG_SIZE }} src={value} /> : "不跳转")
    },
    {
      title: "弹窗人群",
      dataIndex: "accept_user_type_description"
    },
    {
      title: "启用状态",
      dataIndex: "switch",
      render: (value, record) => (
        <Switch
          checkedChildren="启用"
          unCheckedChildren="禁用"
          checked={value === 1}
          onChange={async checked => {
            const res = await updatePopupList({
              switch: checked ? 1 : 0,
              window_id: record.window_id
            });
            if (res.errcode === 0) {
              refreshList();
            }
          }}
        />
      )
    },
    {
      title: "操作人",
      dataIndex: "operator_id",
      render: (id, record) => <Link to={getUrl("user-detail", id)}>{record.operator_name}</Link>
    },
    {
      title: "操作",
      dataIndex: "action",
      render: () => <span>操作</span>
    }
  ];

  return (
    <Card
      title="开机弹窗"
      extra={
        <Button type="primary" onClick={() => navigateTo("create-app-popup")}>
          新增弹窗
        </Button>
      }
    >
      <Table columns={columns} {...tableProps} />
    </Card>
  );
}
