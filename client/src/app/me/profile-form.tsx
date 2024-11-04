"use client"

import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { LoginBody, LoginBodyType } from '@/schemaValidations/auth.schema';
import { useToast } from '@/hooks/use-toast';
import authApiRequest from '@/apiRequests/auth';
import { useRouter } from 'next/navigation';
import { handleErrorApi } from '@/lib/utils';
import { AccountResType, UpdateMeBody, UpdateMeBodyType } from '@/schemaValidations/account.schema';
import accountApiRequest from '@/apiRequests/account';

type Profile = AccountResType['data']

const ProfileForm = ({
    profile
}: {
    profile: Profile
}) => {
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();
    const router = useRouter()
    // 1. Define your form.
    const form = useForm<UpdateMeBodyType>({
        resolver: zodResolver(UpdateMeBody),
        defaultValues: {
            name: profile.name,
        },
    })

    // 2. Define a submit handler.
    async function onSubmit(values: UpdateMeBodyType) {
        if (loading) return
        setLoading(true)
        try {
            const result = await accountApiRequest.updateMe(values)

            toast({
                description: result.payload.message
            })

            router.refresh()

        } catch (error: any) {
            handleErrorApi({
                error,
                setError: form.setError
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 max-w-[600px] flex-shrink-0 w-full" noValidate>

                <FormLabel>Email</FormLabel>
                <FormControl>
                    <Input placeholder="shadcn" type='email' value={profile.email} readOnly />
                </FormControl>
                <FormMessage />

                <FormField
                    control={form.control}
                    name='name'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name:</FormLabel>
                            <FormControl>
                                <Input placeholder='name' type='text' {...field} />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <Button type="submit" className='!mt-8 w-full'>Cap nhat</Button>
            </form>
        </Form>
    );
}

export default ProfileForm;