import type { SafeUserType } from "@/types/user"
import { createContext, useContext, useState, type ReactNode } from "react"

type AuthContextType = {
    userInfo: SafeUserType | null,
    setCredentials: (userInfo: SafeUserType) => void,
    logout: () => void
}

const initialContext: AuthContextType = {
    userInfo: null,
    setCredentials: () => {},
    logout: () => {}
}

const AuthContext = createContext<AuthContextType>(initialContext)

export const useAuthContext = () => useContext(AuthContext)

type Props = {
    children: ReactNode
}

const AuthProvider = ({ children }: Props) => {
    const [userInfo, setUserInfo] = useState<SafeUserType | null>(() => {
        const storedUserInfo = localStorage.getItem("userInfo")
        return storedUserInfo ? JSON.parse(storedUserInfo) : null
    })

    const setCredentials = (userInfo: SafeUserType) => {
        setUserInfo(userInfo)
        localStorage.setItem("userInfo", JSON.stringify(userInfo))
    }

    const logout = () => {
        setUserInfo(null)
        localStorage.removeItem("userInfo")
    }

    return (
        <AuthContext.Provider value={{ userInfo, setCredentials, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider