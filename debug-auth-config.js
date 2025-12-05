/**
 * Google OAuth 配置调试脚本
 *
 * 使用方法:
 * node debug-auth-config.js
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 开始检查 Google OAuth 配置...\n');

// 1. 检查环境变量
console.log('📋 1. 环境变量检查');
console.log('='.repeat(60));

const envVars = [
  'NEXT_PUBLIC_BASE_URL',
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'BETTER_AUTH_SECRET'
];

const envStatus = {};
envVars.forEach(varName => {
  const value = process.env[varName];
  envStatus[varName] = !!value;

  if (value) {
    // 显示部分值（隐藏敏感信息）
    let displayValue = value;
    if (varName.includes('SECRET') || varName.includes('CLIENT_ID')) {
      displayValue = value.substring(0, 10) + '...' + value.substring(value.length - 4);
    }
    console.log(`✅ ${varName}: ${displayValue}`);
  } else {
    console.log(`❌ ${varName}: 未设置`);
  }
});

// 2. 检查 .env 文件
console.log('\n📄 2. .env 文件检查');
console.log('='.repeat(60));

const envFiles = ['.env', '.env.local', '.env.production', '.env.production.local'];
const foundEnvFiles = [];

envFiles.forEach(fileName => {
  const filePath = path.join(process.cwd(), fileName);
  if (fs.existsSync(filePath)) {
    foundEnvFiles.push(fileName);
    console.log(`✅ 找到: ${fileName}`);

    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const lines = content.split('\n');

      envVars.forEach(varName => {
        const line = lines.find(l => l.startsWith(varName));
        if (line) {
          const value = line.split('=')[1]?.trim().replace(/["']/g, '');
          if (varName === 'NEXT_PUBLIC_BASE_URL') {
            console.log(`   ${varName} = ${value}`);
          } else {
            console.log(`   ${varName} = ${value ? value.substring(0, 10) + '...' : '(空)'}`);
          }
        }
      });
    } catch (error) {
      console.log(`   ⚠️ 无法读取文件: ${error.message}`);
    }
  }
});

if (foundEnvFiles.length === 0) {
  console.log('⚠️ 未找到任何 .env 文件');
}

// 3. 检查 Better Auth 配置
console.log('\n🔐 3. Better Auth 配置检查');
console.log('='.repeat(60));

try {
  const authConfigPath = path.join(process.cwd(), 'src/lib/auth.ts');
  if (fs.existsSync(authConfigPath)) {
    console.log('✅ 找到 auth.ts');
    const content = fs.readFileSync(authConfigPath, 'utf-8');

    // 检查 baseURL 配置
    if (content.includes('baseURL:')) {
      const baseUrlMatch = content.match(/baseURL:\s*(.+?)(?:,|\n)/);
      if (baseUrlMatch) {
        console.log(`   baseURL 配置: ${baseUrlMatch[1].trim()}`);
      }
    }

    // 检查 Google OAuth 配置
    if (content.includes('google:')) {
      console.log('   ✅ Google OAuth 配置存在');
      if (content.includes('GOOGLE_CLIENT_ID')) {
        console.log('   ✅ 使用环境变量 GOOGLE_CLIENT_ID');
      }
      if (content.includes('GOOGLE_CLIENT_SECRET')) {
        console.log('   ✅ 使用环境变量 GOOGLE_CLIENT_SECRET');
      }
    } else {
      console.log('   ❌ 未找到 Google OAuth 配置');
    }
  } else {
    console.log('❌ 未找到 src/lib/auth.ts');
  }
} catch (error) {
  console.log(`⚠️ 检查失败: ${error.message}`);
}

// 4. 检查 social-login-button 组件
console.log('\n🔘 4. Social Login Button 组件检查');
console.log('='.repeat(60));

try {
  const componentPath = path.join(process.cwd(), 'src/components/auth/social-login-button.tsx');
  if (fs.existsSync(componentPath)) {
    console.log('✅ 找到 social-login-button.tsx');
    const content = fs.readFileSync(componentPath, 'utf-8');

    // 检查 callbackURL 处理
    if (content.includes('getUrlWithLocale')) {
      console.log('   ✅ 使用 getUrlWithLocale 生成回调 URL (绝对路径)');
    } else if (content.includes('callbackURL') || content.includes('callbackUrl')) {
      console.log('   ⚠️ 包含 callbackURL，但可能不是使用绝对路径');

      // 尝试找到 callbackURL 的定义
      const callbackMatch = content.match(/callbackURL?:\s*(.+?)(?:,|\n)/g);
      if (callbackMatch) {
        console.log('   回调 URL 配置:');
        callbackMatch.forEach(match => {
          console.log(`   - ${match.trim()}`);
        });
      }
    }

    // 检查是否有 console.log
    if (content.includes('console.log')) {
      const logMatches = content.match(/console\.log\([^)]+\)/g);
      if (logMatches) {
        console.log('   ℹ️ 找到调试日志:');
        logMatches.forEach(log => {
          console.log(`   - ${log}`);
        });
      }
    }
  } else {
    console.log('❌ 未找到 social-login-button.tsx');
  }
} catch (error) {
  console.log(`⚠️ 检查失败: ${error.message}`);
}

// 5. 检查 URL 工具函数
console.log('\n🔗 5. URL 工具函数检查');
console.log('='.repeat(60));

try {
  const urlsPath = path.join(process.cwd(), 'src/lib/urls/urls.ts');
  if (fs.existsSync(urlsPath)) {
    console.log('✅ 找到 urls.ts');
    const content = fs.readFileSync(urlsPath, 'utf-8');

    // 检查 baseUrl 定义
    const baseUrlMatch = content.match(/const baseUrl\s*=\s*([^;]+);/);
    if (baseUrlMatch) {
      console.log('   baseUrl 定义:');
      console.log(`   ${baseUrlMatch[0]}`);
    }

    // 检查 getUrlWithLocale 函数
    if (content.includes('function getUrlWithLocale') || content.includes('getUrlWithLocale')) {
      console.log('   ✅ getUrlWithLocale 函数存在');

      // 检查函数实现
      const funcMatch = content.match(/function getUrlWithLocale[\s\S]+?return[\s\S]+?;/);
      if (funcMatch) {
        console.log('   函数实现:');
        funcMatch[0].split('\n').forEach(line => {
          if (line.trim()) {
            console.log(`   ${line}`);
          }
        });
      }
    }
  } else {
    console.log('❌ 未找到 urls.ts');
  }
} catch (error) {
  console.log(`⚠️ 检查失败: ${error.message}`);
}

// 6. 生成测试 URL
console.log('\n🧪 6. 生成测试 URL');
console.log('='.repeat(60));

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
console.log(`Base URL: ${baseUrl}`);

const testUrls = {
  '登录页面': `${baseUrl}/auth/login`,
  '登录页面 (带回调)': `${baseUrl}/auth/login?callbackUrl=${encodeURIComponent('/dashboard')}`,
  'Dashboard': `${baseUrl}/dashboard`,
  'Google OAuth 启动': `${baseUrl}/api/auth/signin/google?callbackURL=${encodeURIComponent(baseUrl + '/dashboard')}`,
  'Google OAuth 回调': `${baseUrl}/api/auth/callback/google`,
  'Session API': `${baseUrl}/api/auth/get-session`
};

Object.entries(testUrls).forEach(([name, url]) => {
  console.log(`\n${name}:`);
  console.log(`   ${url}`);
});

// 7. 检查 middleware
console.log('\n\n🛡️ 7. Middleware 检查');
console.log('='.repeat(60));

try {
  const middlewarePath = path.join(process.cwd(), 'src/middleware.ts');
  if (fs.existsSync(middlewarePath)) {
    console.log('✅ 找到 middleware.ts');
    const content = fs.readFileSync(middlewarePath, 'utf-8');

    // 检查是否有登录重定向逻辑
    if (content.includes('DEFAULT_LOGIN_REDIRECT')) {
      console.log('   ✅ 包含登录重定向逻辑');
    }

    // 检查保护路由
    if (content.includes('protectedRoutes')) {
      console.log('   ✅ 包含保护路由检查');
    }

    // 检查 session cookie 检查
    if (content.includes('better-auth.session_token')) {
      console.log('   ✅ 检查 session token cookie');
    }

    // 检查 console.log
    if (content.includes('console.log')) {
      const logMatches = content.match(/console\.log\([^)]+\)/g);
      if (logMatches) {
        console.log('   ℹ️ 找到调试日志（可在部署时查看）:');
        logMatches.slice(0, 3).forEach(log => {
          console.log(`   - ${log.substring(0, 60)}...`);
        });
      }
    }
  } else {
    console.log('❌ 未找到 middleware.ts');
  }
} catch (error) {
  console.log(`⚠️ 检查失败: ${error.message}`);
}

// 8. 总结和建议
console.log('\n\n📊 8. 检查总结');
console.log('='.repeat(60));

const issues = [];
const warnings = [];

if (!envStatus.NEXT_PUBLIC_BASE_URL) {
  issues.push('NEXT_PUBLIC_BASE_URL 未设置');
}
if (!envStatus.GOOGLE_CLIENT_ID) {
  issues.push('GOOGLE_CLIENT_ID 未设置');
}
if (!envStatus.GOOGLE_CLIENT_SECRET) {
  issues.push('GOOGLE_CLIENT_SECRET 未设置');
}
if (!envStatus.BETTER_AUTH_SECRET) {
  issues.push('BETTER_AUTH_SECRET 未设置');
}

if (process.env.NEXT_PUBLIC_BASE_URL && !process.env.NEXT_PUBLIC_BASE_URL.startsWith('https://')) {
  warnings.push('NEXT_PUBLIC_BASE_URL 应该使用 HTTPS（生产环境）');
}

console.log('\n严重问题:');
if (issues.length === 0) {
  console.log('✅ 未发现严重问题');
} else {
  issues.forEach(issue => console.log(`❌ ${issue}`));
}

console.log('\n警告:');
if (warnings.length === 0) {
  console.log('✅ 未发现警告');
} else {
  warnings.forEach(warning => console.log(`⚠️ ${warning}`));
}

console.log('\n\n💡 调试建议:');
console.log('='.repeat(60));
console.log(`
1. 在生产环境部署前确保：
   - NEXT_PUBLIC_BASE_URL 设置为 https://seedream4-5.io
   - GOOGLE_CLIENT_ID 和 GOOGLE_CLIENT_SECRET 已正确配置
   - Google Cloud Console 中的授权重定向 URI 包含：
     https://seedream4-5.io/api/auth/callback/google

2. 部署后在浏览器中测试：
   - 打开浏览器开发者工具（F12）
   - 访问: ${baseUrl}/auth/login?callbackUrl=/dashboard
   - 查看控制台日志，应该能看到:
     * "social login button, callbackUrl"
     * "login form, callbackUrl"
   - 点击 Google 登录按钮
   - 观察网络请求和重定向流程

3. 使用调试工具：
   - 将 debug-google-auth.html 复制到 public/ 目录
   - 访问: ${baseUrl}/debug-google-auth.html
   - 运行所有测试并导出日志

4. 检查服务器日志：
   - 在 Vercel/其他平台查看实时日志
   - 搜索 "middleware" 和 "auth" 相关日志
   - 查看是否有重定向或错误信息

5. 验证 Google Cloud Console 配置：
   - 授权的 JavaScript 来源: https://seedream4-5.io
   - 授权的重定向 URI: https://seedream4-5.io/api/auth/callback/google
`);

console.log('\n✅ 检查完成！\n');
