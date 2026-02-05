import React from 'react'
import { GlobeDemo } from './hero-globe'
import { ArcPosition, Country } from '@/data/countries'
import { Button } from './ui/button'
import { Highlight } from './ui/hero-highlight'

export const HeroSection = ( { arcData, markers }: { arcData: ArcPosition[], markers: Country[] } ) => {
  return (
   <div className="hero-gradient grid grid-cols-1 md:grid-cols-2 min-h-screen md:min-h-[80vh] w-full">
    <div className="col-span-1 flex flex-col  md:justify-center items-center px-5 md:pl-20">
      <div className="flex flex-col gap-7">
      <div className="flex flex-col gap-2">

      <h1 className="text-4xl md:text-6xl font-bold text-center md:text-left">
      Measuring <Highlight>Responsible AI</Highlight> Worldwide
      </h1>
      <p className="text-base md:text-lg text-muted-foreground text-center md:text-left">
      GIRAI assesses national AI policies, public-sector use, and safeguards using evidence-based, comparable indicators across countries.
        </p>
      </div>
      <div className="flex flex-row gap-2 justify-center md:justify-start">
        <Button variant="default" size="lg">
          Explore Index
        </Button>
      </div>
      </div>
    </div>
    <div className="col-span-1 order-first md:order-last  overflow-visible min-h-[100px]">
      <GlobeDemo arcData={arcData} markers={markers} />
    </div>
   </div>
  )
}
