import React, { useState } from 'react';
import { HandLoader } from '@/components/common';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const LoaderTest = () => {
  const [showFullScreen, setShowFullScreen] = useState(false);

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">HandLoader 动画测试</h1>
          <p className="text-muted-foreground">展示不同尺寸和模式的手势加载动画</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 小尺寸 */}
          <Card>
            <CardHeader>
              <CardTitle>小尺寸 (sm)</CardTitle>
              <CardDescription>适合小型组件内使用</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center items-center h-32">
              <HandLoader size="sm" />
            </CardContent>
          </Card>

          {/* 中等尺寸 */}
          <Card>
            <CardHeader>
              <CardTitle>中等尺寸 (md)</CardTitle>
              <CardDescription>默认尺寸，适合大多数场景</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center items-center h-32">
              <HandLoader size="md" />
            </CardContent>
          </Card>

          {/* 大尺寸 */}
          <Card>
            <CardHeader>
              <CardTitle>大尺寸 (lg)</CardTitle>
              <CardDescription>适合重要的加载场景</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center items-center h-32">
              <HandLoader size="lg" />
            </CardContent>
          </Card>
        </div>

        {/* 带文本动画的版本 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>带文本动画 - 默认文本</CardTitle>
              <CardDescription>显示面试相关的动态文本</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center items-center h-48">
              <HandLoader size="md" showText />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>带文本动画 - 自定义文本</CardTitle>
              <CardDescription>自定义轮播文本内容</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center items-center h-48">
              <HandLoader
                size="md"
                showText
                customTexts={[
                  "正在初始化系统",
                  "正在加载用户数据",
                  "正在连接到服务器",
                  "正在验证用户权限",
                  "系统准备就绪"
                ]}
              />
            </CardContent>
          </Card>
        </div>

        {/* 全屏模式测试 */}
        <Card>
          <CardHeader>
            <CardTitle>全屏模式测试</CardTitle>
            <CardDescription>点击按钮体验全屏加载效果，再次点击关闭</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={() => setShowFullScreen(!showFullScreen)}
            >
              {showFullScreen ? '关闭全屏模式' : '开启全屏模式'}
            </Button>
          </CardContent>
        </Card>

        {/* 自定义样式示例 */}
        <Card>
          <CardHeader>
            <CardTitle>自定义样式示例</CardTitle>
            <CardDescription>带有自定义背景和边框的加载动画</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center items-center space-x-8">
              <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
                <HandLoader size="md" />
              </div>
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-2 border-blue-200 dark:border-blue-800">
                <HandLoader size="md" />
              </div>
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border-2 border-green-200 dark:border-green-800">
                <HandLoader size="md" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 使用示例代码 */}
        <Card>
          <CardHeader>
            <CardTitle>使用示例</CardTitle>
            <CardDescription>如何在你的组件中使用HandLoader</CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
              <code>{`import { HandLoader } from '@/components/common';

// 基本使用
<HandLoader />

// 不同尺寸
<HandLoader size="sm" />
<HandLoader size="md" />
<HandLoader size="lg" />

// 全屏模式
<HandLoader fullScreen />

// 带文本动画
<HandLoader showText />

// 全屏 + 文本动画
<HandLoader fullScreen showText />

// 自定义文本内容
<HandLoader
  showText
  customTexts={[
    "正在处理请求",
    "分析数据中",
    "生成结果中"
  ]}
/>

// 自定义样式
<HandLoader className="my-custom-class" />`}</code>
            </pre>
          </CardContent>
        </Card>

        {/* 全屏加载器 */}
        {showFullScreen && <HandLoader fullScreen showText />}
      </div>
    </div>
  );
};
