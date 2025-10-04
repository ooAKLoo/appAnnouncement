// 素材贴纸数据管理

// 素材分类配置 - 所有文件已统一为 {category}_{number}.svg 格式
export const STICKER_CATEGORIES = {
  arrows: {
    id: 'arrows',
    name: 'Arrows',
    displayName: '箭头',
    path: '/stickers/arrows/',
    icon: '➡️',
    count: 185,
    filePattern: (i) => `arrow_${i}.svg`
  },
  doodles: {
    id: 'doodles',
    name: 'Doodles',
    displayName: '涂鸦',
    path: '/stickers/doodles/',
    icon: '✏️',
    count: 350,
    filePattern: (i) => `doodle_${i}.svg`
  },
  illustrations: {
    id: 'illustrations',
    name: 'Illustrations',
    displayName: '插图',
    path: '/stickers/illustrations/',
    icon: '🎨',
    count: 54,
    filePattern: (i) => `illustration_${i}.svg`
  },
  infographic: {
    id: 'infographic',
    name: 'Infographic',
    displayName: '信息图',
    path: '/stickers/infographic/',
    icon: '📊',
    count: 11,
    filePattern: (i) => `infographic_${i}.svg`
  },
  underlines: {
    id: 'underlines',
    name: 'Underlines',
    displayName: '下划线',
    path: '/stickers/underlines/',
    icon: '📏',
    count: 32,
    filePattern: (i) => `underline_${i}.svg`
  },
  brands: {
    id: 'brands',
    name: 'Brands',
    displayName: '品牌标志',
    path: '/stickers/brands/',
    icon: '🏢',
    items: [
      { id: 'apple', name: 'Apple', fileName: 'apple.svg' },
      { id: 'android', name: 'Android', fileName: 'android.svg' },
      { id: 'windows', name: 'Windows', fileName: 'windows.svg' },
      { id: 'microsoft', name: 'Microsoft', fileName: 'microsoft.svg' },
      { id: 'mac', name: 'macOS', fileName: 'mac.svg' },
      { id: 'app-store', name: 'App Store', fileName: 'app-store.svg' },
      { id: 'google-play', name: 'Google Play', fileName: 'google-play.svg' }
    ]
  }
};

// 获取所有分类
export const getAllCategories = () => {
  return Object.values(STICKER_CATEGORIES);
};

// 获取指定分类的素材列表
export const getStickersInCategory = (categoryId) => {
  const category = STICKER_CATEGORIES[categoryId];
  if (!category) return [];

  // 品牌标志分类使用 items 数组
  if (category.items) {
    return category.items.map(item => ({
      id: `${categoryId}_${item.id}`,
      categoryId: categoryId,
      fileName: item.fileName,
      filePath: `${category.path}${item.fileName}`,
      name: item.name,
      thumbnail: `${category.path}${item.fileName}`
    }));
  }

  // 其他分类使用计数器生成
  const stickers = [];
  for (let i = 1; i <= category.count; i++) {
    stickers.push({
      id: `${categoryId}_${i}`,
      categoryId: categoryId,
      fileName: category.filePattern(i),
      filePath: `${category.path}${category.filePattern(i)}`,
      name: `${category.displayName} ${i}`,
      thumbnail: `${category.path}${category.filePattern(i)}` // 实际项目中可以生成缩略图
    });
  }
  return stickers;
};

// 搜索素材
export const searchStickers = (query, categoryId = null) => {
  const categories = categoryId
    ? [STICKER_CATEGORIES[categoryId]]
    : Object.values(STICKER_CATEGORIES);

  const results = [];
  categories.forEach(category => {
    if (!category) return;

    const stickers = getStickersInCategory(category.id);
    const filtered = stickers.filter(sticker =>
      sticker.name.toLowerCase().includes(query.toLowerCase()) ||
      sticker.fileName.toLowerCase().includes(query.toLowerCase())
    );
    results.push(...filtered);
  });

  return results;
};

// 获取分类统计信息
export const getCategoryStats = () => {
  const categories = getAllCategories();
  const totalCount = categories.reduce((sum, cat) => {
    // 品牌分类使用 items.length，其他使用 count
    return sum + (cat.items ? cat.items.length : cat.count);
  }, 0);

  return {
    totalCategories: categories.length,
    totalStickers: totalCount,
    categories: categories.map(cat => ({
      id: cat.id,
      name: cat.displayName,
      count: cat.items ? cat.items.length : cat.count
    }))
  };
};
