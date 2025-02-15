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


export default async function getPosts() {
        try{
            const post=await prisma.post.findMany({
                orderBy:{createdAt:"desc"},
                include:{
                    author:{
                        select: {
                          
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
            return { success:true, post}

        }
        catch(error){
            return{
                success:false,
                message:"Error in getPosts"
            }
        }
} 