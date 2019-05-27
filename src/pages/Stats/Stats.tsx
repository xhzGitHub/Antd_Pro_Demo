import React, { PureComponent } from 'react';
import UserList from '@/components/ImageWrapper'
import { 
  Button,
  Dropdown,
  Icon,
  Menu
} from 'antd'

export default class Stats extends PureComponent {

  componentDidMount() {
    console.log('here is Rutang User')
  }

  render() {
    const menu = (
      <Menu>
        <Menu.Item key="1">1st item</Menu.Item>
        <Menu.Item key="2">2nd item</Menu.Item>
        <Menu.Item key="3">3rd item</Menu.Item>
      </Menu>
    )

    return (
      <div>
        <h1>Rutang User</h1>
        <Dropdown overlay={menu}>
          <Button>
            Actions <Icon type="down" />
          </Button>
        </Dropdown>
        <Button type="dashed" icon="android">干我啊</Button>
        <UserList name='xhz' />
      </div>
    );
  }
}
