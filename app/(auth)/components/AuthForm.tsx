'use client';

import axios from 'axios';
import { signIn, useSession } from 'next-auth/react';
import { useCallback, useEffect, useState } from 'react';
import { BsGithub, BsGoogle } from 'react-icons/bs';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';

import Input from '@/app/components/inputs/Input';
import AuthProviderButton from './AuthProviderButton';
import Button from '@/app/components/Button';
import { toast } from 'react-hot-toast';

type Action = 'LOGIN' | 'SIGNUP';

const AuthForm = () => {
  const session = useSession();
  const router = useRouter();
  const [action, setAction] = useState<Action>('LOGIN');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (session?.status === 'authenticated') {
      router.push('/chats');
    }
  }, [session?.status, router]);

  const toggleAction = useCallback(() => {
    if (action === 'LOGIN') {
      setAction('SIGNUP');
    } else {
      setAction('LOGIN');
    }
  }, [action]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);

    if (action === 'SIGNUP') {
      axios
        .post('/api/signup', data)
        .then(() =>
          signIn('credentials', {
            ...data,
            redirect: false,
          })
        )
        .then((callback) => {
          if (callback?.error) {
            toast.error('Invalid credentials!');
          }

          if (callback?.ok) {
            toast.success('Logged in!');
            router.push('/chats');
          }
        })
        .catch(() => toast.error('Something went wrong!'))
        .finally(() => setIsLoading(false));
    }

    if (action === 'LOGIN') {
      signIn('credentials', {
        ...data,
        redirect: false,
      })
        .then((callback) => {
          if (callback?.error) {
            toast.error('Invalid credentials!');
          }

          if (callback?.ok) {
            router.push('/chats');
          }
        })
        .finally(() => setIsLoading(false));
    }
  };

  const authProvider = (provider: string) => {
    setIsLoading(true);

    signIn(provider, { redirect: false })
      .then((callback) => {
        if (callback?.error) {
          toast.error('Invalid credentials!');
        }

        if (callback?.ok) {
          toast.success('Logged in!');
          router.push('/chats');
        }
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'>
      <div
        className='
        bg-white
          px-4
          py-8
          shadow
          sm:rounded-lg
          sm:px-10
        '>
        <form className='space-y-6' onSubmit={handleSubmit(onSubmit)}>
          {action === 'SIGNUP' && (
            <Input
              disabled={isLoading}
              register={register}
              errors={errors}
              required
              id='name'
              label='Name'
            />
          )}
          <Input
            disabled={isLoading}
            register={register}
            errors={errors}
            required
            id='email'
            label='Email address'
            type='email'
          />
          <Input
            disabled={isLoading}
            register={register}
            errors={errors}
            required
            id='password'
            label='Password'
            type='password'
          />
          <div>
            <Button disabled={isLoading} fullWidth type='submit'>
              {action === 'LOGIN' ? 'Sign In' : 'Sign Up'}
            </Button>
          </div>
        </form>

        <div className='mt-6'>
          <div className='relative'>
            <div
              className='
                absolute
                inset-0
                flex
                items-center
              '>
              <div className='w-full border-t border-gray-300' />
            </div>
            <div className='relative flex justify-center text-sm'>
              <span className='bg-white px-2 text-gray-500'>
                Or continue with
              </span>
            </div>
          </div>

          <div className='mt-6 flex gap-2'>
            <AuthProviderButton
              icon={BsGithub}
              onClick={() => authProvider('github')}
            />
            <AuthProviderButton
              icon={BsGoogle}
              onClick={() => authProvider('google')}
            />
          </div>
        </div>
        <div
          className='
            flex
            gap-2
            justify-center
            text-sm
            mt-6
            px-2
            text-gray-500
          '>
          <div>
            {action === 'LOGIN'
              ? 'New to Messenger?'
              : 'Already have an account?'}
          </div>
          <div onClick={toggleAction} className='underline cursor-pointer'>
            {action === 'LOGIN' ? 'Create an account' : 'Login'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
