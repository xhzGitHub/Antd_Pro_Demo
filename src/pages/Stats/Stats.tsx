import React, { PureComponent } from 'react';
import UserList from '@/components/ImageWrapper'
import { 
  Button,
  Dropdown,
  Icon,
  Menu,
  Skeleton,
  Row,
  Col,
  Card
} from 'antd'
import { getSchemas } from '@/services/stats'
// import request from '@/utils/request'
const initialState = {
  loading: true,
  schemas: []
};
// type State = typeof initialState

export default class Stats extends PureComponent {
  state = initialState

  async componentDidMount() {
    // const schemas = await request('/api/data/schemas');
    const schemas = await getSchemas();
    this.setState({
      loading: false,
      schemas
    })
    console.log(this.state.schemas)
  }

  render() {
    const { loading, schemas } = this.state
    return (
      <Row type="flex">
        <Skeleton loading={loading} active>
          {schemas.map(schema => (
            <Col span={4}>
              <Card
                hoverable
                onClick={() => console.log(schema.title)}
              >
                {schema.title}
              </Card>
            </Col>
          ))}
        </Skeleton>
      </Row>
    );
  }
}
