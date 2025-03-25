//import { Suspense, lazy } from 'react';
//const HomePage = lazy(() => import('./pages/HomePage.tsx'));

const Analyticspage: React.FunctionComponent = () => 
{
        return (
            <>
            <div className="container py-14 max-w-5xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <div className="bg-white border-2 border-black shadow-xl rounded-xl px-5 py-10 text-center flex flex-col justify-center items-center gap-5 md:max-w-[280px] mx-auto">
          <p className="text-xl font-semibold">1</p>
          <p className="text-sm text-black/80 leading-relaxed">
          my favorite 1
          </p>
        </div>
        <div className="bg-white border-2 border-black shadow-md rounded-xl px-5 py-10 text-center flex flex-col justify-center items-center gap-5 md:max-w-[280px] mx-auto">
          <p className="text-xl font-semibold">2</p>
          <p className="text-sm text-black/80">
          my favorite  2
          </p>
         
        </div>
        <div className="bg-white border-2 border-black shadow-md rounded-xl px-5 py-10 text-center flex flex-col justify-center items-center gap-5 md:max-w-[280px] mx-auto">
        
          <p className="text-xl font-semibold">3</p>
          <p className="text-sm text-black/80">
          my favorite  3
          </p>    
        </div>
      </div>
    </div>
            </>
        );
    };
    export default Analyticspage