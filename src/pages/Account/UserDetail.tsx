import React, { useState, useEffect, useMemo, Fragment } from 'react';
import { Card, Input, Row, Col, Avatar, Divider } from 'antd';
import Link from 'umi/link';
import useDocumentTitle from '@/hooks/useDocumentTitle';
// import useTableList, { ExportColumnProps } from '@/hooks/useTableList';
import { getUserInfo } from '@/services/user';
import { get } from 'lodash';

const { Search } = Input;

interface State {
  loading: boolean;
  userInfo: any;
}
interface OneColumnItemProp {
  item: ColumnItem;
}
interface ColumnItem {
  label: string;
  value: string | number;
}

interface TwoColumnItemProp {
  items: ColumnItem[];
}

const initState: State = {
  loading: true,
  userInfo: {},
};

export default function UserList(props) {
  useDocumentTitle('用户详情');
  const [state, setState] = useState(initState);
  const { id } = props.match.params;

  async function fetchData() {
    const userInfo = await getUserInfo(id);
    if (userInfo) {
      setState({
        ...state,
        userInfo,
      });
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const { userInfo } = state;

  useDocumentTitle(userInfo.name || '个人详情页');

  const OneColumnItem = ({ item }: OneColumnItemProp) => (
    <Row style={{ paddingTop: '15px' }}>
      <Col span={12} style={{ fontWeight: 'bold' }}>
        {item.label}
      </Col>
      <Col span={12}>{item.value}</Col>
    </Row>
  );

  const TwoColumnItem = ({ items }: TwoColumnItemProp) => {
    const firstItem = items[0];
    const secondeItem = items[1];

    return (
      <Row style={{ paddingTop: '15px' }}>
        <Col span={12}>
          <OneColumnItem item={firstItem} />
        </Col>
        <Col span={12}>
          <OneColumnItem item={secondeItem} />
        </Col>
      </Row>
    );
  };

  return (
    <Row gutter={24}>
      <Col span={10}>
        <Card>
          {userInfo && Object.keys(userInfo).length ? (
            <div>
              <div style={{ textAlign: 'center' }}>
                <Avatar size="large" src={userInfo.avt} />
              </div>
              <div style={{ paddingTop: '10px', textAlign: 'center' }}>{userInfo.name}</div>
              <OneColumnItem item={{ label: 'ID', value: userInfo.id }} />
              <OneColumnItem item={{ label: '等级', value: userInfo.bg_level }} />
              <OneColumnItem item={{ label: '能量', value: userInfo.bg_credit }} />
              <OneColumnItem item={{ label: '金币', value: userInfo.point }} />
              <OneColumnItem
                item={{ label: '金币补贴', value: get(userInfo, 'discount_vault.amount') }}
              />
              <OneColumnItem
                item={{ label: '金币等级', value: get(userInfo, 'discount_vault.grade') }}
              />
              <OneColumnItem item={{ label: '手机', value: userInfo.tel }} />
              <OneColumnItem item={{ label: '性别', value: userInfo.gender }} />
              <OneColumnItem item={{ label: '城市', value: userInfo.city }} />
              <OneColumnItem
                item={{
                  label: '邀请人',
                  value: userInfo.invite_user ? userInfo.invite_user.name : '无',
                }}
              />
              <OneColumnItem item={{ label: '创建时间', value: userInfo.created_at }} />
              <OneColumnItem item={{ label: '更新时间', value: userInfo.updated_at }} />
              <Divider dashed />
              <TwoColumnItem
                items={[
                  { label: '粉丝数', value: userInfo.followers_count },
                  { label: '真实粉丝数', value: userInfo.real_followers_count },
                ]}
              />
              <TwoColumnItem
                items={[
                  { label: '关注数', value: userInfo.follows_count },
                  { label: '被收藏', value: userInfo.bookmarked_count },
                ]}
              />
              <TwoColumnItem
                items={[
                  { label: '发布数', value: userInfo.subjects_count },
                  { label: '被赞', value: userInfo.liked_count },
                ]}
              />
              <TwoColumnItem
                items={[
                  { label: '推荐', value: userInfo.feature_count },
                  { label: '收录', value: userInfo.official_bookmark_count },
                ]}
              />
            </div>
          ) : null}
        </Card>
      </Col>
      <Col span={14}>
        <Card>dsb</Card>
      </Col>
    </Row>
  );
}
