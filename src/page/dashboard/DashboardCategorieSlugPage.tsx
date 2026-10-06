 import { useParams } from 'react-router'
 import { FormCategories } from '../../components/dashboard/category/FormCategories'

export const DashboardCategorieSlugPage = () => {

    const { slug } = useParams()
  return (
     <FormCategories titleForm={`Editar categoría: ${slug}`} />
  )
}
