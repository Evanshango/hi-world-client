import React, {useContext} from 'react';
import {Button, Card, Icon, Image, Label} from "semantic-ui-react";
import moment from 'moment'
import {Link} from "react-router-dom";
import {AuthContext} from "../context/auth";
import LikeButton from './LikeButton'
import DeleteButton from "./DeleteButton";
import MyPopup from "../util/MyPopup";

function PostCard({post: {id, body, username, createdAt, likeCount, commentCount, likes}}) {
    const {user} = useContext(AuthContext)

    return (
        <Card fluid style={{minHeight: '15rem'}}>
            <Card.Content>
                <Image floated='right' size='mini' src='https://react.semantic-ui.com/images/avatar/large/jenny.jpg'
                       style={{borderRadius: '50%'}}/>
                <Card.Header>{username}</Card.Header>
                <Card.Meta as={Link} to={`/posts/${id}`}>{moment(createdAt).fromNow(true)}</Card.Meta>
                <Card.Description>{body}</Card.Description>
            </Card.Content>
            <Card.Content extra>
                <LikeButton user={user} post={{id, likeCount, likes}}/>
                <MyPopup content='Comment on Post' >
                    <Button as={Link} to={`/posts/${id}`} labelPosition='right' size='tiny'>
                        <Button color='blue' basic>
                            <Icon name='comments'/>
                        </Button>
                        <Label basic color='blue' pointing='left'>
                            {commentCount}
                        </Label>
                    </Button>
                </MyPopup>
                {user && user.username === username && <DeleteButton postId={id}/>}
            </Card.Content>
        </Card>
    );
}

export default PostCard;
