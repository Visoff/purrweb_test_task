import {atom} from 'jotai'

export const UserTokenStore = atom<string | null>(localStorage.getItem('token') || null)
