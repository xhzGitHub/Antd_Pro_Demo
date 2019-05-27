import React, { Component } from 'react';
import { connect } from 'dva';
import UserList from '@/components/ImageWrapper'

class RutangUser extends Component {

  componentDidMount() {
    console.log('here is Rutang User')
  }

  render() {
    return (
      <div>
        <h1>Rutang User</h1>
        <UserList name='xhz' />
      </div>
    );
  }
}

export default RutangUser;
