"use client"
import getPosts from '@/actions/post.action'
import { useUser } from '@clerk/nextjs'

import React, { useState } from 'react'

interface Post {
    id: string;
    content: string;
    authorId: string;
    createdAt: Date;
    updatedAt: Date;
    author: {
        id: string;
        name: string;
        image: string;
    };
    _count: {
        likes: number;
        comments: number;
    };
    comments: {
        id: string;
        content: string;
        authorId: string;
        createdAt: Date;
        author: {
            name: string;
            image: string;
        };
    }[];
}

const PostCard = ({ post, dbUserId }: {
    post: Post,
    dbUserId: string | null
}) => {

    const { user } = useUser();
    const [newComment, setNewComment] = useState('');
    const [isCommenting, setIsCommenting] = useState(false);
    const [isLiking, setIsLiking] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [hasLiked, setHasLiked] = useState(false);
    const [optimisticLikes, setOptimisticLikes] = useState(post._count.likes);

    const handleLike = async () => {
        if (isLiking) return
        try {
            setIsLiking(true);
            setHasLiked(prev => !prev);

            setOptimisticLikes(prev => prev + (hasLiked ? -1 : 1));
            setHasLiked(true);
        }
        catch (error) {
            console.log("Error in handleLike", error);
        }
    }

    const handleComment = async () => { }

    const handleDeletePost = async () => { }


    return (
        <div>

        </div>
    )
}

export default PostCard
