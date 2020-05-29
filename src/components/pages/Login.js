import React, { useContext, useState } from 'react';
import { AuthContext } from "../../context/auth";
import gql from 'graphql-tag'
import { useMutation } from "@apollo/react-hooks";
import { Button, Card, Form, Grid } from 'semantic-ui-react'
import { useForm } from "../../util/hooks";

function Login(props) {
    const context = useContext(AuthContext)
    const [errors, setErrors] = useState({})

    const { onChange, onSubmit, values } = useForm(loginUserCallback, {
        username: '', password: ''
    })

    const [loginUser, { loading }] = useMutation(LOGIN_USER, {
        update(_, { data: { login: userData } }) {
            context.login(userData)
            props.history.push('/')
        },
        onError(err) {
            setErrors(err.graphQLErrors[0].extensions.exception.errors)
        },
        variables: values
    })

    function loginUserCallback() {
        loginUser()
    }

    return (
        <Grid stackable style={{margin: '10px'}}>
            <div className='form-container'>
            <Card fluid>
                <Card.Content>
                    <Form onSubmit={onSubmit} noValidate className={loading ? 'loading' : ''}>
                        <h2>Login</h2>
                        <Form.Input label="Username" placeholder='Username..' type='text' error={!!errors.username}
                            name='username' value={values.username} onChange={onChange} />
                        <Form.Input label="Password" placeholder='Password..' type='password' error={!!errors.password}
                            name='password' value={values.password} onChange={onChange} />
                        <Button type='submit' primary>Login</Button>
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

const LOGIN_USER = gql`
    mutation register(
        $username: String!
        $password: String!
    ){
        login(username: $username password: $password){
            id email username token createdAt
        }
    }
`

export default Login;

