import { lazy, Suspense } from 'react';

const Robot3D = lazy(() => import('./Robot3D'));

function RobotFallback() {
  return (
    <div className="robot-3d-fallback">
      <img src="/logo-mu.png" alt="" width={80} height={80} />
    </div>
  );
}

export default function Robot3DLazy(props) {
  return (
    <Suspense fallback={<RobotFallback />}>
      <Robot3D {...props} />
    </Suspense>
  );
}
