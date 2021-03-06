import React, { Component } from 'react'
import { connect } from 'react-redux'

import {
  changeScreen,
  viewCabal
} from '../actions'
import CabalsList from './cabalsList'
import ChannelPanel from './channelPanel'
import MainPanel from './mainPanel'
import ProfilePanel from './profilePanel'
import Sidebar from './sidebar'
import { cabalSettingsSelector, isCabalsInitializedSelector } from '../selectors'

const mapStateToProps = state => {
  return {
    addr: state.currentCabal,
    cabalInitialized: isCabalsInitializedSelector(state),
    channelPanelVisible: state.channelPanelVisible[state.currentCabal],
    profilePanelVisible: state.profilePanelVisible[state.currentCabal],
    profilePanelUser: state.profilePanelUser[state.currentCabal],
    settings: cabalSettingsSelector(state)
  }
}

const mapDispatchToProps = dispatch => ({
  changeScreen: ({ screen, addr }) => dispatch(changeScreen({ screen, addr })),
  viewCabal: ({ addr }) => dispatch(viewCabal({ addr }))
})

class LayoutScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showMemberList: false
    }
    this.toggleMemberList = this.toggleMemberList.bind(this)
  }

  toggleMemberList() {
    this.setState((state) => ({
      showMemberList: !state.showMemberList
    }))
  }

  render() {
    const { enableDarkmode } = this.props.settings || {}
    if (!this.props.cabalInitialized) {
      return (
        <div className='loading'>
          <div className='status'> </div>
          <img src='static/images/cabal-logo-white.svg' />
          <div className='status'>Loading hypercores and swarming...</div>
        </div>
      )
    }

    return (
      <div className={`client ${enableDarkmode ? 'darkmode' : ''}`}>
        <CabalsList />
        <Sidebar />
        <MainPanel toggleMemberList={this.toggleMemberList} />
        {this.props.channelPanelVisible && <ChannelPanel addr={this.props.addr} />}
        {this.props.profilePanelVisible && <ProfilePanel addr={this.props.addr} userKey={this.props.profilePanelUser} />}
      </div>
    )
  }
}

const Layout = connect(mapStateToProps, mapDispatchToProps)(LayoutScreen)

export default Layout
