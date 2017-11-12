// @flow

import React, { PureComponent } from 'react'
import { View } from 'react-native'
import { reduxForm, Field, SubmissionError } from 'redux-form'
import { connect } from 'react-redux'

import { updateAccount } from '../../../../flow-control/account'
import { fetchApi } from '../../../../flow-control/utils'

import FieldText from './Fields/FieldText'

import styles from './styles'

import type { FormProps } from 'redux-form'
import type { Shape as AppShape } from '../../../../flow-control'
import type { Shape as AccountShape } from '../../../../flow-control/account'

type Props = {
    // redux-form
    ...FormProps
}

type State = {
    forename: string,
    isChecking: boolean,
    isTaken?: boolean
}

class RegisterFormDumb extends PureComponent<Props, State> {
    state = {
        forename: '',
        isChecking: false
    }

    constructor(props) {
        super(props);
        this.handleSubmit = props.handleSubmit(this.handleSubmit);
    }

    render() {
        const { name, kind, submitting, error } = this.props;
        const { isChecking, isTaken } = this.state;

        return (
            <View style={styles.settings}>
                <Field name="forename" component={FieldText} label="Display Name" onChange={this.handleChange} disabled={submitting} isTaken={isTaken} isChecking={isChecking} />
            </View>
        )
    }

    handleChange = (e, valueNew, value) => {
        const { dispatch } = this.props;
        const forename = valueNew.trim();
        dispatch(updateAccount({ forename }));

        if (forename) {
            this.setState(() => ({ forename, isChecking:true, isTaken:undefined }))
            this.checkForename(forename);
        } else {
            this.setState(() => ({ forename, isChecking:false, isTaken:undefined }));
        }
    }
    async checkForename(forename) {
        const res = await fetchApi('displaynames', { qs:{ forename }});
        if (this.state.forename.trim() === forename) {
            console.log(`check resolved fore forename "${forename}", isTaken:`, res.status === 200, res.status);
            if (res.status === 404) this.setState(() => ({ isChecking:false, isTaken:false }));
            else if (res.status === 200) this.setState(() => ({ isChecking:false, isTaken:true }));
        }
        else console.log(`check for forename "${forename}" is no longer applicable becasue forename changed to "${this.state.forename}"`);
    }
    handleSubmit = values => {
        console.log('values:', values);
        const { dispatch } = this.props;
        const { forename } = values;
        dispatch(updateAccount({ forename }));
    }
}

const RegisterFormControlled = reduxForm({
    form: 'register'
})

const RegisterFormSmart = connect(
    function({ account:{ forename } }: AppShape) {
        return {
            initialValues: {
                forename
            }
        }
    }
)

const RegisterForm = RegisterFormSmart(RegisterFormControlled(RegisterFormDumb))

export default RegisterForm
