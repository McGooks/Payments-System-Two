// import React, {useContext, useRef, useEffect} from 'react'
// import UserAdminContext from "../../context/user/userAdminContext"

// const UserAdminFilter = () => {
//     const userContext = useContext(UserAdminContext)
//     const text = useRef("")

//     const {filterUsers, clearFilter, filtered} = userContext

//     useEffect(() => {
//         if(filtered === null) {
//             text.current.value=""
//         }
//     })

//     const onChange = (e) => {
//         if(text.current.value !== ""){
//             filterUsers(e.target.value)
//         } else {
//             clearFilter()
//         }
//     }

//     return (
//         <form>
//             <input ref={text} type="text" placeholder="Filter Users..." onChange={onChange}/>
//         </form>
//     )
// }
// export default UserAdminFilter
