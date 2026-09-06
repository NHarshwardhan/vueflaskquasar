import api from "./axios"

// export const getEmployees = ()=>{
//       return api.get("/employees")
// }


// export const getEmployees = (search = "")=>{
//       return api.get("/employees",{
//             params:{
//                   search
//             }
//       })
// }


// export const getEmployees = (search = "", page=1, limit=5)=>{
//       return api.get("/employees",{
//             params:{
//                   search,
//                   page,
//                   limit
//             }
//       })
// }


export const getEmployees = (search = "", page=1, limit=5, sortBy="id", sortOrder="asc")=>{
      return api.get("/employees",{
            params:{
                  search,
                  page,
                  limit,
                  sort_by: sortBy,
                  sort_order: sortOrder
            }
      })
}

