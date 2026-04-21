'use client';

import dynamic from 'next/dynamic';

const WebGLScene = dynamic(() => import('./WebGLScene'), { ssr: false });

export default function WebGLSceneLoader() {
  return <WebGLScene />;
}
