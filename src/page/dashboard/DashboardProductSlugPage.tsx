import React from 'react'
import { useParams } from 'react-router'
import { FormProducts } from '../../components/dashboard/products/FormProducts'

export const DashboardProductSlugPage = () => {

    const { slug } = useParams()
  return (
     <FormProducts titleForm={`Editar producto: ${slug}`} />
  )
}
