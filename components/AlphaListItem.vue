<template>
  <div class="alpha-list-item">
    <slot name="content" data="aaa"></slot>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="scss">
  .alpha-list-item {
    width: 650px;
    height: 300px;
    margin: 20px auto 0;
    background-color: pink;
  }
</style>
