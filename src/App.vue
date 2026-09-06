<template>
       <q-layout>
           <!-- Header -->
            <q-header elevated>
                <q-toolbar>
                     <q-toolbar-title>
                         Employee Dashboard
                     </q-toolbar-title>
                </q-toolbar>
            </q-header>

            <!--Page Area  -->
            <q-page-container>
                  <EmployeeView/>
            </q-page-container>

       </q-layout>
</template>

<script setup>
import EmployeeView from './views/EmployeeView.vue';
  
</script>

<style scoped>

</style>

