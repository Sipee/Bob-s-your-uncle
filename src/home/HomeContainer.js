import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import Home from './component/Home'
import { fetchWorksheets } from '../firebase/duck'

class HomeContainer extends React.Component {
    componentDidMount() {
        if (!this.props.worksheets) this.props.fetchWorksheets()
    }

    render() {
        return <Home worksheets={this.props.worksheets} push={this.props.router.push} />
    }
}

HomeContainer.propTypes = {
    worksheets: PropTypes.object
}

const mapStateToProps = ({ app }) => ({
    worksheets: app.get("worksheets")
})

const mapDispatchToProps = (dispatch, ownProps) => ({
    fetchWorksheets: () => dispatch(fetchWorksheets())
})

export default connect(mapStateToProps, mapDispatchToProps)(HomeContainer)
