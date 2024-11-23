<template>
  <div id="app">
    <!-- Tukaj se bo prikazala komponenta glede na trenutno pot -->
    <router-view></router-view>
  </div>
</template>

<script>

export default {
  name: "App",
  
};
</script>

<style>
body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
  text-align: center;
}
</style>
