import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { persist } from 'zustand/middleware';
import { useShallow } from 'zustand/react/shallow';

type UserState = {
  user: string | null;
};

type UserActions = {
  signIn: (newUser: string) => void;
  signOut: () => void;
};

export interface UserStore extends UserState, UserActions {}

const intialState = {
  user: null,
};

export const useUserStore = create<UserStore>()(
  immer(
    persist(
      set => ({
        ...intialState,
        signIn: newUser =>
          set(state => {
            state.user = newUser;
          }),
        signOut: () =>
          set(state => {
            state.user = null;
          }),
      }),
      { name: 'userStore' },
    ),
  ),
);

export const useUserActions = () =>
  useUserStore(useShallow(state => ({ signIn: state.signIn, signOut: state.signOut })));
