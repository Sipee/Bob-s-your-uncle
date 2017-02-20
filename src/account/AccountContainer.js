import React from 'react'
import { connect } from 'react-redux'
import Account from './component/Account'
import { updateAction, register, connexion } from './duck'
import { updateLoading } from '../app/duck'

class AccountContainer extends React.Component {
    componentDidMount() {
        this.props.updateLoading(false)
    }

    onSubmit(values) {
        if (!this.props.action) this.props.register(values)
        else this.props.connexion(values)
    }

    updateAction() {
        this.props.updateAction(!this.props.action)
    }

    render() {
        return <Account {...this.props} onSubmit={this.onSubmit.bind(this)} updateAction={this.updateAction.bind(this)} />
    }
}

AccountContainer.propTypes = {
    action: React.PropTypes.bool,
    error: React.PropTypes.bool,
}

const mapStateToProps = ({accountReducer, appReducer}) => ({
    action: accountReducer.get("action"),
    error: accountReducer.get("error"),
})

const mapDispatchToProps = (dispatch, ownProps) => ({
    updateLoading: (loading) => dispatch(updateLoading(loading)),
    register: (user) => dispatch(register(user)),
    connexion: (user) => dispatch(connexion(user)),
    updateAction: (action) => dispatch(updateAction(action))
})

export default connect(mapStateToProps, mapDispatchToProps)(AccountContainer)
