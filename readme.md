# GFW 域名工具 API

## 目录
- [项目概述](#项目概述)
- [快速开始](#快速开始)
- [API文档](#api-文档)
- [说明与使用建议](#说明与使用建议)
- [常见问题解答](#常见问题解答)

---

## 项目概述

GFW 域名工具 API 是一个轻量级服务，用于处理和分发 GFWList 域名数据。主要功能包括：

- 实时获取和处理官方 GFWList 数据
- 提供多种格式的输出 (纯文本、CSV、JSON)
- 特别优化支持 iKuai 路由器的域名分流规则
- 基于 Cloudflare Workers 的边缘缓存加速

### 主要特性

✔ 自动更新 - 定期从官方源同步最新 GFWList  
✔ 高性能 - 边缘缓存加速响应  
✔ 多格式支持 - 满足不同使用场景  
✔ 简单易用 - 清晰的 RESTful API 接口

## 快速开始

### 获取域名列表

```bash
curl https://gfw.api.yangzifun.org/api/gfwlist_processed
```

### 生成 iKuai CSV

```bash
curl "https://gfw.api.yangzifun.org/api/gfwlist.csv" -o gfwlist.csv
```

## API 文档

### 端点概览

| 端点 | 方法 | 格式 | 缓存 | 描述 |
|------|------|------|------|------|
| `/api/gfwlist_processed` | GET | text/plain | 30分钟 | 获取处理后的纯净域名列表 |
| `/api/gfwlist_raw` | GET | text/plain | 60分钟 | 获取原始Base64编码的GFWList |
| `/api/gfwlist.csv` | GET | text/csv | - | 生成iKuai兼容的CSV文件 |
| `/api/gfwlist_new.csv` | GET | text/csv | - | 生成新版分组JSON格式CSV |

### 详细说明

#### 1. 纯净域名列表 (`/api/gfwlist_processed`)

**功能**:  
提供经过处理的GFW域名列表，已移除注释、白名单规则和无效条目，提取根域名并去重排序。

**示例请求**:
```bash
curl https://gfw.api.yangzifun.org/api/gfwlist_processed
```

**响应示例**:
```
0rz.tw
1000giri.net
10beasts.net
...
```

**典型用途**:
- 域名黑名单同步
- 网络过滤规则生成
- 数据分析与监控

#### 2. 原始GFWList (`/api/gfwlist_raw`)

**功能**:  
获取未经处理的原始Base64编码GFWList内容。

**示例请求**:
```bash
curl https://gfw.api.yangzifun.org/api/gfwlist_raw
```

#### 3. iKuai CSV (`/api/gfwlist.csv`)

**功能**:  
生成可直接导入iKuai路由器的域名分流规则CSV。

**参数**:
| 参数 | 类型 | 说明 | 默认值 |
|------|------|------|------|
| start_id | int | 规则起始ID | 1 |
| interface | string | 应用线路 | wan3 |
| src_addr | string | 源地址 | 内网 |

**示例请求**:
```bash
# 使用默认参数
curl "https://gfw.api.yangzifun.org/api/gfwlist.csv" -o rules.csv

# 自定义参数
curl "https://gfw.api.yangzifun.org/api/gfwlist.csv?start_id=100&interface=wan1" -o custom_rules.csv
```

#### 4. 新版CSV (`/api/gfwlist_new.csv`)

**功能**:  
生成支持分组JSON格式的新版CSV。

**示例请求**:
```bash
curl "https://gfw.api.yangzifun.org/api/gfwlist_new.csv" -o new_rules.csv
```

**响应结构**:
```csv
id,group_name,group_value
1,分类名称,[{"domain":"example.com","comment":""},...]
```

## **5. 说明与使用建议**

### 5.1 资源说明

- 源数据基于官方 GFWList：`https://raw.githubusercontent.com/gfwlist/gfwlist/master/gfwlist.txt`
- 处理规则去除注释/白名单、提取域名，然后去重并排序。
- 该工具在 `Cloudflare Workers` 中执行，同时结合 `cf.cacheTtl` 进行边缘缓存加速。

### 5.2 性能与缓存

- `/api/gfwlist_processed` 缓存 30 分钟；加速请求并减少上游压力。
- `/api/gfwlist_raw` 缓存 60 分钟；保持与上游列表同步。
- CSV 生成端点同样依赖处理结果，不再单独缓存。若要强制更新，可等待缓存过期后重新请求。

### 5.3 典型集成场景

- iKuai 路由器导入：使用 `/api/gfwlist.csv` 生成结构化规则。
- 高级配置平台：使用 `/api/gfwlist_new.csv` 生成可转换为 `group_name/group_value` 的 JSON CSV。
- 自定义程序：使用 `/api/gfwlist_processed` 直接获取域名数据，进行缓存、分析或同步操作。

### 5.4 排错参考

1. 访问 `/` 页面正常显示，说明服务在线且脚本部署成功。
2. `/api/gfwlist_raw` 返回 Base64 文本，说明上游源可访问。如果失败，可能是 GitHub raw 访问受限。
3. 若 `/api/gfwlist_processed` 内容为空或报错：检查网络、上游响应，或 `atob` 解码是否异常。

### 5.5 贡献指南

#### 开发环境设置

1. **克隆仓库**
   ```bash
   git clone https://github.com/YZFN/gfw.git
   cd gfw
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **本地测试**
   ```bash
   npm test
   ```

#### 贡献流程

1. 创建新分支：
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. 实现变更后运行测试：
   ```bash
   npm test
   ```

3. 提交代码：
   ```bash
   git commit -m "feat: your commit message"
   ```

4. 推送并创建Pull Request

#### 贡献范围

我们特别欢迎以下类型的贡献：

- **新功能**:
  - 添加新的域名分类规则
  - 支持更多路由器格式输出

- **优化改进**:
  - 性能优化建议
  - 代码结构改进
  - 文档完善

- **问题修复**:
  - Bug修复
  - 边缘情况处理

#### 代码规范

- 遵循现有代码风格
- 添加适当的注释
- 保持单文件结构简洁
- 提交信息遵循约定式提交规范

#### 测试要求

所有提交必须通过以下测试：
- 基础语法检查
- 核心功能测试
- 边缘情况测试

测试命令：
```bash
npm test
```

#### 文档更新

如果变更影响功能或接口，请同步更新：
- README文档
- 示例代码
- 参数说明

## 6. 常见问题解答

### Q1: 如何强制更新缓存的数据？
A: 缓存会在指定时间后自动失效(30分钟/1小时)。如需立即更新，可以：
1. 等待缓存过期
2. 添加随机查询参数如 `?v=2` 绕过缓存

### Q2: 为什么某些域名没有被正确分类？
A: 分类基于关键词匹配。如果发现分类不准确：
1. 检查 `DOMAIN_CATEGORY_MAP` 中的关键词
2. 提交PR添加新的关键词
3. 或创建issue说明具体情况

### Q3: CSV文件导入iKuai失败怎么办？
A: 请检查：
1. CSV格式是否正确
2. 文件编码是否为UTF-8
3. iKuai系统版本是否支持该格式
4. 尝试减少单次导入的规则数量

### Q4: API返回空数据可能的原因？
A: 可能原因包括：
1. 网络连接问题
2. 上游GFWList不可用
3. 数据处理过程出错
4. 缓存未及时更新

### Q5: 如何贡献新的域名分类？
A: 步骤如下：
1. Fork项目仓库
2. 修改 `DOMAIN_CATEGORY_MAP`
3. 添加测试用例
4. 提交Pull Request
5. 等待审核合并

### Q6: 能否增加对其他路由器的支持？
A: 欢迎贡献对其他路由器的支持：
1. 研究目标路由器的规则格式
2. 实现对应的生成器函数
3. 添加测试和文档
4. 提交PR

### Q7: 如何本地测试API变更？
A: 使用Cloudflare Workers CLI:
```bash
npm install -g @cloudflare/wrangler
wrangler dev
```
然后访问 `http://localhost:8787`
