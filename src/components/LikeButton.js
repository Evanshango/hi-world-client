import React, {useState, useEffect} from 'react';
import gql from 'graphql-tag'
import {Button, Icon, Label} from "semantic-ui-react";
import {useMutation} from "@apollo/react-hooks";
import {Link} from "react-router-dom";
import MyPopup from "../util/MyPopup";

function LikeButton({post: {id, likes, likeCount}, user}) {
    const [liked, setLiked] = useState(false)
    useEffect(() => {
        if (user && likes.find(like => like.username === user.username)) {
            setLiked(true)
        } else setLiked(false)
    }, [user, likes])

    const [likePost] = useMutation(LIKE_POST_MUTATION, {
        variables: {postId: id},
        onError(err) {
        }
    })

    const likeButton = user ? (
        liked ? (
            <Button color='red'>
                <Icon name='heart'/>
            </Button>
        ) : (
            <Button color='red' basic>
                <Icon name='heart'/>
            </Button>
        )
    ) : (
        <Button as={Link} to='/login' color='red' basic>
            <Icon name='heart'/>
        </Button>
    )

    const displayMsg = user ? (
        liked ? (
            'Unlike Post'
        ) : (
            'Like Post'
        )
    ) : (
        'Like Post'
    )
    return (
        <>
            <MyPopup content={displayMsg}>
                <Button as='div' labelPosition='right' size='tiny' onClick={likePost}>
                    {likeButton}
                    <Label as='a' basic color='red' pointing='left'>
                        {likeCount}
                    </Label>
                </Button>
            </MyPopup>
        </>
    );
}

const LIKE_POST_MUTATION = gql`
    mutation likePost($postId: ID!){
        likePost(postId: $postId){
            id
            likes{id username}
            likeCount
        }
    }
`

export default LikeButton;
