import React, {useContext, useRef, useState} from 'react';
import gql from 'graphql-tag'
import {useMutation, useQuery} from "@apollo/react-hooks";
import {Button, Icon, Image, Card, Grid, Label, Form} from "semantic-ui-react";
import moment from "moment";
import LikeButton from "../LikeButton";
import {AuthContext} from "../../context/auth";
import DeleteButton from "../DeleteButton";
import MyPopup from "../../util/MyPopup";

function SinglePost(props) {
    const {user} = useContext(AuthContext)
    const postId = props.match.params.postId

    const commentInputRef = useRef(null)

    const [comment, setComment] = useState('')

    const {data} = useQuery(FETCH_POST_QUERY, {
        variables: {postId},
        onError(error) {
        }
    })

    const [submitComment] = useMutation(CREATE_COMMENT_MUTATION, {
        update() {
            setComment('')
            commentInputRef.current.blur()
        },
        variables: {
            postId,
            body: comment
        },
        onError(err) {
        }
    })

    function deletePostCallback() {
        props.history.push('/')
    }

    let postMarkup;
    if (data === undefined) {
        postMarkup = <p>Loading Post...</p>
    } else {
        const {id, body, createdAt, username, likes, comments, likeCount, commentCount} = data.getPost
        postMarkup = (
            <Grid>
                <Grid.Row>
                    <Grid.Column width={2}>
                        <Image floated='right' size='small'
                               src='https://react.semantic-ui.com/images/avatar/large/jenny.jpg'
                               style={{borderRadius: '50%'}}/>
                    </Grid.Column>
                    <Grid.Column width={10}>
                        <Card fluid>
                            <Card.Content>
                                <Card.Header>{username}</Card.Header>
                                <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
                                <Card.Description>{body}</Card.Description>
                            </Card.Content>
                            <hr/>
                            <Card.Content extra>
                                <LikeButton user={user} post={{id, likeCount, likes}}/>
                                <MyPopup content='Comment on Post'>
                                    <Button as='div' labelPosition='right' disabled={true}>
                                        <Button basic color='blue'>
                                            <Icon name='comments'/>
                                        </Button>
                                        <Label basic color='blue' pointing='left'>
                                            {commentCount}
                                        </Label>
                                    </Button>
                                </MyPopup>
                                {user && user.username === username && (
                                    <DeleteButton postId={id} callback={deletePostCallback}/>
                                )}
                            </Card.Content>
                        </Card>
                        {user && (
                            <Card fluid>
                                <Card.Content>
                                    <p>Post a Comment</p>
                                    <Form>
                                        <div className='ui action input fluid'>
                                            <input type="text" placeholder='Comment...' name='comment' value={comment}
                                                   onChange={event => setComment(event.target.value)}
                                                   ref={commentInputRef}/>
                                            <button type='submit' className='ui button blue'
                                                    disabled={comment.trim() === ''} onClick={submitComment}>
                                                Submit
                                            </button>
                                        </div>
                                    </Form>
                                </Card.Content>
                            </Card>
                        )}
                        {comments.map(comment => (
                            <Card fluid key={comment.id}>
                                <Card.Content>
                                    {user && user.username === comment.username && (
                                        <DeleteButton postId={id} commentId={comment.id}/>
                                    )}
                                    <Card.Header>{comment.username}</Card.Header>
                                    <Card.Meta>{moment(comment.createdAt).fromNow()}</Card.Meta>
                                    <Card.Description>{comment.body}</Card.Description>
                                </Card.Content>
                            </Card>
                        ))}
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )
    }
    return postMarkup
}

const FETCH_POST_QUERY = gql`
    query($postId: ID!){
        getPost(postId: $postId){
            id body createdAt username likeCount
            likes{username}
            commentCount
            likeCount
            comments{id username body createdAt}
        }
    }
`

const CREATE_COMMENT_MUTATION = gql`
    mutation ($postId: ID!, $body: String!){
        createComment(postId: $postId, body: $body){
            id
            comments{id body createdAt username}
            commentCount
        }
    }
`

export default SinglePost;
