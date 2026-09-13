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
                      
                      <q-btn
                          label="Export CSV"
                          icon="download"
                          color="primary"
                          :loading="exportLoading"
                          @click="handleExportCSV"
                        
                      />
                               
                      

                <!-- Employee table -->
                     <q-table
                         :rows="employees"
                         :columns="columns"
                         :loading="loading"                         
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
import { exportFile } from 'quasar';

  const employees = ref([])
  const loading = ref(false)
  const error = ref("")
  const search = ref("")
  const exportLoading = ref(false)
  let searchTimer


  const wrapCsvValue = (value)=>{  // John  => "John"
    const formatted = value === null || value === undefined ? "" : String(value)
    return  `"${formatted.replace(/"/g, '""')}"`    
    // John "Johnny" Smith  =>  "John "Johnny" Smith" => confuse the csv parser
    // "John ""Johnny"" Smith" => valid csv formatting

  }

  const handleExportCSV = ()=>{
         /*
         [
          column -  "ID", "NAME", "EMAIL"
          row -  "101" "john"  "john@test.com"
         ] 
         */

      const content = [
        // creating header row
           columns.map(column => wrapCsvValue(column.label)).join(","),  //"ID", "NAME", "EMAIL"

        //Process Employees Rows   
        /*
          [
             header,
             row1,
             row2
          ]
        */ 
           ...employees.value.map(row=>
             
           //Process each employee's column

               columns.map(column=>{
                // 1st row-  column => ID-101 NAME-john EMAIL- john@fmail.com
                   /*
                     { name: "name", label: "Name", field: "name"}

                      column.field = "name"

                      row = {name ="John", email : "John@gmail.com"}

                      row[column.field] =>row["name"] => John 
                   
                   */
                  

                   /*
                      typeof "name" => string
                        column.field = "name"
                        row[column.field ?? column.name]
                        row["name"]
                        => John

                      =======================================
                      typeof function(){} => function
                        =>  column.field = (row) => row.name.toUpperCase()
                             row= {name: "John"}
                            
                            column.field(row)
                             => JOHN


                   */

                  const value = typeof column.field === "function"? column.field(row): row[column.field ?? column.name]


                  return wrapCsvValue(value)

               }).join(",")

           )

      ].join("\r\n") 
    
      const status = exportFile(
        "employees.csv",
        content,
        "text/csv;charset=utf-8"
        )

    
     if(status !== true){
        error.value  = "unable to export employees"
        console.error(stauts)
    }  


  }

 



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
      {name: "joining_date", label: "Joining_date", field: "joining_date" ,align: "left",sortable: true},

      
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