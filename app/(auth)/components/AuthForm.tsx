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
    <div className='sm:mx-auto sm:w-full sm:max-w-md'>
      <h2
        className='
            mb-6
            text-center
            text-3xl
            font-bold
            tracking-tight
          '>
        {action === 'LOGIN'
          ? 'Sign in to your account'
          : 'Create a new account'}
      </h2>
      <div className='card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100'>
        <div className='card-body'>
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

          <div className='divider'>Or continue with</div>

          <div className='flex w-full gap-2'>
            <div className='grid flex-grow place-items-center'>
              <AuthProviderButton
                icon={BsGithub}
                onClick={() => authProvider('github')}
              />
            </div>
            <div className='grid flex-grow place-items-center'>
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
            mt-5
            px-2
          '>
            <div>
              {action === 'LOGIN'
                ? 'New to Messenger?'
                : 'Already have an account?'}
            </div>
            <div onClick={toggleAction} className='underline cursor-pointer'>
              {action === 'LOGIN' ? 'Create an account' : 'Please login here!'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
