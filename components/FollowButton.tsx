"use client"

import React, { useState } from 'react'
import { Button } from './ui/button'
import { Loader2Icon } from 'lucide-react'
import toast from 'react-hot-toast'
import { toggleFollow } from '@/actions/user.action'

const FollowButton = ({ userId }: {
    userId: string
}) => {

    const [isLoading, setIsLoading] = useState(false)

    const handleFollow = async () => {
        setIsLoading(true)
        try {
            const resp = await toggleFollow(userId)
            if (!resp.success) {
                throw new Error(resp.message)
            }
            toast.success("Followed successfully")
        }
        catch (error) {


            toast.error(error.message)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Button
            disabled={isLoading}
            className='w-20'
            onClick={handleFollow}
            size={"sm"}
            variant={"outline"}>

            {
                isLoading ? (
                    <Loader2Icon className='size-4
                    animate-spin
                    '

                    />
                ) : (
                    "Follow"
                )

            }
        </Button>
    )
}

export default FollowButton
