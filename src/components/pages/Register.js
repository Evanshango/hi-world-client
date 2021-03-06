import React, { useContext, useState } from 'react';
import { AuthContext } from "../../context/auth";
import gql from 'graphql-tag'
import { useMutation } from "@apollo/react-hooks";
import { Button, Card, Form, Grid } from 'semantic-ui-react'
import { useForm } from "../../util/hooks";

function Register(props) {
    const context = useContext(AuthContext)
    const [errors, setErrors] = useState({})

    const { onChange, onSubmit, values } = useForm(registerUser, {
        username: '', email: '', password: '', confirmPassword: ''
    })

    const [addUser, { loading }] = useMutation(REGISTER_USER, {
        update(_, { data: { register: userData } }) {
            context.login(userData)
            props.history.push('/')
        },
        onError(err) {
            setErrors(err.graphQLErrors[0].extensions.exception.errors)
        },
        variables: values
    })

    function registerUser() {
        addUser()
    }

    return (
        <Grid stackable style={{ margin: '10px' }}>
            <div className='form-container'>
                <Card fluid>
                    <Card.Content>
                        <Form onSubmit={onSubmit} noValidate className={loading ? 'loading' : ''}>
                            <h2>Register</h2>
                            <Form.Input label="Username" placeholder='Username..' type='text' error={!!errors.username}
                                name='username' value={values.username} onChange={onChange} />
                            <Form.Input label="Email" placeholder='Email..' type='email' error={!!errors.email}
                                name='email' value={values.email} onChange={onChange} />
                            <Form.Input label="Password" placeholder='Password..' type='password' error={!!errors.password}
                                name='password' value={values.password} onChange={onChange} />
                            <Form.Input label="Confirm Password" placeholder='Confirm Password..' type='password'
                                name='confirmPassword' value={values.confirmPassword}
                                error={!!errors.confirmPassword} onChange={onChange} />
                            <Button type='submit' primary>Register</Button>
                        </Form>
                        {Object.keys(errors).length > 0 && (
                            <div className="ui error message">
                                <ul className='list'>
                                    {Object.values(errors).map(value => (
                                        <li key={value}>{value}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </Card.Content>
                </Card>
            </div>
        </Grid>
    );
}

const REGISTER_USER = gql`
    mutation register(
        $username: String!
        $email: String!
        $password: String!
        $confirmPassword: String!
    ){
        register(
            registerInput: {
                username: $username
                email: $email
                password: $password
                confirmPassword: $confirmPassword
            }
        ) {
            id email username token createdAt
        }
    }
`

export default Register;
