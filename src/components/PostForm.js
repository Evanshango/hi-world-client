import React from 'react';
import {Button, Form} from "semantic-ui-react";
import gql from 'graphql-tag'
import {useMutation} from "@apollo/react-hooks";

import {useForm} from "../util/hooks";
import {FETCH_POSTS_QUERY} from "../util/graphql";

function PostForm() {
    const {values, onChange, onSubmit} = useForm(createPostCallback, {
        body: ''
    })

    const [createPost, {error}] = useMutation(CREATE_POST_MUTATION, {
        variables: values,
        update(proxy, result) {
            // make a copy of the cachedResponse and not reference it directly
            const data = {...proxy.readQuery({query: FETCH_POSTS_QUERY})}
            data.getPosts = [result.data.createPost, ...data.getPosts]
            proxy.writeQuery({query: FETCH_POSTS_QUERY, data})
            values.body = ''
        },
        onError(err){
        }
    })

    function createPostCallback() {
        createPost()
    }

    return (
        <>
            <Form onSubmit={onSubmit}>
                <h3>Create a Post</h3>
                <Form.Field>
                    <Form.Input placeholder='Hi World' name='body' onChange={onChange} value={values.body}
                    error={!!error}/>
                    <Button type='submit' color='blue'>Submit</Button>
                </Form.Field>
            </Form>
            {error && (
                <div className='ui error message'>
                    <ul className="list">
                        <li>{error.graphQLErrors[0].message}</li>
                    </ul>
                </div>
            )}
        </>
    );
}

const CREATE_POST_MUTATION = gql`
    mutation createPost($body: String!){
        createPost(body: $body){
            id body createdAt username
            comments{id body username createdAt}
            likes{id username createdAt}
            commentCount
            likeCount
        }
    }
`

export default PostForm;
