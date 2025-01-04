import PropTypes from 'prop-types'
import queryString from 'query-string';
import { useNavigate, useSearchParams } from 'react-router';


const CategoryBox = ({ label, icon: Icon }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate()

  const categoryName = searchParams.get('category')

  const handleClick = () => {
    const searchQuery = { category: label };

    const stringified = queryString.stringifyUrl({
      url: '/',
      query: searchQuery
    })

    navigate(stringified)

  }


  return (
    <div
      onClick={handleClick}
      className={`flex 
  flex-col 
  items-center 
  justify-center 
  gap-2
  p-3
  border-b-2
  hover:text-neutral-800
  transition
  cursor-pointer ${categoryName === label && 'border-b-2 border-slate-800 text-slate-950'}`}
    >
      <Icon size={26} />
      <div className='text-sm font-medium'>{label}</div>
    </div>
  )
}

CategoryBox.propTypes = {
  label: PropTypes.string,
  icon: PropTypes.elementType,
}

export default CategoryBox
