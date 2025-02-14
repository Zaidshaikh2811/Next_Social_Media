import prisma from "@/prisma/prisma";
import { getDbUserId } from "./user.action";
import { revalidatePath } from "next/cache";




export async function createPost(content:string,image:string){
    try{
        const userId=await getDbUserId();
        if(!userId){
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
            }
        })
        revalidatePath("/")
        return { result:true,post}
    }
    catch(error){
        console.log("Error in createPost",error); 
        return {
            success:false,
            message:"Error in creating post"
        }
    }
}