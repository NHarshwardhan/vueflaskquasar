<!-- <template>
    <div>
         <h1>Employee Dashboard</h1>

         <p v-if="loading">Loading...</p>

         <p v-if="error">{{ error }}</p>

         <table v-if="!loading" border="1">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Department</th>
                </tr>
            </thead>
             <tbody>
                 <tr v-for="employee in employees" :key="employee.id">
                     <td>{{ employee.id }}</td>
                     <td>{{ employee.name }}</td>
                     <td>{{ employee.email }}</td>
                     <td>{{ employee.department }}</td>
                 </tr>
             </tbody>
         </table>
           
    </div>
</template>

<script setup>
import { getEmployees } from '@/api/employeeApi';
import { onMounted, ref } from 'vue';

  const employees = ref([])
  const loading = ref(false)
  const error = ref("")


const fetchEmployees = async()=>{
       
       loading.value = true
       error.value = ""

       try{
           const response =  await getEmployees()
           employees.value = response.data
       }
       catch(err){
            error.value = "Unable to load employees"
            console.error(err);
       }
       finally{
         loading.value= false
       }
      

  }

onMounted(()=>{
  fetchEmployees()
})


</script>

<style lang="scss" scoped>

</style> -->


<!-- ================================== -->
 <template>
       <q-page class="q-pa-md">
        
         <div class="text-h4 q-mb-lg">
             Employee Dashboard
         </div>

         <!-- content -->
        <!-- Dahsboard Panels -->

         <div class="row q-col-gutter-md">
             <!-- q- Quasar
                    col- columns
                    gutter- gap/space
                    md - medium size 
             -->
             <!-- Total Employees -->
             <div class="col-12 col-md-4">
                    
                  <q-card bordered>
                        <q-card-section>
                                <div class="text-subtitle1">Total Employee</div>
                                <div class="text-h3">{{ totalEmployees }}</div>
                        </q-card-section>
                  </q-card>
             </div>  

              <!-- IT Employees -->
             <div class="col-12 col-md-4">
                    
                  <q-card bordered>
                        <q-card-section>
                                <div class="text-subtitle1">IT Employee</div>
                                <div class="text-h3">{{ itEmployees }}</div>
                        </q-card-section>
                  </q-card>
             </div>  

              <!-- HR Employees -->
             <div class="col-12 col-md-4">
                    
                  <q-card bordered>
                        <q-card-section>
                                <div class="text-subtitle1">HR Employee</div>
                                <div class="text-h3">{{ hrEmployees }}</div>
                        </q-card-section>
                  </q-card>
             </div>  


         </div>


         <!-- Error Message -->
          <q-banner v-if="error" class="bg-negative text-white q-mt-md">
                {{ error }}
          </q-banner>


          <!-- Employee Table -->
           <q-card bordered class="q-mt-lg">
               <q-card-section>
                   <div class="text-h6">Employee List</div>
               </q-card-section>

               <q-separator/>

               <q-card-section>
                   <!-- search -->
                     <q-input
                          v-model="search"
                          label="Search Employees"
                          outlined
                          dense
                          clearable
                          class="q-mb-md"
                          @update:model-value="handleSearch"
                     
                     >
                       <template #prepend>
                            <q-icon name="search"/>
                       </template>
                    
                    </q-input>
                      
                <!-- Employee table -->
                     <q-table
                         :rows="employees"
                         :columns="columns"
                         
                         row-key="id"
                         flat
                         v-model:pagination="pagination"
                         @request="fetchEmployees"
                                            
                     />                          
                       
               </q-card-section>

           </q-card>

       </q-page>
</template>

<script setup>
import { getEmployees } from '@/api/employeeApi';
import { computed, onMounted, ref } from 'vue';

  const employees = ref([])
  const loading = ref(false)
  const error = ref("")
  const search = ref("")
  let searchTimer

// const fetchEmployees = async()=>{
       
//        loading.value = true
//        error.value = ""

//        try{
//            const response =  await getEmployees()
//            employees.value = response.data
//        }
//        catch(err){
//             error.value = "Unable to load employees"
//             console.error(err);
//        }
//        finally{
//          loading.value= false
//        }
      

//   }

onMounted(()=>{
  fetchEmployees()
})

// const totalEmployees = computed(()=>{
//     return employees.value.length
// }) 

const pagination = ref({
    page: 1,
    rowsPerPage: 5,
    rowsNumber:0
})

const totalEmployees = computed(()=>{
    return pagination.value.rowsNumber
}) 


const itEmployees = computed(()=>{
     return employees.value.filter(employee=> employee.department === "IT").length
})

const hrEmployees = computed(()=>{
     return employees.value.filter(employee=> employee.department === "HR").length
})

const columns = [
      {name: "id", label: "ID", field: "id" ,align: "left",sortable: true},
      {name: "name", label: "Name", field: "name" ,align: "left",sortable: true},
      {name: "email", label: "Email", field: "email" ,align: "left",sortable: true},
      {name: "department", label: "Department", field: "department" ,align: "left",sortable: true},
      
]


// const fetchEmployees = async()=>{
       
//        loading.value = true
//        error.value = ""

//        try{
//            const response =  await getEmployees(search.value)
//            employees.value = response.data
//        }
//        catch(err){
//             error.value = "Unable to load employees"
//             console.error(err);
//        }
//        finally{
//          loading.value= false
//        }
      

//   }

// const fetchEmployees = async()=>{
       
//        loading.value = true
//        error.value = ""

//        try{
//            const response =  await getEmployees(search.value, pagination.value.page, pagination.value.rowsPerPage)
//            employees.value = response.data.data
//            pagination.value.rowNumber = response.data.total
//        }
//        catch(err){
//             error.value = "Unable to load employees"
//             console.error(err);
//        }
//        finally{
//          loading.value= false
//        }
      

//   }


const fetchEmployees = async(props=null)=>{
       
    if(props){
        console.log(props);
        pagination.value = props.pagination
    }

       loading.value = true

       try{

           const sortBy = pagination.value.sortBy || "id"
           const sortOrder = pagination.value.descending? "desc" : "asc"
           
           const response =  await getEmployees(
                                  search.value, 
                                  pagination.value.page, 
                                  pagination.value.rowsPerPage,
                                  sortBy,
                                  sortOrder
                                
                                )
           employees.value = response.data.data
           pagination.value.rowsNumber = response.data.total
       }
       catch(err){
            error.value = "Unable to load employees"
            console.error(err);
       }
       finally{
         loading.value= false
       }
      

  }

// const handleSearch = ()=>{
//     //   /employee?search="John"
//     fetchEmployees()
// }

const handleSearch = ()=>{
     clearTimeout(searchTimer)

     searchTimer = setTimeout(()=>{
         pagination.value.page = 1
         fetchEmployees()
     }, 500)
}


</script>

<style lang="scss" scoped>

</style>