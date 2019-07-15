import React, { useState, useEffect, useMemo, Fragment, ReactText, ReactElement } from 'react';
import {
  Card,
  Row,
  Col,
  Avatar,
  Divider,
  Spin,
  Switch,
  Tooltip,
  Icon,
  Radio,
  Form,
  Input,
  Button
} from 'antd';
import useDocumentTitle from '@/hooks/useDocumentTitle';
import { getUserInfo, updateUserInfo } from '@/services/user';
import { get } from 'lodash';

interface OneColumnItemProp {
  item: ColumnItem;
}
interface ColumnItem {
  label: React.ReactNode;
  value: string | number;
  render?: () => ReactText | ReactElement<any>;
}
interface TwoColumnItemProp {
  items: ColumnItem[];
}

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 }
}

export default function UserDetail(props) {
  useDocumentTitle('用户详情');
  const [userInfo, setUserInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { id } = props.match.params;

  const fetchData = async (service, query) => {
    try {
      const response = await service(query);
      setIsLoading(false);
      return response;
    } catch (error) {
      setIsLoading(false);
      console.log('fetch data fail: ', error);
    }
    return null;
  };

  useEffect(() => {
    fetchData(getUserInfo, id).then(res => setUserInfo(res));
  }, []);

  useDocumentTitle(userInfo && Object.keys(userInfo) ? userInfo.name : '个人详情页');

  const handleSubmit = () => {
    // do sth
  };

  const handleUpdateUserInfo = (field, value) => {
    fetchData(updateUserInfo, {
      user_id: id,
      payload: { [field]: value },
    }).then(res => setUserInfo(res));
  };

  const OneColumnItem = ({ item }: OneColumnItemProp) => (
    <Row style={{ paddingTop: '15px' }}>
      <Col span={12} style={{ fontWeight: 'bold' }}>
        {item.label}
      </Col>
      <Col span={12}>{item.render ? item.render() : item.value}</Col>
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
    <Spin tip="Loading..." spinning={isLoading}>
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
                <Divider dashed />
                <OneColumnItem
                  item={{
                    label: '颜值高',
                    value: userInfo.is_good_looking,
                    render: () => (
                      <Switch
                        checkedChildren="高"
                        unCheckedChildren="普通"
                        checked={Boolean(userInfo.is_good_looking)}
                        onChange={() =>
                          handleUpdateUserInfo('is_good_looking', userInfo.is_good_looking ? 0 : 1)
                        }
                      />
                    ),
                  }}
                />
                <OneColumnItem
                  item={{
                    label: (
                      <div>
                        分时特权用户&nbsp;
                        <Tooltip title="佣金全返，客户端显示不含佣金的折扣。">
                          <Icon type="exclamation-circle" theme="twoTone" />
                        </Tooltip>
                      </div>
                    ),
                    value: userInfo.is_privileged,
                    render: () => (
                      <Switch
                        checkedChildren="是"
                        unCheckedChildren="否"
                        checked={Boolean(userInfo.is_privileged)}
                        onChange={() =>
                          handleUpdateUserInfo('is_privileged', userInfo.is_privileged ? 0 : 1)
                        }
                      />
                    ),
                  }}
                />
                <Divider dashed />
                <Fragment>
                  <Form {...formItemLayout} onSubmit={handleSubmit}>
                    <Form.Item wrapperCol={{ offset: 6 }}>
                      <Radio.Group>
                        <Radio>赠金币</Radio>
                        <Radio>扣金币</Radio>
                      </Radio.Group>
                    </Form.Item>
                    <Form.Item label="数量 (+)">
                      <Input />
                    </Form.Item>
                    <Form.Item label="原因">
                      <Input />
                    </Form.Item>
                    <Form.Item wrapperCol={{ offset: 6 }}>
                      <Button type="primary">
                        赠金币
                      </Button>
                    </Form.Item>
                  </Form>
                </Fragment>
              </div>
            ) : null}
          </Card>
        </Col>
        <Col span={14}>
          <Card>dsb</Card>
        </Col>
      </Row>
    </Spin>
  );
}
