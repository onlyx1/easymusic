<template>
  <el-dialog v-model="dialogVisible" title="登录/注册" width="30%" :close-on-click-modal="false">
    <el-tabs v-model="activeTab">
      <el-tab-pane label="登录" name="login">
        <el-form :model="loginForm" label-width="80px">
          <el-form-item label="账号">
            <el-input v-model="loginForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码">
            <el-input v-model="loginForm.password" type="password"></el-input>
          </el-form-item>
          <el-form-item label="验证码">
            <el-input v-model="loginForm.captcha" class="captcha-input"></el-input>
            <div class="captcha-image">验证码图片</div>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="注册" name="register">
        <el-form :model="registerForm" label-width="80px">
          <el-form-item label="账号">
            <el-input v-model="registerForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码">
            <el-input v-model="registerForm.password" type="password"></el-input>
          </el-form-item>
          <el-form-item label="确认密码">
            <el-input v-model="registerForm.confirmPassword" type="password"></el-input>
          </el-form-item>
          <el-form-item label="验证码">
            <el-input v-model="registerForm.captcha" class="captcha-input"></el-input>
            <div class="captcha-image">验证码图片</div>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeDialog">关闭</el-button>
        <el-button type="primary" @click="submitForm">{{ activeTab === 'login' ? '登录' : '注册' }}</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, inject, watch } from 'vue'

const dialogVisible = inject('showLoginRegister')
const loginRegisterTab = inject('loginRegisterTab')  // 注入 loginRegisterTab
const activeTab = ref('login')

// 监听 loginRegisterTab 的变化
watch(loginRegisterTab, (newValue) => {
  activeTab.value = newValue
})

const loginForm = ref({
  username: '',
  password: '',
  captcha: ''
})

const registerForm = ref({
  username: '',
  password: '',
  confirmPassword: '',
  captcha: ''
})

const closeDialog = () => {
  dialogVisible.value = false
}

const submitForm = () => {
  // 这里实现登录或注册逻辑
  console.log(activeTab.value === 'login' ? '登录' : '注册', activeTab.value === 'login' ? loginForm.value : registerForm.value)
  // 暂时先关闭对话框
  closeDialog()
}
</script>

<style scoped>
.captcha-input {
  width: 50%;
}

.captcha-image {
  display: inline-block;
  width: 40%;
  height: 40px;
  line-height: 40px;
  text-align: center;
  background-color: #f0f0f0;
  margin-left: 10px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
}

:deep(.el-dialog) {
  z-index: 1000; /* 确保对话框在 header 下面 */
}
</style>