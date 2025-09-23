import React from 'react';

function BackgroundDecorations() {
  return (
    <>
      <div className="fixed top-10 left-10 w-32 h-32 bg-white/5 rounded-full blur-xl animate-float"></div>
      <div className="fixed bottom-20 right-20 w-48 h-48 bg-white/3 rounded-full blur-2xl animate-float-delay"></div>
    </>
  );
}

export default BackgroundDecorations;