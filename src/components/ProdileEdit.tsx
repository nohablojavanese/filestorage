'use client'
import { useEffect } from 'react'
import { useProfile } from '@/lib/hooks/profile'
import { ProfileSchema } from '@/lib/schemas/profile'
import { User } from '@supabase/supabase-js'
import { Button, Input, Card, CardBody, CardHeader, CardFooter } from '@nextui-org/react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

export default function ProfileEdit({ user }: { user: User | null }) {
  const { profile, loading, getProfile, updateProfile } = useProfile(user)
  const { control, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(ProfileSchema),
    defaultValues: profile,
  })

  useEffect(() => {
    getProfile()
  }, [getProfile])

  useEffect(() => {
    reset(profile)
  }, [profile, reset])

  const onSubmit = async (data: any) => {
    const result = await updateProfile(data)
    if (result.success) {
      // You can add a success notification here
      console.log(result.message)
    } else {
      // You can add an error notification here
      console.error(result.message)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Button isLoading color="primary">Loading</Button>
      </div>
    )
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <h2 className="text-2xl font-bold">Edit Profile</h2>
      </CardHeader>
      <CardBody>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Email"
            id="email"
            isReadOnly
            value={user?.email || ''}
          />
          <Controller
            name="fullname"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                label="Full Name"
                id="fullname"
                value={field.value || ''}
                isInvalid={!!errors.fullname}
                errorMessage={errors.fullname?.message}
              />
            )}
          />
          <Controller
            name="username"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                label="Username"
                id="username"
                value={field.value || ''}
                isInvalid={!!errors.username}
                errorMessage={errors.username?.message}
              />
            )}
          />
          <Controller
            name="website"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                label="Website"
                id="website"
                value={field.value || ''}
                isInvalid={!!errors.website}
                errorMessage={errors.website?.message}
              />
            )}
          />
        </form>
      </CardBody>
      <CardFooter className="flex justify-between">
        <Button
          type="submit"
          isDisabled={isSubmitting}
          isLoading={isSubmitting}
          color="primary"
          onClick={handleSubmit(onSubmit)}
        >
          Update Profile
        </Button>
        <form action="/signout" method="post">
          <Button type="submit" color="danger">Sign out</Button>
        </form>
      </CardFooter>
    </Card>
  )
}