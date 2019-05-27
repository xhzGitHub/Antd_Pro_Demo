import React, { Component } from 'react'

export default class UserList extends Component {
  render() {
    return (
      <div>
        <h3>I am List</h3>
        <p>{ this.props.name }</p>
      </div>
    )
  }
}
