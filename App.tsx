import React from 'react';
import Scene from './components/Scene';

const App: React.FC = () => {
  return (
    <div className="relative w-full h-screen overflow-hidden text-white bg-black">
      <Scene />
    </div>
  );
};

export default App;