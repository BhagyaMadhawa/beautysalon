import {useNavigate} from "react-router-dom";
import '../App.css'

import SearchResults from '../components/Search/searchResults';

const Search = () =>
{
    const navigate = useNavigate();

    return(
     <>
      <SearchResults/>
    </>

    )
}

export default Search;