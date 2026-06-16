import React from 'react'
import Image from 'next/image'
import { GlobeDemo } from './hero-globe'
import { ArcPosition, Country } from '@/data/countries'


export const HeroSection = ( { arcData, markers }: { arcData: ArcPosition[], markers: Country[] } ) => {
  return (
    <div className='md:p-6'>
   <div className=" relative grid grid-cols-1 md:grid-cols-2 min-h-screen md:min-h-[80vh] w-full overflow-hidden">
    <Image
      src="/decor1.png"
      alt=""
      aria-hidden
      width={111}
      height={109}
      className="pointer-events-none select-none absolute top-0 left-0  lg:w-[111px] h-[109px] z-0"
      priority
    />
    <Image
      src="/decor2.png"
      alt=""
      aria-hidden
      width={111}
      height={120}
      className="pointer-events-none select-none absolute top-0 right-0  lg:w-[111px] h-[120px] z-0"
      priority
    />
    <Image
      src="/decor3.png"
      alt=""
      aria-hidden
      width={197}
      height={215}
      className="pointer-events-none select-none absolute bottom-0 left-0 lg:bottom-[-30px] lg:left-[-20px] w-20  lg:w-[197px] h-auto z-0"
      priority
    />
    <Image
      src="/decor4.png"
      alt=""
      aria-hidden
      width={170}
      height={178}
      className="pointer-events-none select-none absolute bottom-[-50px] right-0  lg:w-[170px] h-[178px] z-0"
      priority
    />
    <div className="relative z-10 col-span-1 flex flex-col  md:justify-center items-center px-5 md:pl-20">
      <div className="flex flex-col gap-7">
      <div className="flex flex-col gap-2">

      <h1 className="text-4xl md:text-6xl font-medium text-center md:text-left leading-auto">
      Igniting global action on <span className="text-primary">responsible AI</span>, with local evidence.
      </h1>
      <p className="text-base md:text-2xl mt-4 text-muted-foreground text-center md:text-left">
      Unlike indexes that assess AI through adoption and application, GIRAI examines responsible AI through a human rights lens — measuring not just whether countries are building AI, but whether they are building it in ways that protect people&apos;s rights, dignity, and freedoms.
        </p>
      </div>
      {/* <div className="flex flex-row gap-2 justify-center md:justify-start">
        <Button variant="default" size="lg" asChild>
          <Link href="/evidence">Explore Index</Link>
        </Button>
      </div> */}
      </div>
    </div>
    <div className="relative z-10 col-span-1 order-first md:order-last  overflow-visible min-h-[100px]">
      <GlobeDemo arcData={arcData} markers={markers} />
    </div>
   </div>
   </div>
  )
}
