import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Copy, Check, X } from 'lucide-react';

/**
 * 模板代码预览面板
 * 显示实时生成的模板配置代码
 */
function TemplateCodePanel() {
  const { state, toggleTemplateEditMode } = useApp();
  const [copied, setCopied] = useState(false);

  // 监听状态变化
  React.useEffect(() => {
    console.log('🎨 [TemplateCodePanel] templateEditMode:', state.templateEditMode);
    console.log('🎨 [TemplateCodePanel] templateConfigCode:', state.templateConfigCode);
  }, [state.templateEditMode, state.templateConfigCode]);

  if (!state.templateEditMode) {
    console.log('🎨 [TemplateCodePanel] 不显示面板，templateEditMode=false');
    return null;
  }

  const handleCopy = () => {
    if (state.templateConfigCode) {
      navigator.clipboard.writeText(state.templateConfigCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 w-[500px] bg-gray-900 text-white rounded-xl shadow-2xl overflow-hidden z-50">
      {/* 头部 */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <h3 className="text-sm font-medium">模板配置代码</h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="p-1.5 hover:bg-gray-700 rounded transition-colors"
            title="复制代码"
          >
            {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
          </button>
          <button
            onClick={toggleTemplateEditMode}
            className="p-1.5 hover:bg-gray-700 rounded transition-colors"
            title="关闭"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* 代码内容 */}
      <div className="p-4 max-h-[400px] overflow-auto">
        {state.templateConfigCode ? (
          <pre className="text-xs font-mono text-gray-300 whitespace-pre-wrap break-words">
            {state.templateConfigCode}
          </pre>
        ) : (
          <div className="text-gray-500 text-sm text-center py-8">
            拖动或调整元素大小以生成配置代码
          </div>
        )}
      </div>

      {/* 提示 */}
      <div className="px-4 py-2 bg-gray-800/50 border-t border-gray-700 text-xs text-gray-400">
        💡 提示: 选中元素后拖动或调整大小，代码会自动更新
      </div>
    </div>
  );
}

export default TemplateCodePanel;
