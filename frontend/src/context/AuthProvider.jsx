import { useState, useEffect, createContext } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import clientAxios from "../config/clientAxios"

const AuthContext = createContext()

const AuthProvider = ({ children }) => {

  const [auth, setAuth] = useState({})
  const [load, setLoad] = useState(true)

  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const authUser = async () => {
      const token = localStorage.getItem('token')
      if(!token){
        setLoad(false)
        return
      } 

      try {
        const url = '/users/profile'
        const config = {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
        const { data } = await clientAxios(url, config)
        setAuth(data)
        if(!location.pathname.match(/projects/ig)) navigate('/projects')
      }catch (error) {
        setAuth({})
      } 
    
      setLoad(false)
    }
    authUser()
  }, [])

  return (
    <AuthContext.Provider
      value={{
        auth,
        setAuth,
        load,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export { AuthProvider }

export default AuthContext