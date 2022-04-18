import { useState } from "react"
import useProjects from "../hooks/useProjects"

const PartnerForm = () => {

  const [email, setEmail] = useState('')

  const { showAlertSuccErr, sumbitPartner } = useProjects()

  const hanbleSubmit = async e => {
    e.preventDefault()

    if(email === ''){
      showAlertSuccErr({
        title: 'El email es obligatorio',
        icon: 'error'
      })
      return
    }

    sumbitPartner(email)
  }  

  return (
    <form className="bg-white py-10 px-5 w-full md:w-2/3 rounded-lg shadow" onSubmit={hanbleSubmit}>
      <div className='mb-5'>
        <label htmlFor="email" className='text-gray-700 uppercase font-bold text-sm'>Email Colaborador(a)</label>
        <input id='email' type='email' placeholder="Email del Usuario" className='border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md' value={email} onChange={ e => setEmail(e.target.value) } />
      </div>
      <input type="submit" className='bg-sky-600 hover:bg-sky-700 transition-colors w-full p-3 text-white uppercase font-bold cursor-pointer rounded text-sm' value='Buscar Colaborador(a)' />
    </form>
  )
}

export default PartnerForm