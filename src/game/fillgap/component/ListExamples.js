import React from 'react'
import reactStringReplace from 'react-string-replace'
import InputMedium from './InputMedium'
import InputHard from './InputHard'

const Examples = (props) => (
    <div className={"form-group " + props.class } key={props.itemKey}>
        {reactStringReplace(props.item.get("example"), '[x]', (match, i) => (
            <div key={i}>
                {props.mode === 1 ?
                    <InputMedium {...props} />
                        :
                    <InputHard {...props} />
                }
            </div>
        ))}.
    </div>
)

const getClass = (userWord) => {
    if (!userWord) return ""
    let status = userWord.get("status")

    if (status === true) return "has-success"
    if (status === false) return "has-error"
}

const ListExamples = (props) => (
    <div>
        {props.words.map((w, i) => (
            <Examples
                {...props}
                key={w.get("id")} 
                item={w} 
                itemKey={i}
                class={getClass(props.userWords.get(i))}
                userWord={props.userWords.get(i)}
            />
        ))}
    </div>
)

export default ListExamples
