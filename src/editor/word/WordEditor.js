import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { change, arrayPush, reset } from 'redux-form'
import Word from './component/Word'
import { fetchDefinitions, fetchSentences, updateTips, wordSelector } from '../duck'
import { fetchWord, editWord } from '../../firebase/duck'
import { replaceAll } from '../../services/obj'

class WordEditor extends React.Component {
    componentDidMount() {
        this.props.fetchWord(this.props.params.id)
    }

    submitTips(values) {
        if (values.definition) {
            this.props.updateField("definition", values.definition)
        }

        let keys = Object.keys(values)
        var sentences = this.props.mutable_sentences

        if (!sentences) sentences = []

        keys.forEach((k, i) => {
            if (k.indexOf("sentences") === -1) return
            if (!values[k]) return

            let arr = k.split("_")
            let id = arr[1]

            if (!this.props.tips.get("body")[id].text) return

            let txt = this.props.tips.get("body")[id].text
            txt = replaceAll(txt, this.props.mutable_en, "[x]")

            this.props.push("sentences", txt)
        })

        this.props.reset("tips")
        this.props.updateTips(this.props.tips.set("show", false))
    }

    render() {
        return this.props.word && this.props.word.get('id') === this.props.params.id ?
            <Word
                {...this.props}
                submitTips={this.submitTips.bind(this)}
                onSubmit={this.props.editWord} 
                initialValues={this.props.word.toJS()} />
            :
            null
    }
}

WordEditor.propTypes = {
    word: PropTypes.object,
    tips: PropTypes.object,
    mutable_en: PropTypes.string,
    mutable_sentences: PropTypes.array
}

const mapStateToProps = ({ editor, form }) => ({
    word: editor.get("word"),
    tips: editor.get("tips"),
    mutable_en: wordSelector({form}, 'en'),
    mutable_sentences: wordSelector({form}, 'sentences')
})

const mapDispatchToProps = (dispatch, ownProps) => ({
    updateTips: (tips) => dispatch(updateTips(tips)),
    fetchDefinitions: (word) => dispatch(fetchDefinitions(word)),
    fetchSentences: (word) => dispatch(fetchSentences(word)),
    fetchWord: (id) => dispatch(fetchWord(id)),
    editWord: (word) => dispatch(editWord(word)),
    updateField: (field, value) => dispatch(change("word_editor", field, value)),
    push: (field, value) => dispatch(arrayPush("word_editor", field, value)),
    reset: (form) => dispatch(reset(form))
})

export default connect(mapStateToProps, mapDispatchToProps)(WordEditor)
