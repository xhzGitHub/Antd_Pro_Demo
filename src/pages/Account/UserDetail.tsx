import React, { useState, useEffect, useMemo, Fragment } from 'react';
import { Card, Input, Row, Col, Avatar } from 'antd';
import Link from 'umi/link';
import useDocumentTitle from '@/hooks/useDocumentTitle';
// import useTableList, { ExportColumnProps } from '@/hooks/useTableList';
import { getUserInfo } from '@/services/user';
import user from '@/models/user';

const { Search } = Input;

interface State {
  user_avt: string;
}

const initState: State = {
  user_avt: '' as string,
};

export default function UserList(props) {
  useDocumentTitle('用户详情');
  const [state, setState] = useState(initState);
  const { id } = props.match.params;

  async function fetchData() {
    const res = await getUserInfo(id);
    if (res) {
      setState({
        ...state,
        user_avt: res.avt,
      });
    }
    console.log('res:', res);
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Row gutter={24}>
      <Col span={10}>
        <Card>
          <div style={{ textAlign: 'center' }}>
            <Avatar size="large" src={state.user_avt} />
          </div>
        </Card>
      </Col>
      <Col span={14}>
        <Card>dsb</Card>
      </Col>
    </Row>
  );
}
