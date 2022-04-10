<template>
  <Hospital v-if="!isSuper" />
  <Manage v-else />
</template>

<script>
  import Hospital from './hospital.vue';
  import Manage from './manage.vue';
  export default {
    computed: {
      isSuper() {
        return this.$store.state.userInfo.isSuper;
      },
    },
    components: { Hospital, Manage },
  };
</script>
