"use server"

import prisma from "@/prisma/prisma";
import { getDbUserId } from "./user.action";
import { revalidatePath } from "next/cache";




export async function createPost(content:string,image:string)  {
    try{
        const userId=await getDbUserId();
        if(!userId || typeof userId !== 'string'){
            return {
                success:false,
                message:"No user id found"
            }
        }

        const post=await prisma.post.create({
            data:{
                content,
                image,
                authorId:userId
            },
            include: {
                author: {
                    select: {
                        name: true,
                        username: true,
                        image: true,
                    }
                },
                comments: true,
                likes: true,
                _count: {
                    select: {
                        comments: true,
                        likes: true,
                    }
                }
            }
        })
       
        revalidatePath("/")
        return { success:true , post}
    }
    catch(error){
        console.log("Error in createPost",error); 
        return {
            success:false,
            message:"Error in creating post"
        }
    }
}


export  async function getPosts() {
        try{
            const posts=await prisma.post.findMany({
                orderBy:{createdAt:"desc"},
                include:{
                    author:{
                        select: {
                          id:true,
                            name:true,
                            username:true,
                            image:true,
                        }
                    },
                    comments:{
                        include:{
                            author:{
                                select: {
                                    id:true,
                                    name:true,
                                    username:true,
                                    image:true,
                                }
                            }
                        },
                        orderBy:{createdAt:"desc"}
                    },
                    likes:{
                        select:{
                            userId:true
                        }
                    },
                    _count:{
                        select: {
                            comments: true,
                            likes: true,
                        }
                    }
                }
            } )
            return { success:true, posts}

        }
        catch(error){
            return{
                success:false,
                message:"Error in getPosts"
            }
        }
} 

export async function toggleLike(postId: string) {
  try {
    const userId = await getDbUserId();
    if (!userId || typeof userId !== "string") return;

    // check if like exists
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { authorId: true },
    });

    if (!post) throw new Error("Post not found");

    if (existingLike) {
      // unlike
      await prisma.like.delete({
        where: {
          userId_postId: {
            userId,
            postId,
          },
        },
      });
    } else {
      // like and create notification (only if liking someone else's post)
      await prisma.$transaction([
        prisma.like.create({
          data: {
            userId,
            postId,
          },
        }),
        ...(post.authorId !== userId
          ? [
              prisma.notification.create({
                data: {
                  type: "LIKE",
                  userId: post.authorId, // recipient (post author)
                  creatorId: userId, // person who liked
                  postId,
                },
              }),
            ]
          : []),
      ]);
    }

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to toggle like:", error);
    return { success: false, error: "Failed to toggle like" };
  }
}


export  async function createComment(postId:string,comment:string){
  try{

    const userId=await getDbUserId();

    if(!userId || typeof userId !== 'string'){
        return {
            success:false,
            message:"No user id found"
        }
    }


    const post=await prisma.post.findUnique({
        where:{id:postId},
        select:{authorId:true}
    })

    if (!post) throw new Error("Post not found");


    const commentResp=await prisma.comment.create({
        data:{
            content:comment,
            authorId:userId,
            postId
        },
       })

  revalidatePath("/")
  return {success:true,comment:commentResp}


  }
  catch(error){

    console.error("Failed to create comment:", error);
    return { success: false, message: "Failed to create comment" };
  }
} 

export async function deletePost(postId: string) {
  try {

    const userId=await getDbUserId();

    if(!userId || typeof userId !== 'string'){
        return {
            success:false,
            message:"No user id found"
        }
    }

    const post=await prisma.post.findUnique({
        where:{id:postId},
        select:{authorId:true}
    })

    if (!post) throw new Error("Post not found");
    if (post.authorId !== userId) throw new Error("Unauthorized - no delete permission");


   await prisma.post.delete({
      where: { id: postId },
    });

    
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete post:", error);
    return { success: false, error: "Failed to delete post" };
  }
}