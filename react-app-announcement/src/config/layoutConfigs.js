export const SPECIAL_LAYOUT_CONFIGS = {
  topBottom: {
    container: 'min-h-screen max-w-4xl mx-auto px-5 py-16 flex flex-col items-center justify-center relative',
    wrapper: 'flex flex-col items-center gap-16 w-full',
    phoneContainer: 'max-w-md min-h-[600px] flex justify-center items-center relative order-1',
    leftContent: 'w-full max-w-2xl order-2',
    features: 'mt-8 space-y-4',
    event: 'bg-white/10 backdrop-blur-md border border-white/30 rounded-2xl p-8 mt-8',
    buttons: 'flex flex-col sm:flex-row gap-4 justify-center mt-8'
  },
  diagonal: {
    container: 'min-h-screen max-w-7xl mx-auto px-8 flex items-center justify-center relative overflow-hidden',
    wrapper: 'relative w-full h-screen flex items-center',
    wrapperStyle: { width: '100%', height: '100vh', padding: '60px 0' },
    leftContentStyle: { 
      width: '50%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      height: '80vh',
      paddingRight: '60px',
      zIndex: 20
    },
    phoneContainerStyle: {
      position: 'absolute',
      right: '0',
      bottom: '0',
      width: '50%',
      height: '100%',
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'flex-end',
      zIndex: 10
    },
    leftContent: 'flex flex-col justify-between h-full',
    phoneContainer: '',
    buttons: 'flex gap-4'
  }
};

export const LAYOUT_CONFIGS = {
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
  },
  elegant: {
    container: 'min-h-screen max-w-6xl mx-auto px-5 py-15 flex items-center justify-center relative',
    wrapper: 'flex items-center justify-between z-10',
    leftContent: 'flex-1 max-w-lg text-white',
    phoneContainer: 'flex-1 max-w-md min-h-[600px] flex justify-center items-center relative',
    logo: 'flex items-center gap-4 mb-10',
    title: 'text-4xl font-bold leading-tight mb-6',
    subtitle: 'text-lg text-white/90 leading-relaxed mb-10',
    features: 'space-y-6 mb-10',
    event: 'bg-white/10 backdrop-blur-md border border-white/30 rounded-2xl p-8 mb-10',
    buttons: 'flex flex-col sm:flex-row gap-4'
  },
  hero: {
    container: 'min-h-screen max-w-7xl mx-auto px-5 py-16 flex flex-col items-center justify-center relative text-center',
    wrapper: 'flex flex-col items-center w-full',
    leftContent: 'max-w-4xl mb-16',
    phoneContainer: 'max-w-md min-h-[600px] flex justify-center items-center relative',
    logo: 'flex items-center justify-center gap-6 mb-12',
    title: 'text-6xl font-bold leading-tight mb-8',
    subtitle: 'text-2xl text-white/90 leading-relaxed mb-12',
    features: 'grid grid-cols-1 md:grid-cols-3 gap-8 mb-16',
    event: 'bg-white/10 backdrop-blur-md border border-white/30 rounded-3xl p-12 mb-16',
    buttons: 'flex flex-col sm:flex-row gap-6 justify-center'
  },
  grid: {
    container: 'min-h-screen max-w-7xl mx-auto px-5 py-16 flex flex-col items-center justify-center relative',
    wrapper: 'w-full',
    leftContent: 'text-center mb-16',
    phoneContainer: 'max-w-md min-h-[600px] flex justify-center items-center relative mx-auto mb-16',
    logo: 'flex items-center justify-center gap-4 mb-8',
    title: 'text-5xl font-bold leading-tight mb-6',
    subtitle: 'text-xl text-white/90 leading-relaxed mb-12',
    features: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16',
    event: 'max-w-2xl mx-auto bg-white/10 backdrop-blur-md border border-white/30 rounded-2xl p-10 mb-16',
    buttons: 'flex flex-col sm:flex-row gap-4 justify-center'
  },
  film: {
    container: 'min-h-screen max-w-6xl mx-auto px-5 flex items-center justify-center relative',
    wrapper: 'border-4 border-dashed border-white/40 rounded-3xl p-12 flex items-center justify-between z-10 backdrop-blur-sm',
    leftContent: 'flex-1 max-w-lg text-white',
    phoneContainer: 'flex-1 max-w-md min-h-[600px] flex justify-center items-center relative',
    logo: 'flex items-center gap-4 mb-10',
    title: 'text-4xl font-bold leading-tight mb-6',
    subtitle: 'text-lg text-white/90 leading-relaxed mb-10',
    features: 'space-y-6 mb-10',
    event: 'bg-white/10 backdrop-blur-md border border-white/30 rounded-2xl p-8 mb-10',
    buttons: 'flex flex-col sm:flex-row gap-4'
  },
  tag: {
    container: 'min-h-screen max-w-6xl mx-auto px-5 flex items-center justify-center relative',
    wrapper: 'flex items-center justify-between z-10',
    leftContent: 'flex-1 max-w-lg text-white relative',
    phoneContainer: 'flex-1 max-w-md min-h-[600px] flex justify-center items-center relative',
    logo: 'flex items-center gap-4 mb-10 relative',
    title: 'text-4xl font-bold leading-tight mb-6 relative',
    subtitle: 'text-lg text-white/90 leading-relaxed mb-10',
    features: 'space-y-6 mb-10',
    event: 'bg-white/10 backdrop-blur-md border border-white/30 rounded-2xl p-8 mb-10 relative',
    buttons: 'flex flex-col sm:flex-row gap-4'
  },
  overlay: {
    container: 'min-h-screen max-w-6xl mx-auto px-5 flex items-center justify-center relative',
    wrapper: 'flex items-center justify-between z-10 relative',
    leftContent: 'flex-1 max-w-lg text-white relative',
    phoneContainer: 'flex-1 max-w-md min-h-[600px] flex justify-center items-center relative',
    logo: 'flex items-center gap-4 mb-10',
    title: 'text-6xl font-black leading-none mb-8 absolute top-0 left-0 right-0 text-center text-white/20 pointer-events-none z-0',
    subtitle: 'text-lg text-white/90 leading-relaxed mb-10 relative z-10',
    features: 'space-y-6 mb-10 relative z-10',
    event: 'bg-white/10 backdrop-blur-md border border-white/30 rounded-2xl p-8 mb-10 relative z-10',
    buttons: 'flex flex-col sm:flex-row gap-4 relative z-10'
  },
  featureGrid: {
    container: 'min-h-screen max-w-5xl mx-auto px-5 py-16 flex flex-col items-center justify-center relative',
    wrapper: 'flex flex-col items-center w-full',
    leftContent: 'w-full max-w-4xl text-center mb-16',
    phoneContainer: 'max-w-lg min-h-[600px] flex justify-center items-center relative',
    logo: 'flex items-center justify-center gap-4 mb-8',
    title: 'text-4xl font-bold leading-tight mb-8',
    subtitle: 'text-lg leading-relaxed mb-12',
    features: 'grid grid-cols-1 md:grid-cols-3 gap-8 mb-16',
    event: 'bg-white/10 backdrop-blur-md border border-white/30 rounded-2xl p-8 mb-12',
    buttons: 'flex flex-col sm:flex-row gap-4 justify-center mb-16'
  },
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
  }
};