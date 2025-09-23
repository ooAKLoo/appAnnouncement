// 风格定义 - 控制内容的视觉样式
export const styles = {
  minimal: {
    id: 'minimal',
    name: '简约',
    icon: 'Circle',
    description: '平面设计，简洁干净',
    // 功能列表样式
    featureCard: {
      background: 'bg-white/5',
      border: 'border border-white/10',
      padding: 'p-4',
      radius: 'rounded-lg',
      icon: 'text-2xl',
      title: 'text-lg font-medium',
      description: 'text-sm text-white/80',
      layout: 'flex items-start gap-4'
    },
    // 活动信息样式
    eventCard: {
      background: 'bg-white/5',
      border: 'border border-white/20',
      padding: 'p-6',
      radius: 'rounded-xl',
      title: 'text-2xl font-bold',
      description: 'text-lg',
      discount: 'text-4xl font-bold text-yellow-400'
    }
  },
  light: {
    id: 'light',
    name: '轻盈',
    icon: 'Square',
    description: '轻薄透明，现代感强',
    // 功能列表样式
    featureCard: {
      background: 'bg-white/10',
      border: 'border border-white/20',
      padding: 'p-6',
      radius: 'rounded-2xl',
      icon: 'text-3xl',
      title: 'text-xl font-semibold',
      description: 'text-white/90',
      layout: 'text-center space-y-3'
    },
    // 活动信息样式
    eventCard: {
      background: 'bg-white/10',
      border: 'border-2 border-white/30',
      padding: 'p-8',
      radius: 'rounded-2xl',
      title: 'text-3xl font-bold',
      description: 'text-xl',
      discount: 'text-5xl font-bold text-yellow-300'
    }
  },
  rich: {
    id: 'rich',
    name: '丰富',
    icon: 'Hexagon',
    description: '层次丰富，视觉饱满',
    // 功能列表样式
    featureCard: {
      background: 'bg-gradient-to-br from-white/15 to-white/5',
      border: 'border border-white/30 shadow-lg',
      padding: 'p-8',
      radius: 'rounded-3xl',
      icon: 'text-4xl',
      title: 'text-2xl font-bold',
      description: 'text-lg text-white/95 leading-relaxed',
      layout: 'text-center space-y-4'
    },
    // 活动信息样式
    eventCard: {
      background: 'bg-gradient-to-br from-white/20 to-white/5',
      border: 'border-2 border-white/40 shadow-2xl',
      padding: 'p-12',
      radius: 'rounded-3xl',
      title: 'text-4xl font-bold',
      description: 'text-2xl',
      discount: 'text-6xl font-bold bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent'
    }
  },
  elegant: {
    id: 'elegant',
    name: '优雅',
    icon: 'Triangle',
    description: '精致典雅，商务风格',
    // 功能列表样式
    featureCard: {
      background: 'bg-white/8',
      border: 'border-l-4 border-white/50 border-r border-t border-b border-white/20',
      padding: 'p-6 pl-8',
      radius: 'rounded-r-xl',
      icon: 'text-3xl',
      title: 'text-xl font-semibold',
      description: 'text-white/85 leading-relaxed',
      layout: 'flex items-start gap-6'
    },
    // 活动信息样式
    eventCard: {
      background: 'bg-white/12',
      border: 'border-2 border-white/40',
      padding: 'p-10',
      radius: 'rounded-2xl',
      title: 'text-3xl font-bold tracking-wide',
      description: 'text-xl tracking-wide',
      discount: 'text-5xl font-bold text-amber-300 tracking-wider'
    }
  }
};

// 获取所有风格
export function getAllStyles() {
  return Object.values(styles);
}

// 根据风格ID获取风格配置
export function getStyleById(styleId) {
  return styles[styleId] || styles.minimal;
}