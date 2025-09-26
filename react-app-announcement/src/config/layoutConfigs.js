
// 布局配置 - 只保留实际使用的模板
export const LAYOUT_CONFIGS = {
  classic: {
    container: 'min-h-screen max-w-6xl mx-auto px-5 flex items-center justify-center relative',
    wrapper: 'flex items-center justify-between z-10',
    leftContent: 'flex-1 max-w-lg text-white animate-fadeInLeft',
    phoneContainer: 'flex-1 max-w-md min-h-[600px] flex justify-center items-center relative',
    logo: 'flex items-center gap-4 mb-12',
    title: 'text-5xl font-bold leading-tight mb-6 animate-fadeInUp',
    subtitle: 'text-lg text-white/90 leading-relaxed mb-10 animate-fadeInUp',
    features: 'space-y-6 mb-10',
    event: 'bg-white/10 backdrop-blur-md border border-white/30 rounded-2xl p-8 mb-10',
    buttons: 'flex flex-col sm:flex-row gap-4 animate-fadeInUp'
  },
  center: {
    container: 'min-h-screen max-w-4xl mx-auto px-5 flex flex-col items-center justify-center relative text-center',
    wrapper: 'flex flex-col items-center w-full',
    leftContent: 'max-w-2xl order-1 text-center',
    phoneContainer: 'min-h-[600px] order-2 w-full max-w-xl flex justify-center items-center relative',
    logo: 'flex items-center justify-center gap-4 mb-8',
    title: 'text-4xl md:text-5xl font-bold leading-tight mb-5',
    subtitle: 'text-lg opacity-85 mb-8',
    features: 'grid grid-cols-1 md:grid-cols-2 gap-6 mb-8',
    event: 'bg-white/10 backdrop-blur-md border border-white/30 rounded-2xl p-8 mb-8',
    buttons: 'flex flex-col sm:flex-row gap-4 justify-center'
  },
  minimal: {
    container: 'min-h-screen max-w-6xl mx-auto px-5 flex items-center justify-center relative',
    wrapper: 'flex flex-row-reverse items-center justify-between z-10',
    leftContent: 'flex-1 max-w-md text-white',
    phoneContainer: 'flex-1 max-w-md min-h-[600px] flex justify-center items-center relative',
    logo: 'flex items-center gap-4 mb-8',
    title: 'text-4xl font-bold leading-tight mb-6',
    subtitle: 'text-lg text-white/90 leading-relaxed mb-8',
    features: 'space-y-4 mb-6',
    event: 'bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-6 mb-6',
    buttons: 'flex flex-col sm:flex-row gap-4'
  }
};