'use client';

import { signIn, useSession } from 'next-auth/react';
import { useReducer, useEffect, useState } from 'react';
import { BsGithub, BsGoogle } from 'react-icons/bs';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';

import Input from '@/app/components/inputs/Input';
import AuthProviderButton from './AuthProviderButton';
import Button from '@/app/components/Button';
import { toast } from 'react-hot-toast';

type AuthAction = 'LOGIN' | 'SIGNUP';

const initialState = { isLoading: false };

type State = {
  isLoading: boolean;
};

type Action = {
  type: 'SET_LOADING';
  payload: boolean;
};

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
};

const AuthForm = () => {
  const session = useSession();
  const router = useRouter();
  const [action, setAction] = useState<AuthAction>('LOGIN');
  const [state, dispatch] = useReducer(reducer, initialState);

  const toggleAction = () => {
    if (action === 'LOGIN') {
      setAction('SIGNUP');
    } else {
      setAction('LOGIN');
    }
  };

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
    dispatch({ type: 'SET_LOADING', payload: true });

    const signInCallback = (callback: any) => {
      if (callback?.error) {
        toast.error('Invalid credentials!');
      }

      if (callback?.ok) {
        router.push('/chats');
      }
    };

    if (action === 'SIGNUP') {
      fetch('/api/signup', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Invalid credentials!');
          }
          return response.json();
        })
        .then(() => signIn('credentials', { ...data, redirect: false }))
        .then(signInCallback)
        .catch(() => toast.error('Something went wrong!'))
        .finally(() => dispatch({ type: 'SET_LOADING', payload: false }));
    }

    if (action === 'LOGIN') {
      signIn('credentials', { ...data, redirect: false })
        .then(signInCallback)
        .finally(() => dispatch({ type: 'SET_LOADING', payload: false }));
    }
  };

  const authProvider = (provider: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });

    signIn(provider, { redirect: false })
      .then((callback) => {
        if (callback?.error) {
          toast.error('Invalid credentials!');
        }

        if (callback?.ok && !callback?.error) {
          toast.success('Logged in!');
        }

        if (callback?.ok) {
          router.push('/chats');
        }
      })
      .finally(() => dispatch({ type: 'SET_LOADING', payload: false }));
  };

  useEffect(() => {
    if (!state.isLoading && session?.status === 'authenticated') {
      router.push('/chats');
    }
  }, [state.isLoading, session?.status, router]);

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
              disabled={state.isLoading}
              register={register}
              errors={errors}
              required
              id='name'
              label='Name'
            />
          )}
          <Input
            disabled={state.isLoading}
            register={register}
            errors={errors}
            required
            id='email'
            label='Email address'
            type='email'
          />
          <Input
            disabled={state.isLoading}
            register={register}
            errors={errors}
            required
            id='password'
            label='Password'
            type='password'
          />
          <div>
            <Button disabled={state.isLoading} fullWidth type='submit'>
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
