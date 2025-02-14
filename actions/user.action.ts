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
        return {
            success:false,
            message:"Error in getUserByClerkId"
        }
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
       return{
           success:false,
           message:"Error in getDbUserId"
       }
    }
}


export async function getRandomUser()
{
    try{
        const userId=await getDbUserId();
        if(!userId){
            return {
                success:false,
                message:"No user id found"
            }
        }
        const users=await prisma.user.findMany({
            where:{
                AND:[
                    // { NOT:{id:userId} },
                    {
                        NOT:{
                            followers:{some:{followerId:userId}}
                        }
                    }
                ]
            },
            select:{
                id:true,
                name:true,
                username:true,
                image:true,
                _count:{
                    select: {
                        followers: true,
                    }
                }
            }
        });

        return {
            success:true,
            users
        }
      

    }catch(error){
        return {
            success:false,
            message:"Error in getRandomUser"
        }
    }
}

export async function toggleFollow(targetUserId:string){
    try{

        const userId=await getDbUserId();
        if(!userId){
            return {
                success:false,
                message:"No user id found"
            }
        }
        if(userId===targetUserId){
            return {
                success:false,
                message:"You can't follow yourself"
            }
        }
        const follow=await prisma.follows.findUnique({
            where: {
                followerId_followingId: {
                    followerId: userId,
                    followingId: targetUserId,
                }
            }
        } 
        );


            if(follow){
                await prisma.follows.delete({
                    where: {
                        followerId_followingId: {
                            followerId: userId,
                            followingId: targetUserId,
                        }
                    }
                });
            }else{
                await prisma.$transaction([
                    prisma.follows.create({
                        data: {
                            followerId: userId,
                            followingId: targetUserId,
                        },
                    }),

                    prisma.notification.create({
                        data: {
                            type: "FOLLOW",
                            userId: targetUserId,
                            creatorId: userId,
                        },
                    })
                    
                ])

            }

            return {
                success:true
                
            }

    }catch(err){
        return{
            success:false,
            message:"Error in toggleFollow"
        }
    }
}