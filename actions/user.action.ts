"use server"


import prisma from "@/prisma/prisma";
import { auth, currentUser } from "@clerk/nextjs/server"

export default  async function syncUser(){
    try{
        const {userId}=await auth();
        const user=await currentUser()

        if(!userId || !user){
            return
        }
        const existingUser=await prisma.user.findUnique({
            where: {
                clerkId: userId,
            },
        })

        if(existingUser){
            return existingUser;
             
        }


        const dbUser=await prisma.user.create({
            data: {
                clerkId:userId,
                name:`${user.firstName || ""} ${user.lastName || ""}`,
                username:user.username ?? user.emailAddresses[0].emailAddress.split("@")[0],
                email:user.emailAddresses[0].emailAddress,
                image:user.imageUrl,
            }
        })
 

        return dbUser;
    }
    catch(error){
        console.log("Error in syncUser",error); 
    }


}


export async function getUserByClerkId(clerkId:string){
    try{
        const user=await prisma.user.findUnique({
            where: {
                clerkId: clerkId,
            },
            include:{
                _count:{
                    select: {
                        posts: true,
                        followers: true,
                        following: true,
                    }
                }
            }
        })
        return user;
    }
    catch(error){
        console.log("Error in getUserByClerkId",error); 
    }
}


export async function getDbUserId(){
    try{
       const {userId}=await auth();
       
       if(!userId){
        throw new Error("No user id found");
       }

       const user=await prisma.user.findUnique({
        where: {
            clerkId: userId,
        },
    })
    if(!user){
        throw new Error("No user found");
    }

    return user.id;

    }
    catch(error){
        console.log("Error in getDbUserId",error); 
    }
}


