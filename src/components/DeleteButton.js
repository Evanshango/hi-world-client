import React, {useState} from 'react';
import gql from 'graphql-tag'
import {useMutation} from "@apollo/react-hooks";
import {Button, Confirm, Icon} from "semantic-ui-react";
import {FETCH_POSTS_QUERY} from "../util/graphql";
import MyPopup from "../util/MyPopup";

function DeleteButton({postId, commentId, callback}) {

    const [confirmOpen, setConfirmOpen] = useState(false)

    const mutation = commentId ? DELETE_COMMENT_MUTATION : DELETE_POST_MUTATION

    const [deletePostOrComment] = useMutation(mutation, {
        update(proxy) {
            setConfirmOpen(false)
            //Remove Post from cache
            if (!commentId){
                const data = {...proxy.readQuery({query: FETCH_POSTS_QUERY})}
                data.getPosts = data.getPosts.filter(post => post.id !== postId)
                proxy.writeQuery({query: FETCH_POSTS_QUERY, data})
            }
            if (callback) callback()
        },
        variables: {postId, commentId},
        onError(error) {
        }
    })

    return (
        <>
            <MyPopup content={commentId ? 'Delete Comment' : 'Delete Post'}>
                <Button as='div' color='red' onClick={() => setConfirmOpen(true)} floated='right'>
                    <Icon name='trash alternate outline' style={{margin: 0}}/>
                </Button>
            </MyPopup>
            <Confirm open={confirmOpen} onCancel={() => setConfirmOpen(false)} onConfirm={deletePostOrComment}/>
        </>
    );
}

const DELETE_POST_MUTATION = gql`
    mutation deletePost($postId: ID!){
        deletePost(postId: $postId)
    }
`

const DELETE_COMMENT_MUTATION = gql`
    mutation  deleteComment($postId: ID!, $commentId: ID!){
        deleteComment(postId: $postId, commentId: $commentId){
            id comments{id body username createdAt}
            commentCount
        }
    }
`

export default DeleteButton;
