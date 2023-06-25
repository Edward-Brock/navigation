<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { io } from 'socket.io-client'

const websocket_server = import.meta.env.VITE_APP_WEBSOCKET_SERVER_URL
const socket = io(websocket_server)
let deviceInfo = ref()

onMounted(() => {
  /**
   * 处理连接成功事件
   */
  socket.on('connect', () => {
    // console.log('WebSocket 已成功连接');
    socketOn()
  });
})

function socketOn() {
  socket.on('device', (data) => {
    // console.log('Received message:', data);
    deviceInfo.value = data;
  });
  socket.emit('device');
}

onUnmounted(() => {
  socket.close();
});
</script>

<template>
  <div class="flex flex-row font-mono">
    <div class="flex flex-row items-center mr-4" v-for="(item,index) in deviceInfo">
      <div class="text-xs text-gray-300 mr-2">{{ item.name }}</div>
      <div class="text-xs text-gray-400">{{ deviceInfo[index]['num_value'] }}</div>
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>