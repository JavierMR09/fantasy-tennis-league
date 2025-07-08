'use client'

import React, {
  createContext,
  useContext,
  ReactNode,
} from 'react';
import useSWR from 'swr';
import { fetcher } from '../lib/fetcher';

type User = {
  id: string;
  email: string;
  name?: string;
  createdAt: string;
} | null;

type UserContextValue = {
  user: User;
  isLoading: boolean;
  isError: boolean;
};

const UserContext = createContext<UserContextValue | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const { data, error, isValidating } = useSWR<{ user: User }>(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/me`,
    fetcher,
    { revalidateOnFocus: false }
  );

  const value: UserContextValue = {
    user: data?.user ?? null,
    isLoading: !error && !data,
    isError: !!error,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return ctx;
}
